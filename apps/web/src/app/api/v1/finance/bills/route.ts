import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { BillService } from "@lifesync/services"

const billSchema = z.object({
  name: z.string().min(1, "Bill name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  dueDate: z.string(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbBills = await prisma.bill.findMany({
        where: { userId: mockUserId },
        orderBy: { dueDate: "asc" },
      })
      return NextResponse.json({ success: true, message: "Bills loaded", data: dbBills })
    }

    const res = await BillService.getBills()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = billSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbBill = await prisma.bill.create({
        data: {
          name: validatedData.name,
          amount: validatedData.amount,
          dueDate: new Date(validatedData.dueDate),
          isRecurring: validatedData.isRecurring,
          recurringInterval: validatedData.recurringInterval || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Bill scheduled successfully", data: dbBill })
    }

    const res = await BillService.addBill(validatedData)
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

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, message: "Bill ID parameter is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const bill = await prisma.bill.findUnique({ where: { id } })
      if (!bill) {
        return NextResponse.json({ success: false, message: "Bill not found" }, { status: 404 })
      }

      await prisma.$transaction(async (tx) => {
        await tx.bill.update({
          where: { id },
          data: { status: "PAID" },
        })

        // Auto-log bill payment transaction
        const accounts = await tx.account.findMany({ where: { userId: bill.userId, isArchived: false } })
        const defaultAcc = accounts.find((a) => a.isDefault) || accounts[0]
        if (defaultAcc) {
          const dbTx = await tx.transaction.create({
            data: {
              accountId: defaultAcc.id,
              amount: bill.amount,
              type: "EXPENSE",
              description: `Payment for bill: ${bill.name}`,
              date: new Date(),
              userId: bill.userId,
            },
          })
          await tx.account.update({
            where: { id: defaultAcc.id },
            data: { balance: { decrement: bill.amount } },
          })
          await tx.expense.create({
            data: {
              userId: bill.userId,
              transactionId: dbTx.id,
              notes: `Auto-logged bill payment for ${bill.name}`,
            },
          })
        }
      })

      return NextResponse.json({ success: true, message: "Bill paid successfully" })
    }

    const res = await BillService.payBill(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
