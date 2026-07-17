import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { WaterService } from "@lifesync/services"

const waterLogSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLogs = await prisma.waterLog.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
      })
      return NextResponse.json({ success: true, message: "Water logs loaded", data: dbLogs })
    }

    const res = await WaterService.getLogs()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = waterLogSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLog = await prisma.waterLog.create({
        data: {
          amount: validatedData.amount,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Water logged", data: dbLog })
    }

    const res = await WaterService.addLog(validatedData.amount, validatedData.date)
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
      await prisma.waterLog.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Water log deleted" })
    }

    const res = await WaterService.deleteLog(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
