import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { HairCareService } from "@lifesync/services"

const hairRoutineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  washDays: z.array(z.string()),
  oilDays: z.array(z.string()),
  maskDays: z.array(z.string()),
  products: z.array(z.string()),
})

const hairLogSchema = z.object({
  routineId: z.string().uuid().nullable().optional(),
  washDone: z.boolean(),
  oilDone: z.boolean(),
  maskDone: z.boolean(),
  hairFallCount: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const logsOnly = searchParams.get("logsOnly") === "true"

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      if (logsOnly) {
        const dbLogs = await prisma.hairLog.findMany({
          where: { userId: mockUserId },
          orderBy: { date: "desc" },
        })
        return NextResponse.json({ success: true, message: "Hair logs loaded", data: dbLogs })
      }

      const dbRoutines = await prisma.hairRoutine.findMany({
        where: { userId: mockUserId },
        include: { logs: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Hair routines loaded", data: dbRoutines })
    }

    if (logsOnly) {
      const res = await HairCareService.getLogs()
      return NextResponse.json(res)
    }

    const res = await HairCareService.getRoutines()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const mockUserId = "u-1"

    // If logging hair activity
    if (body.washDone !== undefined || body.oilDone !== undefined || body.maskDone !== undefined) {
      const validatedLog = hairLogSchema.parse(body)
      if (process.env.DATABASE_URL) {
        const dbLog = await prisma.hairLog.create({
          data: {
            routineId: validatedLog.routineId || null,
            washDone: validatedLog.washDone,
            oilDone: validatedLog.oilDone,
            maskDone: validatedLog.maskDone,
            hairFallCount: validatedLog.hairFallCount || null,
            notes: validatedLog.notes || null,
            date: validatedLog.date ? new Date(validatedLog.date) : new Date(),
            userId: mockUserId,
          },
        })
        return NextResponse.json({ success: true, message: "Hair care logged", data: dbLog })
      }

      const res = await HairCareService.logHairActivity(validatedLog)
      return NextResponse.json(res)
    }

    // Otherwise create hair routine
    const validatedRoutine = hairRoutineSchema.parse(body)
    if (process.env.DATABASE_URL) {
      const dbRoutine = await prisma.hairRoutine.create({
        data: {
          name: validatedRoutine.name,
          washDays: validatedRoutine.washDays,
          oilDays: validatedRoutine.oilDays,
          maskDays: validatedRoutine.maskDays,
          products: validatedRoutine.products,
          active: true,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Hair routine created", data: dbRoutine })
    }

    const res = await HairCareService.addRoutine(validatedRoutine)
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
