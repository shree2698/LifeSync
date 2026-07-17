import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { MedicationService } from "@lifesync/services"

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  schedule: z.string().min(1, "Schedule is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  remindersEnabled: z.boolean().optional(),
  refillReminder: z.boolean().optional(),
})

const medicationLogSchema = z.object({
  medicationId: z.string().uuid("Invalid medication ID"),
  status: z.string().optional(),
  notes: z.string().nullable().optional(),
  takenAt: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const logsOnly = searchParams.get("logsOnly") === "true"
    const medicationId = searchParams.get("medicationId")

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      if (logsOnly) {
        const dbLogs = await prisma.medicationLog.findMany({
          where: medicationId
            ? { medicationId }
            : { medication: { userId: mockUserId } },
          orderBy: { takenAt: "desc" },
        })
        return NextResponse.json({ success: true, message: "Medication logs loaded", data: dbLogs })
      }

      const dbMeds = await prisma.medication.findMany({
        where: { userId: mockUserId },
        include: { logs: true },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Medications loaded", data: dbMeds })
    }

    if (logsOnly) {
      const res = await MedicationService.getMedicationLogs(medicationId || undefined)
      return NextResponse.json(res)
    }

    const res = await MedicationService.getMedications()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const mockUserId = "u-1"

    // If medicationId is present, we log an intake activity
    if (body.medicationId) {
      const validatedLog = medicationLogSchema.parse(body)

      if (process.env.DATABASE_URL) {
        const dbLog = await prisma.medicationLog.create({
          data: {
            medicationId: validatedLog.medicationId,
            takenAt: validatedLog.takenAt ? new Date(validatedLog.takenAt) : new Date(),
            status: validatedLog.status || "TAKEN",
            notes: validatedLog.notes || null,
          },
        })
        return NextResponse.json({ success: true, message: "Medication intake logged", data: dbLog })
      }

      const res = await MedicationService.logMedication(validatedLog)
      return NextResponse.json(res)
    }

    // Otherwise we create a new medication schedule
    const validatedMed = medicationSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const dbMed = await prisma.medication.create({
        data: {
          name: validatedMed.name,
          dosage: validatedMed.dosage,
          schedule: validatedMed.schedule,
          frequency: validatedMed.frequency,
          startDate: new Date(validatedMed.startDate),
          endDate: validatedMed.endDate ? new Date(validatedMed.endDate) : null,
          remindersEnabled: validatedMed.remindersEnabled !== false,
          refillReminder: validatedMed.refillReminder === true,
          active: true,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Medication schedule created", data: dbMed })
    }

    const res = await MedicationService.addMedication(validatedMed)
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
    const isLog = searchParams.get("log") === "true"

    if (!id) {
      return NextResponse.json({ success: false, message: "ID parameter is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      if (isLog) {
        await prisma.medicationLog.delete({ where: { id } })
        return NextResponse.json({ success: true, message: "Medication log deleted" })
      } else {
        await prisma.medication.delete({ where: { id } })
        return NextResponse.json({ success: true, message: "Medication deleted" })
      }
    }

    if (isLog) {
      // Offline fallback: delete from mock list (optional implementation)
      return NextResponse.json({ success: true, message: "Log deleted (offline simulation)" })
    }

    const res = await MedicationService.deleteMedication(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
