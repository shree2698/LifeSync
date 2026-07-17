import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { AccountService } from "@lifesync/services"
import { AccountType } from "@prisma/client"

const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["CASH", "BANK", "WALLET", "CREDIT_CARD", "UPI", "INVESTMENT"]),
  balance: z.coerce.number().default(0),
  currency: z.string().default("USD"),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbAccounts = await prisma.account.findMany({
        where: { userId: mockUserId, isArchived: false },
        orderBy: { name: "asc" },
      })
      return NextResponse.json({ success: true, message: "Accounts loaded", data: dbAccounts })
    }

    const res = await AccountService.getAccounts()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = accountSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbAccount = await prisma.account.create({
        data: {
          name: validatedData.name,
          type: validatedData.type as AccountType,
          balance: validatedData.balance,
          currency: validatedData.currency,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Account created successfully", data: dbAccount })
    }

    const res = await AccountService.addAccount(validatedData as any)
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
      return NextResponse.json({ success: false, message: "Account ID is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      await prisma.account.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Account deleted successfully" })
    }

    const res = await AccountService.deleteAccount(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
