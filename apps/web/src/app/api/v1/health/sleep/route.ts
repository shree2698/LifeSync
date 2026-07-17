import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { SleepService } from "@lifesync/services"

const sleepLogSchema = z.object({
  startTime: z.string().datetime("Invalid start time ISO format"),
  endTime: z.string().datetime("Invalid end time ISO format"),
  quality: z.number().min(1).max(5, "Quality must be between 1 and 5"),
  notes: z.string().nullable().optional(),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLogs = await prisma.sleepLog.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
      })
      return NextResponse.json({ success: true, message: "Sleep logs loaded", data: dbLogs })
    }

    const res = await SleepService.getLogs()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = sleepLogSchema.parse(body)

    const start = new Date(validatedData.startTime)
    const end = new Date(validatedData.endTime)
    const duration = Math.max(0, (end.getTime() - start.getTime()) / 3600000)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLog = await prisma.sleepLog.create({
        data: {
          startTime: start,
          endTime: end,
          duration,
          quality: validatedData.quality,
          notes: validatedData.notes || null,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Sleep logged", data: dbLog })
    }

    const res = await SleepService.addLog({
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      quality: validatedData.quality,
      notes: validatedData.notes,
      date: validatedData.date,
    })
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
      await prisma.sleepLog.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Sleep log deleted" })
    }

    const res = await SleepService.deleteLog(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
