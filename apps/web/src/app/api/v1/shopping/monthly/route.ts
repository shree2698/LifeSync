import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { MonthlyEssentialService } from "@lifesync/services"

const essentialSchema = z.object({
  name: z.string().min(1, "Essential name is required"),
  categoryId: z.string().uuid().nullable().optional(),
  targetQuantity: z.coerce.number().default(1),
  unit: z.string().default("pcs"),
  estimatedPrice: z.coerce.number().default(0),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const essentials = await prisma.monthlyEssential.findMany({
        where: { userId: mockUserId },
        include: { category: true },
        orderBy: { name: "asc" },
      })
      return NextResponse.json({ success: true, message: "Essentials loaded", data: essentials })
    }

    const res = await MonthlyEssentialService.getEssentials()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = essentialSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const essential = await prisma.monthlyEssential.create({
        data: {
          name: validated.name,
          categoryId: validated.categoryId || null,
          targetQuantity: validated.targetQuantity,
          unit: validated.unit,
          estimatedPrice: validated.estimatedPrice,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Monthly essential registered", data: essential })
    }

    const res = await MonthlyEssentialService.addEssential(validated)
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
      return NextResponse.json({ success: false, message: "Essential ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const isCompleted = body.isCompleted === true

    if (process.env.DATABASE_URL) {
      const essential = await prisma.monthlyEssential.update({
        where: { id },
        data: { isCompleted },
        include: { category: true },
      })
      return NextResponse.json({ success: true, message: "Status updated successfully", data: essential })
    }

    const res = await MonthlyEssentialService.checkEssential(id, isCompleted)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
