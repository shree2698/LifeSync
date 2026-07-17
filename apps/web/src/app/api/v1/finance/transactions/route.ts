import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { TransactionService } from "@lifesync/services"
import { TransactionType } from "@prisma/client"

const transactionSchema = z.object({
  accountId: z.string().uuid("Invalid Account ID"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  toAccountId: z.string().uuid().nullable().optional(),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbTransactions = await prisma.transaction.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
        include: { category: true, account: true },
      })
      return NextResponse.json({ success: true, message: "Transactions loaded", data: dbTransactions })
    }

    const res = await TransactionService.getTransactions()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = transactionSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      const txDate = validatedData.date ? new Date(validatedData.date) : new Date()

      // Start transaction to execute both transaction creation and account balance adjustments
      const result = await prisma.$transaction(async (tx) => {
        const dbTx = await tx.transaction.create({
          data: {
            accountId: validatedData.accountId,
            toAccountId: validatedData.toAccountId || null,
            categoryId: validatedData.categoryId || null,
            amount: validatedData.amount,
            type: validatedData.type as TransactionType,
            description: validatedData.description || null,
            date: txDate,
            userId: mockUserId,
          },
        })

        // Balance adjustment logic
        if (validatedData.type === "INCOME") {
          await tx.account.update({
            where: { id: validatedData.accountId },
            data: { balance: { increment: validatedData.amount } },
          })
          await tx.income.create({
            data: {
              userId: mockUserId,
              transactionId: dbTx.id,
              source: "Manual Log",
              notes: validatedData.description || null,
            },
          })
        } else if (validatedData.type === "EXPENSE") {
          await tx.account.update({
            where: { id: validatedData.accountId },
            data: { balance: { decrement: validatedData.amount } },
          })
          await tx.expense.create({
            data: {
              userId: mockUserId,
              transactionId: dbTx.id,
              notes: validatedData.description || null,
            },
          })
        } else if (validatedData.type === "TRANSFER" && validatedData.toAccountId) {
          await tx.account.update({
            where: { id: validatedData.accountId },
            data: { balance: { decrement: validatedData.amount } },
          })
          await tx.account.update({
            where: { id: validatedData.toAccountId },
            data: { balance: { increment: validatedData.amount } },
          })
        }

        return dbTx
      })

      return NextResponse.json({ success: true, message: "Transaction logged", data: result })
    }

    const res = await TransactionService.addTransaction(validatedData as any)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, message: "Transaction ID is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const dbTx = await prisma.transaction.findUnique({
        where: { id },
      })
      if (!dbTx) {
        return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 })
      }

      await prisma.$transaction(async (tx) => {
        // Reverse account balances
        if (dbTx.type === "INCOME") {
          await tx.account.update({
            where: { id: dbTx.accountId },
            data: { balance: { decrement: dbTx.amount } },
          })
        } else if (dbTx.type === "EXPENSE") {
          await tx.account.update({
            where: { id: dbTx.accountId },
            data: { balance: { increment: dbTx.amount } },
          })
        } else if (dbTx.type === "TRANSFER" && dbTx.toAccountId) {
          await tx.account.update({
            where: { id: dbTx.accountId },
            data: { balance: { increment: dbTx.amount } },
          })
          await tx.account.update({
            where: { id: dbTx.toAccountId },
            data: { balance: { decrement: dbTx.amount } },
          })
        }

        await tx.transaction.delete({
          where: { id },
        })
      })

      return NextResponse.json({ success: true, message: "Transaction deleted" })
    }

    const res = await TransactionService.deleteTransaction(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
