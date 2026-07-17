import { NextResponse } from "next/server"
import * as z from "zod"
import { HabitService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const createHabitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"]).optional(),
  reminderTime: z.string().nullable().optional(),
  category: z.string().optional(),
})

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbHabits = await prisma.habit.findMany({
        include: { logs: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Habits loaded", data: dbHabits })
    }

    const res = await HabitService.getHabits()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load habits" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createHabitSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbHabit = await prisma.habit.create({
        data: {
          title: validatedData.title,
          frequency: validatedData.frequency || "DAILY",
          reminderTime: validatedData.reminderTime || null,
          category: validatedData.category || "Personal",
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Habit created", data: dbHabit })
    }

    const res = await HabitService.createHabit({
      title: validatedData.title,
      frequency: validatedData.frequency || "DAILY",
      customFreq: null,
      reminderTime: validatedData.reminderTime || null,
      category: validatedData.category || "Personal",
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
      { success: false, message: err.message || "Failed to create habit" },
      { status: 500 }
    )
  }
}
