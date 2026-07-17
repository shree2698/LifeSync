import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { BudgetService } from "@lifesync/services"

const budgetCategoryLimitSchema = z.object({
  categoryId: z.string().uuid(),
  limitAmount: z.coerce.number().positive(),
})

const budgetSchema = z.object({
  name: z.string().min(1, "Budget name is required"),
  amount: z.coerce.number().positive("Total limit must be positive"),
  startDate: z.string(),
  endDate: z.string(),
  categories: z.array(budgetCategoryLimitSchema).optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbBudgets = await prisma.budget.findMany({
        where: { userId: mockUserId },
        include: { budgetCategories: { include: { category: true } } },
        orderBy: { startDate: "desc" },
      })
      return NextResponse.json({ success: true, message: "Budgets loaded", data: dbBudgets })
    }

    const res = await BudgetService.getBudgets()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = budgetSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      const dbBudget = await prisma.budget.create({
        data: {
          name: validatedData.name,
          amount: validatedData.amount,
          startDate: new Date(validatedData.startDate),
          endDate: new Date(validatedData.endDate),
          userId: mockUserId,
        },
      })

      if (validatedData.categories) {
        await prisma.budgetCategory.createMany({
          data: validatedData.categories.map((c) => ({
            budgetId: dbBudget.id,
            categoryId: c.categoryId,
            limitAmount: c.limitAmount,
          })),
        })
      }

      const completedBudget = await prisma.budget.findUnique({
        where: { id: dbBudget.id },
        include: { budgetCategories: { include: { category: true } } },
      })

      return NextResponse.json({ success: true, message: "Budget limit set", data: completedBudget })
    }

    const res = await BudgetService.addBudget(validatedData)
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
