import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbIncomes = await prisma.income.findMany({
        where: { userId: mockUserId },
        include: { transaction: { include: { category: true } } },
        orderBy: { transaction: { date: "desc" } },
      })
      return NextResponse.json({ success: true, message: "Income logs loaded", data: dbIncomes })
    }

    // Fallback: Filter mock transactions
    const { mockTransactions, mockTransactionCategories } = require("@lifesync/services")
    const incomeTxs = mockTransactions
      .filter((t: any) => t.type === "INCOME")
      .map((t: any) => ({
        id: "inc-" + t.id,
        transactionId: t.id,
        source: mockTransactionCategories.find((c: any) => c.id === t.categoryId)?.name || "Other",
        transaction: {
          ...t,
          category: mockTransactionCategories.find((c: any) => c.id === t.categoryId) || null,
        },
      }))
    return NextResponse.json({ success: true, message: "Income logs loaded", data: incomeTxs })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
