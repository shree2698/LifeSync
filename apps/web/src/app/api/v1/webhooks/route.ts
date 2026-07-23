import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { WebhookService } from "@lifesync/services"

const webhookSchema = z.object({
  connectionId: z.string().uuid("Invalid Connection ID"),
  url: z.string().url("Invalid Webhook URL"),
  events: z.array(z.string()).default([]),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const webhooks = await prisma.webhook.findMany({
        where: { isEnabled: true },
      })
      return NextResponse.json({ success: true, message: "Webhooks loaded", data: webhooks })
    }

    const res = await WebhookService.getWebhooks()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = webhookSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const webhook = await prisma.webhook.create({
        data: {
          connectionId: validated.connectionId,
          url: validated.url,
          secret: "whsec_" + Math.floor(Math.random() * 1000000),
          events: JSON.stringify(validated.events),
          isEnabled: true,
        },
      })
      return NextResponse.json({ success: true, message: "Webhook registered successfully", data: webhook })
    }

    const res = await WebhookService.registerWebhook(validated.connectionId, validated.url, validated.events)
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
