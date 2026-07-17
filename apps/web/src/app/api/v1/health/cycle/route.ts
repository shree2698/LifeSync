import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { WomenHealthService } from "@lifesync/services"

const cycleSymptomSchema = z.object({
  name: z.string().min(1),
  severity: z.string().nullable().optional(),
})

const cycleSchema = z.object({
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  symptoms: z.array(cycleSymptomSchema).optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbCycles = await prisma.cycle.findMany({
        where: { userId: mockUserId },
        include: { symptoms: true },
        orderBy: { startDate: "desc" },
      })
      return NextResponse.json({ success: true, message: "Cycles loaded", data: dbCycles })
    }

    const res = await WomenHealthService.getCycles()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const mockUserId = "u-1"

    // If cycleId is present, we log a symptom for an existing cycle
    if (body.cycleId) {
      const validatedSym = cycleSymptomSchema.parse(body)
      if (process.env.DATABASE_URL) {
        const dbSym = await prisma.cycleSymptom.create({
          data: {
            cycleId: body.cycleId,
            name: validatedSym.name,
            severity: validatedSym.severity || null,
          },
        })
        return NextResponse.json({ success: true, message: "Symptom logged", data: dbSym })
      }

      const res = await WomenHealthService.addSymptom(body.cycleId, validatedSym.name, validatedSym.severity)
      return NextResponse.json(res)
    }

    // Otherwise create a cycle log
    const validatedCycle = cycleSchema.parse(body)
    const start = new Date(validatedCycle.startDate)
    let cycleLength = null
    if (validatedCycle.endDate) {
      const end = new Date(validatedCycle.endDate)
      cycleLength = Math.round((end.getTime() - start.getTime()) / 86400000)
    }

    if (process.env.DATABASE_URL) {
      const dbCycle = await prisma.cycle.create({
        data: {
          startDate: start,
          endDate: validatedCycle.endDate ? new Date(validatedCycle.endDate) : null,
          cycleLength,
          notes: validatedCycle.notes || null,
          userId: mockUserId,
          symptoms: {
            create: validatedCycle.symptoms?.map((s) => ({
              name: s.name,
              severity: s.severity || null,
            })) || [],
          },
        },
        include: { symptoms: true },
      })
      return NextResponse.json({ success: true, message: "Cycle logged", data: dbCycle })
    }

    const res = await WomenHealthService.addCycle(validatedCycle)
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
    const isSymptom = searchParams.get("symptom") === "true"

    if (!id) {
      return NextResponse.json({ success: false, message: "ID parameter is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      if (isSymptom) {
        await prisma.cycleSymptom.delete({ where: { id } })
        return NextResponse.json({ success: true, message: "Cycle symptom deleted" })
      } else {
        await prisma.cycle.delete({ where: { id } })
        return NextResponse.json({ success: true, message: "Cycle log deleted" })
      }
    }

    if (isSymptom) {
      return NextResponse.json({ success: true, message: "Symptom deleted (offline simulation)" })
    }

    const res = await WomenHealthService.deleteCycle(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
