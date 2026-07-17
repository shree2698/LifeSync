import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { MoodService } from "@lifesync/services"

const moodLogSchema = z.object({
  mood: z.string().min(1, "Mood selection is required"),
  energyLevel: z.number().min(1).max(5),
  stressLevel: z.number().min(1).max(5),
  notes: z.string().nullable().optional(),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLogs = await prisma.moodLog.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
      })
      return NextResponse.json({ success: true, message: "Mood logs loaded", data: dbLogs })
    }

    const res = await MoodService.getLogs()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = moodLogSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLog = await prisma.moodLog.create({
        data: {
          mood: validatedData.mood,
          energyLevel: validatedData.energyLevel,
          stressLevel: validatedData.stressLevel,
          notes: validatedData.notes || null,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Mood logged", data: dbLog })
    }

    const res = await MoodService.addLog(validatedData)
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, message: "ID parameter is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      await prisma.moodLog.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Mood log deleted" })
    }

    const res = await MoodService.deleteLog(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
