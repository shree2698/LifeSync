import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { SavingsService } from "@lifesync/services"

const savingsSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.coerce.number().positive("Target amount must be positive"),
  currentAmount: z.coerce.number().default(0),
  deadline: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbGoals = await prisma.savingsGoal.findMany({
        where: { userId: mockUserId },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Savings goals loaded", data: dbGoals })
    }

    const res = await SavingsService.getGoals()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contributeGoalId = searchParams.get("goalId")
    const contributionAmount = searchParams.get("contribution")

    if (contributeGoalId && contributionAmount) {
      const amt = parseFloat(contributionAmount)
      if (isNaN(amt) || amt <= 0) {
        return NextResponse.json({ success: false, message: "Invalid contribution amount" }, { status: 400 })
      }

      if (process.env.DATABASE_URL) {
        const goal = await prisma.savingsGoal.findUnique({ where: { id: contributeGoalId } })
        if (!goal) {
          return NextResponse.json({ success: false, message: "Goal not found" }, { status: 404 })
        }
        const updatedGoalCurrent = goal.currentAmount + amt
        const status = updatedGoalCurrent >= goal.targetAmount ? "COMPLETED" : goal.status
        const updated = await prisma.savingsGoal.update({
          where: { id: contributeGoalId },
          data: { currentAmount: updatedGoalCurrent, status },
        })
        return NextResponse.json({ success: true, message: "Contribution logged", data: updated })
      }

      const res = await SavingsService.addContribution(contributeGoalId, amt)
      return NextResponse.json(res)
    }

    const body = await request.json()
    const validatedData = savingsSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbGoal = await prisma.savingsGoal.create({
        data: {
          name: validatedData.name,
          targetAmount: validatedData.targetAmount,
          currentAmount: validatedData.currentAmount,
          deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Savings goal created", data: dbGoal })
    }

    const res = await SavingsService.addGoal(validatedData)
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
