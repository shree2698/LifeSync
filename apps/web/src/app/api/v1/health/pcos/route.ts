import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { PcosService } from "@lifesync/services"

const pcosLogSchema = z.object({
  symptoms: z.array(z.string()),
  weight: z.number().nullable().optional(),
  medicationTaken: z.boolean().optional(),
  waterIntakeMl: z.number().nullable().optional(),
  exerciseMinutes: z.number().nullable().optional(),
  stressLevel: z.number().min(1).max(5).nullable().optional(),
  notes: z.string().nullable().optional(),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLogs = await prisma.pCOSLog.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
      })
      return NextResponse.json({ success: true, message: "PCOS logs loaded", data: dbLogs })
    }

    const res = await PcosService.getLogs()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = pcosLogSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLog = await prisma.pCOSLog.create({
        data: {
          symptoms: validatedData.symptoms,
          weight: validatedData.weight || null,
          medicationTaken: validatedData.medicationTaken || false,
          waterIntakeMl: validatedData.waterIntakeMl || null,
          exerciseMinutes: validatedData.exerciseMinutes || null,
          stressLevel: validatedData.stressLevel || null,
          notes: validatedData.notes || null,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "PCOS log saved", data: dbLog })
    }

    const res = await PcosService.addLog(validatedData)
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
      await prisma.pCOSLog.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "PCOS log deleted" })
    }

    const res = await PcosService.deleteLog(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
