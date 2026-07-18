import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { ShoppingCategoryService } from "@lifesync/services"

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const categories = await prisma.category.findMany({
        where: {
          OR: [{ userId: mockUserId }, { userId: null }],
        },
        orderBy: { name: "asc" },
      })
      return NextResponse.json({ success: true, message: "Categories loaded", data: categories })
    }

    const res = await ShoppingCategoryService.getCategories()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = categorySchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const category = await prisma.category.create({
        data: {
          name: validated.name,
          color: validated.color || null,
          icon: validated.icon || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Category created successfully", data: category })
    }

    const res = await ShoppingCategoryService.addCategory(validated)
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
