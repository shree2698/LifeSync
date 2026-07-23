import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { SyncService } from "@lifesync/services"

const syncSchema = z.object({
  connectionId: z.string().uuid("Invalid Connection ID"),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const syncJobs = await prisma.syncJob.findMany({
        where: { connection: { userId: mockUserId } },
        orderBy: { createdAt: "desc" },
        include: { connection: { include: { provider: true } } },
      })
      return NextResponse.json({ success: true, message: "Sync history loaded", data: syncJobs })
    }

    const res = await SyncService.getSyncHistory()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = syncSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const job = await prisma.syncJob.create({
        data: {
          connectionId: validated.connectionId,
          status: "COMPLETED",
          startedAt: new Date(),
          endedAt: new Date(),
          type: "MANUAL",
        },
      })

      await prisma.syncLog.create({
        data: {
          syncJobId: job.id,
          level: "INFO",
          message: "Triggered synchronization job manually.",
        },
      })

      await prisma.connection.update({
        where: { id: validated.connectionId },
        data: { lastSyncedAt: new Date() },
      })

      return NextResponse.json({ success: true, message: "Synchronization completed successfully", data: job })
    }

    const res = await SyncService.triggerSync(validated.connectionId)
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
