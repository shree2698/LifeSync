import { NextResponse } from "next/server"
import * as z from "zod"
import { CalendarService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const updateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  allDay: z.boolean().optional(),
  recurringRule: z.string().nullable().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateEventSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const dbEvent = await prisma.calendarEvent.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          start: validatedData.start ? new Date(validatedData.start) : undefined,
          end: validatedData.end ? new Date(validatedData.end) : undefined,
          allDay: validatedData.allDay,
          recurringRule: validatedData.recurringRule,
        },
      })
      return NextResponse.json({ success: true, message: "Calendar event updated", data: dbEvent })
    }

    const res = await CalendarService.updateEvent(id, validatedData)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update calendar event" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (process.env.DATABASE_URL) {
      await prisma.calendarEvent.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Calendar event deleted successfully" })
    }

    const res = await CalendarService.deleteEvent(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete calendar event" },
      { status: 500 }
    )
  }
}
