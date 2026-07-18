import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { PantryService } from "@lifesync/services"

const pantrySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  categoryId: z.string().uuid().nullable().optional(),
  currentQuantity: z.coerce.number().default(0),
  minimumQuantity: z.coerce.number().default(0),
  expiryDate: z.string().nullable().optional(),
  purchaseDate: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const pantry = await prisma.pantryItem.findMany({
        where: { userId: mockUserId },
        include: { category: true },
        orderBy: { name: "asc" },
      })
      return NextResponse.json({ success: true, message: "Pantry loaded", data: pantry })
    }

    const res = await PantryService.getPantry()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = pantrySchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const item = await prisma.pantryItem.create({
        data: {
          name: validated.name,
          categoryId: validated.categoryId || null,
          currentQuantity: validated.currentQuantity,
          minimumQuantity: validated.minimumQuantity,
          expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : null,
          purchaseDate: validated.purchaseDate ? new Date(validated.purchaseDate) : new Date(),
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Pantry item created successfully", data: item })
    }

    const res = await PantryService.addPantryItem(validated)
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
      return NextResponse.json({ success: false, message: "Pantry item ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const quantity = parseFloat(body.currentQuantity)
    if (isNaN(quantity)) {
      return NextResponse.json({ success: false, message: "Valid currentQuantity is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      const item = await prisma.pantryItem.update({
        where: { id },
        data: { currentQuantity: quantity },
        include: { category: true },
      })
      return NextResponse.json({ success: true, message: "Quantity updated successfully", data: item })
    }

    const res = await PantryService.updateQuantity(id, quantity)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
