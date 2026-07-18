import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { ShoppingListService } from "@lifesync/services"

const listSchema = z.object({
  name: z.string().min(1, "List name is required"),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const lists = await prisma.shoppingList.findMany({
        where: { userId: mockUserId, isArchived: false },
        include: { items: { include: { category: true } } },
        orderBy: { name: "asc" },
      })
      return NextResponse.json({ success: true, message: "Lists loaded", data: lists })
    }

    const res = await ShoppingListService.getLists()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = listSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const list = await prisma.shoppingList.create({
        data: {
          name: validated.name,
          color: validated.color || null,
          icon: validated.icon || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "List created", data: list })
    }

    const res = await ShoppingListService.addList(validated)
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

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const action = searchParams.get("action") // "rename" | "archive"

    if (!id) {
      return NextResponse.json({ success: false, message: "List ID is required" }, { status: 400 })
    }

    if (action === "archive") {
      if (process.env.DATABASE_URL) {
        await prisma.shoppingList.update({
          where: { id },
          data: { isArchived: true },
        })
        return NextResponse.json({ success: true, message: "List archived" })
      }
      const res = await ShoppingListService.archiveList(id)
      return NextResponse.json(res)
    }

    // Rename action
    const body = await request.json()
    const name = body.name
    if (!name) {
      return NextResponse.json({ success: false, message: "New name is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const list = await prisma.shoppingList.update({
        where: { id },
        data: { name },
      })
      return NextResponse.json({ success: true, message: "List renamed", data: list })
    }

    const res = await ShoppingListService.renameList(id, name)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, message: "List ID is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      await prisma.shoppingList.delete({ where: { id } })
      return NextResponse.json({ success: true, message: "List deleted successfully" })
    }

    const res = await ShoppingListService.deleteList(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
