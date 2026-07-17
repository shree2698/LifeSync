import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { SubscriptionService } from "@lifesync/services"
import { SubscriptionStatus } from "@prisma/client"

const subscriptionSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  billingCycle: z.string().default("MONTHLY"),
  renewalDate: z.string(),
  categoryId: z.string().uuid().nullable().optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbSubs = await prisma.subscription.findMany({
        where: { userId: mockUserId },
        include: { category: true },
        orderBy: { renewalDate: "asc" },
      })
      return NextResponse.json({ success: true, message: "Subscriptions loaded", data: dbSubs })
    }

    const res = await SubscriptionService.getSubscriptions()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = subscriptionSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbSub = await prisma.subscription.create({
        data: {
          name: validatedData.name,
          amount: validatedData.amount,
          billingCycle: validatedData.billingCycle,
          renewalDate: new Date(validatedData.renewalDate),
          categoryId: validatedData.categoryId || null,
          status: "ACTIVE" as SubscriptionStatus,
          userId: mockUserId,
        },
      })
      return NextResponse.json({ success: true, message: "Subscription created", data: dbSub })
    }

    const res = await SubscriptionService.addSubscription(validatedData)
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
