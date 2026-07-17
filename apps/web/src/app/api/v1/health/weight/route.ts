import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { WeightService } from "@lifesync/services"

const weightLogSchema = z.object({
  weight: z.number().positive("Weight must be positive"),
  chest: z.number().nullable().optional(),
  waist: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
  date: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbLogs = await prisma.weightLog.findMany({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
      })
      return NextResponse.json({ success: true, message: "Weight logs loaded", data: dbLogs })
    }

    const res = await WeightService.getLogs()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = weightLogSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      // Try to compute BMI
      let bmi = null
      const profile = await prisma.healthProfile.findUnique({
        where: { userId: mockUserId },
      })
      if (profile && profile.height) {
        const heightM = profile.height / 100
        bmi = parseFloat((validatedData.weight / (heightM * heightM)).toFixed(1))
      }

      const dbLog = await prisma.weightLog.create({
        data: {
          weight: validatedData.weight,
          bmi,
          chest: validatedData.chest || null,
          waist: validatedData.waist || null,
          hips: validatedData.hips || null,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
          userId: mockUserId,
        },
      })

      // Update current weight in health profile
      await prisma.healthProfile.update({
        where: { userId: mockUserId },
        data: { weight: validatedData.weight },
      })

      return NextResponse.json({ success: true, message: "Weight logged", data: dbLog })
    }

    const res = await WeightService.addLog(validatedData)
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
      await prisma.weightLog.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Weight log deleted" })
    }

    const res = await WeightService.deleteLog(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
