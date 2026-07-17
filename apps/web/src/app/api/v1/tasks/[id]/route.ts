import { NextResponse } from "next/server"
import * as z from "zod"
import { TaskService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  estimatedDuration: z.number().nullable().optional(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  pinned: z.boolean().optional(),
  favorite: z.boolean().optional(),
  recurringExpr: z.string().nullable().optional(),
  goalId: z.string().nullable().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateTaskSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const dbTask = await prisma.task.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          status: validatedData.status as any,
          priority: validatedData.priority as any,
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
          startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
          time: validatedData.time,
          estimatedDuration: validatedData.estimatedDuration,
          color: validatedData.color,
          icon: validatedData.icon,
          pinned: validatedData.pinned,
          favorite: validatedData.favorite,
          recurringExpr: validatedData.recurringExpr,
          goalId: validatedData.goalId,
        },
      })
      return NextResponse.json({ success: true, message: "Task updated", data: dbTask })
    }

    const res = await TaskService.updateTask(id, validatedData)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (process.env.DATABASE_URL) {
      await prisma.task.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Task deleted successfully" })
    }

    const res = await TaskService.deleteTask(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete task" },
      { status: 500 }
    )
  }
}
