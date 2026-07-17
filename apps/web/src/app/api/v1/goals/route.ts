import { NextResponse } from "next/server"
import * as z from "zod"
import { GoalService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  target: z.number().optional(),
  deadline: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
})

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbGoals = await prisma.goal.findMany({
        include: { milestones: true, tasks: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Goals loaded", data: dbGoals })
    }

    const res = await GoalService.getGoals()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load goals" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createGoalSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbGoal = await prisma.goal.create({
        data: {
          title: validatedData.title,
          category: validatedData.category || "General",
          target: validatedData.target || 100,
          deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,
          status: validatedData.status as any || "ACTIVE",
          priority: validatedData.priority as any || "MEDIUM",
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Goal created", data: dbGoal })
    }

    const res = await GoalService.createGoal({
      title: validatedData.title,
      category: validatedData.category || "General",
      target: validatedData.target || 100,
      deadline: validatedData.deadline || null,
      status: validatedData.status || "ACTIVE",
      priority: validatedData.priority || "MEDIUM",
    })
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create goal" },
      { status: 500 }
    )
  }
}
