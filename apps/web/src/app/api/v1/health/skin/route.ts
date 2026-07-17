import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { SkinCareService } from "@lifesync/services"

const skinRoutineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  products: z.array(z.string()),
  concerns: z.array(z.string()),
})

const skinLogSchema = z.object({
  routineId: z.string().uuid().nullable().optional(),
  completed: z.boolean(),
  acneSeverity: z.string().nullable().optional(),
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
        const dbLogs = await prisma.skinLog.findMany({
          where: { userId: mockUserId },
          orderBy: { date: "desc" },
        })
        return NextResponse.json({ success: true, message: "Skin logs loaded", data: dbLogs })
      }

      const dbRoutines = await prisma.skinRoutine.findMany({
        where: { userId: mockUserId },
        include: { logs: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Skin routines loaded", data: dbRoutines })
    }

    if (logsOnly) {
      const res = await SkinCareService.getLogs()
      return NextResponse.json(res)
    }

    const res = await SkinCareService.getRoutines()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const mockUserId = "u-1"

    // If logging skin routine activity
    if (body.completed !== undefined) {
      const validatedLog = skinLogSchema.parse(body)
      if (process.env.DATABASE_URL) {
        const dbLog = await prisma.skinLog.create({
          data: {
            routineId: validatedLog.routineId || null,
            completed: validatedLog.completed,
            acneSeverity: validatedLog.acneSeverity || null,
            notes: validatedLog.notes || null,
            date: validatedLog.date ? new Date(validatedLog.date) : new Date(),
            userId: mockUserId,
          },
        })
        return NextResponse.json({ success: true, message: "Skin care logged", data: dbLog })
      }

      const res = await SkinCareService.logSkinActivity(validatedLog)
      return NextResponse.json(res)
    }

    // Otherwise create skin routine schedule
    const validatedRoutine = skinRoutineSchema.parse(body)
    if (process.env.DATABASE_URL) {
      const dbRoutine = await prisma.skinRoutine.create({
        data: {
          name: validatedRoutine.name,
          products: validatedRoutine.products,
          concerns: validatedRoutine.concerns,
          active: true,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Skin routine created", data: dbRoutine })
    }

    const res = await SkinCareService.addRoutine(validatedRoutine)
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
