import { NextResponse } from "next/server"
import * as z from "zod"
import { HabitService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const updateHabitSchema = z.object({
  title: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"]).optional(),
  reminderTime: z.string().nullable().optional(),
  category: z.string().optional(),
  streak: z.number().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateHabitSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const dbHabit = await prisma.habit.update({
        where: { id },
        data: {
          title: validatedData.title,
          frequency: validatedData.frequency,
          reminderTime: validatedData.reminderTime,
          category: validatedData.category,
          streak: validatedData.streak,
        },
      })
      return NextResponse.json({ success: true, message: "Habit updated", data: dbHabit })
    }

    const res = await HabitService.updateHabit(id, validatedData)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update habit" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (process.env.DATABASE_URL) {
      await prisma.habit.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Habit deleted successfully" })
    }

    const res = await HabitService.deleteHabit(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete habit" },
      { status: 500 }
    )
  }
}
