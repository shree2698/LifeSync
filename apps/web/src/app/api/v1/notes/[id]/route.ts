import { NextResponse } from "next/server"
import * as z from "zod"
import { NoteService } from "@lifesync/services"
import prisma from "@/lib/prisma"

const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().nullable().optional(),
  pinned: z.boolean().optional(),
  folderId: z.string().nullable().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateNoteSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const dbNote = await prisma.note.update({
        where: { id },
        data: {
          title: validatedData.title,
          content: validatedData.content,
          pinned: validatedData.pinned,
          folderId: validatedData.folderId,
        },
      })
      return NextResponse.json({ success: true, message: "Note updated", data: dbNote })
    }

    const res = await NoteService.updateNote(id, validatedData)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update note" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (process.env.DATABASE_URL) {
      await prisma.note.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Note deleted successfully" })
    }

    const res = await NoteService.deleteNote(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete note" },
      { status: 500 }
    )
  }
}
