import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { FinanceService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      // Load all accounts to compute total balance
      const accounts = await prisma.account.findMany({
        where: { userId: mockUserId, isArchived: false },
      })
      const currentBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

      // Start of month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Load monthly transactions
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: mockUserId,
          date: { gte: startOfMonth },
        },
        include: { category: true },
      })

      const monthlyIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)
      const monthlyExpenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)

      // Budget limit
      const activeBudget = await prisma.budget.findFirst({
        where: {
          userId: mockUserId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      })
      const budgetLimit = activeBudget?.amount || 0
      const remainingBudget = Math.max(0, budgetLimit - monthlyExpenses)

      // Savings aggregate progress
      const savingsGoals = await prisma.savingsGoal.findMany({
        where: { userId: mockUserId },
      })
      const totalGoalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0)
      const totalGoalCurrent = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0)
      const savingsProgress = totalGoalTarget > 0 ? (totalGoalCurrent / totalGoalTarget) * 100 : 0

      // Upcoming unpaid bills
      const upcomingBills = await prisma.bill.findMany({
        where: { userId: mockUserId, status: "UNPAID" },
        orderBy: { dueDate: "asc" },
      })

      // Active subscriptions
      const upcomingSubscriptions = await prisma.subscription.findMany({
        where: { userId: mockUserId, status: "ACTIVE" },
        include: { category: true },
      })

      // Recent 5 transactions
      const recentTransactions = await prisma.transaction.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
        take: 5,
        include: { category: true, account: true },
      })

      // Top categories breakdown
      const categoriesSum = {} as Record<string, number>
      const expenseTxs = await prisma.transaction.findMany({
        where: { userId: mockUserId, type: "EXPENSE" },
        include: { category: true },
      })
      expenseTxs.forEach((t) => {
        const catName = t.category?.name || "Other"
        categoriesSum[catName] = (categoriesSum[catName] || 0) + t.amount
      })
      const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0) || 1
      const topCategories = Object.keys(categoriesSum).map((name) => {
        const amount = categoriesSum[name]
        const cat = expenseTxs.find((t) => t.category?.name === name)?.category
        return {
          name,
          amount,
          percentage: (amount / totalExpense) * 100,
          color: cat?.color || "#9CA3AF",
        }
      }).sort((a, b) => b.amount - a.amount)

      return NextResponse.json({
        success: true,
        message: "Finance dashboard metrics loaded",
        data: {
          currentBalance,
          monthlyIncome,
          monthlyExpenses,
          remainingBudget,
          savingsProgress,
          upcomingBills,
          upcomingSubscriptions,
          recentTransactions,
          topCategories,
        },
      })
    }

    // Mocks Fallback
    const res = await FinanceService.getFinanceDashboard()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
