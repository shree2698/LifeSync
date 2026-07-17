import { NextResponse } from "next/server"
import * as z from "zod"
import { CalendarService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  start: z.string().min(1, "Start date-time is required"),
  end: z.string().min(1, "End date-time is required"),
  allDay: z.boolean().optional(),
  recurringRule: z.string().nullable().optional(),
})

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbEvents = await prisma.calendarEvent.findMany({
        orderBy: { start: "asc" },
      })
      return NextResponse.json({ success: true, message: "Calendar events loaded", data: dbEvents })
    }

    const res = await CalendarService.getEvents()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load calendar events" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbEvent = await prisma.calendarEvent.create({
        data: {
          title: validatedData.title,
          description: validatedData.description || null,
          start: new Date(validatedData.start),
          end: new Date(validatedData.end),
          allDay: validatedData.allDay || false,
          recurringRule: validatedData.recurringRule || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Calendar event created", data: dbEvent })
    }

    const res = await CalendarService.createEvent({
      title: validatedData.title,
      description: validatedData.description || null,
      start: validatedData.start,
      end: validatedData.end,
      allDay: validatedData.allDay || false,
      recurringRule: validatedData.recurringRule || null,
    })
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create calendar event" },
      { status: 500 }
    )
  }
}
