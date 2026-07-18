import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { PurchaseHistoryService } from "@lifesync/services"

const historySchema = z.object({
  storeName: z.string().nullable().optional(),
  totalAmount: z.coerce.number().default(0),
  itemsCount: z.coerce.number().default(0),
  purchaseDate: z.string().nullable().optional(),
  details: z.string().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const history = await prisma.purchaseHistory.findMany({
        where: { userId: mockUserId },
        orderBy: { purchaseDate: "desc" },
      })
      return NextResponse.json({ success: true, message: "Purchase history loaded", data: history })
    }

    const res = await PurchaseHistoryService.getHistory()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = historySchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const record = await prisma.purchaseHistory.create({
        data: {
          storeName: validated.storeName || "Manual Checkout",
          totalAmount: validated.totalAmount,
          itemsCount: validated.itemsCount,
          purchaseDate: validated.purchaseDate ? new Date(validated.purchaseDate) : new Date(),
          details: validated.details || null,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Purchase history logged successfully", data: record })
    }

    const res = await PurchaseHistoryService.logPurchase({
      storeName: validated.storeName || undefined,
      totalAmount: validated.totalAmount,
      itemsCount: validated.itemsCount,
      purchaseDate: validated.purchaseDate || undefined,
      details: validated.details || undefined,
    })
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
