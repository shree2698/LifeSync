import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { WishlistService } from "@lifesync/services"

const wishlistSchema = z.object({
  name: z.string().min(1, "Wishlist item name required"),
  categoryId: z.string().uuid().nullable().optional(),
  desiredPrice: z.coerce.number().default(0),
  priority: z.string().default("MEDIUM"),
  notes: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const wishlist = await prisma.wishlistItem.findMany({
        where: { userId: mockUserId },
        include: { category: true },
        orderBy: { name: "asc" },
      })
      return NextResponse.json({ success: true, message: "Wishlist loaded", data: wishlist })
    }

    const res = await WishlistService.getWishlist()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = wishlistSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const item = await prisma.wishlistItem.create({
        data: {
          name: validated.name,
          categoryId: validated.categoryId || null,
          desiredPrice: validated.desiredPrice,
          priority: validated.priority,
          notes: validated.notes || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Wishlist item created successfully", data: item })
    }

    const res = await WishlistService.addWishlistItem(validated)
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
      return NextResponse.json({ success: false, message: "Wishlist item ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const isPurchased = body.isPurchased === true

    if (process.env.DATABASE_URL) {
      const item = await prisma.wishlistItem.update({
        where: { id },
        data: { isPurchased },
        include: { category: true },
      })
      return NextResponse.json({ success: true, message: "Wishlist item updated successfully", data: item })
    }

    const res = await WishlistService.markPurchased(id, isPurchased)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
