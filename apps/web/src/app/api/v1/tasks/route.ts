import { NextResponse } from "next/server"
import * as z from "zod"
import { TaskService } from "@lifesync/services"
import { TaskStatus, Priority } from "@lifesync/types"
import prisma from "@/lib/prisma"

// Zod schema for task creation
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") as TaskStatus | null
    const priority = searchParams.get("priority") as Priority | null
    const goalId = searchParams.get("goalId")

    // Database check
    if (process.env.DATABASE_URL) {
      const dbTasks = await prisma.task.findMany({
        where: {
          title: { contains: search, mode: "insensitive" },
          status: status || undefined,
          priority: priority || undefined,
          goalId: goalId || undefined,
        },
        include: {
          subtasks: true,
          labels: true,
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Tasks loaded", data: dbTasks })
    }

    // In-memory fallback
    const res = await TaskService.getTasks(
      {
        search,
        status: status ? [status] : null,
        priority: priority ? [priority] : null,
        goalId,
      },
      "NEWEST"
    )
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load tasks" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    if (process.env.DATABASE_URL) {
      // Mock user association (in real app, fetched from Clerk session)
      const mockUserId = "u-1"
      const dbTask = await prisma.task.create({
        data: {
          title: validatedData.title,
          description: validatedData.description || null,
          status: (validatedData.status as any) || "TODO",
          priority: (validatedData.priority as any) || "MEDIUM",
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
          startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
          time: validatedData.time || null,
          estimatedDuration: validatedData.estimatedDuration || null,
          color: validatedData.color || null,
          icon: validatedData.icon || null,
          pinned: validatedData.pinned || false,
          favorite: validatedData.favorite || false,
          recurringExpr: validatedData.recurringExpr || null,
          goalId: validatedData.goalId || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Task created", data: dbTask })
    }

    const res = await TaskService.createTask({
      title: validatedData.title,
      description: validatedData.description || null,
      status: validatedData.status || "TODO",
      priority: validatedData.priority || "MEDIUM",
      dueDate: validatedData.dueDate || null,
      startDate: validatedData.startDate || null,
      time: validatedData.time || null,
      estimatedDuration: validatedData.estimatedDuration || null,
      color: validatedData.color || null,
      icon: validatedData.icon || null,
      pinned: validatedData.pinned || false,
      favorite: validatedData.favorite || false,
      recurringExpr: validatedData.recurringExpr || null,
      goalId: validatedData.goalId || null,
      dependsOnId: null,
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
      { success: false, message: err.message || "Failed to create task" },
      { status: 500 }
    )
  }
}
