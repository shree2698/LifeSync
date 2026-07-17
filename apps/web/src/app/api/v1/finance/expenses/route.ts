import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbExpenses = await prisma.expense.findMany({
        where: { userId: mockUserId },
        include: { transaction: { include: { category: true } } },
        orderBy: { transaction: { date: "desc" } },
      })
      return NextResponse.json({ success: true, message: "Expense logs loaded", data: dbExpenses })
    }

    // Fallback: Filter mock transactions
    const { mockTransactions, mockTransactionCategories } = require("@lifesync/services")
    const expenseTxs = mockTransactions
      .filter((t: any) => t.type === "EXPENSE")
      .map((t: any) => ({
        id: "exp-" + t.id,
        transactionId: t.id,
        notes: t.description || null,
        transaction: {
          ...t,
          category: mockTransactionCategories.find((c: any) => c.id === t.categoryId) || null,
        },
      }))
    return NextResponse.json({ success: true, message: "Expense logs loaded", data: expenseTxs })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
