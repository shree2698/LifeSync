import { NextResponse } from "next/server"
import * as z from "zod"
import { NoteService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().nullable().optional(),
  pinned: z.boolean().optional(),
  folderId: z.string().nullable().optional(),
})

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const dbNotes = await prisma.note.findMany({
        include: { folder: true, tags: true },
        orderBy: { updatedAt: "desc" },
      })
      return NextResponse.json({ success: true, message: "Notes loaded", data: dbNotes })
    }

    const res = await NoteService.getNotes()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load notes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createNoteSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbNote = await prisma.note.create({
        data: {
          title: validatedData.title,
          content: validatedData.content || null,
          pinned: validatedData.pinned || false,
          folderId: validatedData.folderId || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Note created", data: dbNote })
    }

    const res = await NoteService.createNote({
      title: validatedData.title,
      content: validatedData.content || null,
      pinned: validatedData.pinned || false,
      folderId: validatedData.folderId || null,
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
      { success: false, message: err.message || "Failed to create note" },
      { status: 500 }
    )
  }
}
