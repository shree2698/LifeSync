import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { ShoppingItemService } from "@lifesync/services"

const itemSchema = z.object({
  listId: z.string().uuid("Invalid List ID"),
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().default(1),
  unit: z.string().default("pcs"),
  price: z.coerce.number().default(0),
  categoryId: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
  isFavorite: z.boolean().default(false),
})

const updateItemSchema = z.object({
  name: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit: z.string().optional(),
  price: z.coerce.number().optional(),
  isCompleted: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  notes: z.string().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const listId = searchParams.get("listId")
    if (!listId) {
      return NextResponse.json({ success: false, message: "List ID parameter is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const items = await prisma.shoppingItem.findMany({
        where: { listId },
        include: { category: true },
        orderBy: { createdAt: "asc" },
      })
      return NextResponse.json({ success: true, message: "Items loaded", data: items })
    }

    const res = await ShoppingItemService.getItems(listId)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = itemSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const item = await prisma.shoppingItem.create({
        data: {
          listId: validated.listId,
          name: validated.name,
          quantity: validated.quantity,
          unit: validated.unit,
          price: validated.price,
          categoryId: validated.categoryId || null,
          notes: validated.notes || null,
          isFavorite: validated.isFavorite,
        },
      })
      return NextResponse.json({ success: true, message: "Item added successfully", data: item })
    }

    const res = await ShoppingItemService.addItem(validated)
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
    if (!id) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const validated = updateItemSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const updateData = {} as any
      if (validated.name !== undefined) updateData.name = validated.name
      if (validated.quantity !== undefined) updateData.quantity = validated.quantity
      if (validated.unit !== undefined) updateData.unit = validated.unit
      if (validated.price !== undefined) updateData.price = validated.price
      if (validated.isCompleted !== undefined) {
        updateData.isCompleted = validated.isCompleted
        updateData.purchasedAt = validated.isCompleted ? new Date() : null
      }
      if (validated.isFavorite !== undefined) updateData.isFavorite = validated.isFavorite
      if (validated.notes !== undefined) updateData.notes = validated.notes
      if (validated.categoryId !== undefined) updateData.categoryId = validated.categoryId

      const item = await prisma.shoppingItem.update({
        where: { id },
        data: updateData,
        include: { category: true },
      })
      return NextResponse.json({ success: true, message: "Item updated successfully", data: item })
    }

    const res = await ShoppingItemService.updateItem(id, validated as any)
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
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      await prisma.shoppingItem.delete({ where: { id } })
      return NextResponse.json({ success: true, message: "Item deleted successfully" })
    }

    const res = await ShoppingItemService.deleteItem(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
