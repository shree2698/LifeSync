import { NextResponse } from "next/server"
import * as z from "zod"
import { GoalService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const updateGoalSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  target: z.number().optional(),
  deadline: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  progress: z.number().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateGoalSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const dbGoal = await prisma.goal.update({
        where: { id },
        data: {
          title: validatedData.title,
          category: validatedData.category,
          target: validatedData.target,
          deadline: validatedData.deadline ? new Date(validatedData.deadline) : undefined,
          status: validatedData.status as any,
          priority: validatedData.priority as any,
          progress: validatedData.progress,
        },
      })
      return NextResponse.json({ success: true, message: "Goal updated", data: dbGoal })
    }

    const res = await GoalService.updateGoal(id, validatedData)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update goal" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (process.env.DATABASE_URL) {
      await prisma.goal.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Goal deleted successfully" })
    }

    const res = await GoalService.deleteGoal(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete goal" },
      { status: 500 }
    )
  }
}
