import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { FinanceService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      // Start of month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfYear = new Date(now.getFullYear(), 0, 1)

      // Monthly metrics
      const monthlyTransactions = await prisma.transaction.findMany({
        where: {
          userId: mockUserId,
          date: { gte: startOfMonth },
        },
      })
      const monthlyIncome = monthlyTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)
      const monthlyExpense = monthlyTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)
      const monthlySavings = Math.max(0, monthlyIncome - monthlyExpense)

      // Yearly metrics
      const yearlyTransactions = await prisma.transaction.findMany({
        where: {
          userId: mockUserId,
          date: { gte: startOfYear },
        },
      })
      const yearlyIncome = yearlyTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)
      const yearlyExpense = yearlyTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)
      const yearlySavings = Math.max(0, yearlyIncome - yearlyExpense)

      // Category breakdown
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
      const categoryBreakdown = Object.keys(categoriesSum).map((name) => {
        const amount = categoriesSum[name]
        const cat = expenseTxs.find((t) => t.category?.name === name)?.category
        return {
          categoryId: cat?.id || "Other",
          categoryName: name,
          amount,
          percentage: (amount / totalExpense) * 100,
          color: cat?.color || "#9CA3AF",
        }
      })

      // Monthly cashflow data
      const incomeVsExpense = [
        { month: "May", income: 3800, expense: 2100 },
        { month: "Jun", income: 4200, expense: 1900 },
        { month: "Jul", income: monthlyIncome, expense: monthlyExpense },
      ]

      // Savings report
      const savingsGoals = await prisma.savingsGoal.findMany({
        where: { userId: mockUserId },
      })
      const savingsReport = savingsGoals.map((g) => ({
        goalId: g.id,
        goalName: g.name,
        current: g.currentAmount,
        target: g.targetAmount,
        progress: g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0,
      }))

      // Budget report
      const budgets = await prisma.budget.findMany({
        where: { userId: mockUserId },
        include: { budgetCategories: true },
      })
      const budgetReport = budgets.map((b) => {
        const spent = expenseTxs
          .filter((t) => new Date(t.date) >= new Date(b.startDate) && new Date(t.date) <= new Date(b.endDate))
          .reduce((sum, t) => sum + t.amount, 0)
        return {
          budgetId: b.id,
          budgetName: b.name,
          limit: b.amount,
          spent,
          remaining: Math.max(0, b.amount - spent),
        }
      })

      return NextResponse.json({
        success: true,
        message: "Reports generated successfully",
        data: {
          monthlyReport: { income: monthlyIncome, expense: monthlyExpense, savings: monthlySavings },
          yearlyReport: { income: yearlyIncome, expense: yearlyExpense, savings: yearlySavings },
          categoryBreakdown,
          incomeVsExpense,
          savingsReport,
          budgetReport,
        },
      })
    }

    const res = await FinanceService.generateFinanceReport()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
