import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { IntegrationDashboardService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      const connections = await prisma.connection.findMany({
        where: { userId: mockUserId },
        include: { provider: true },
      })

      const availableIntegrations = await prisma.integration.findMany({
        include: { providers: true },
      })

      const syncHistory = await prisma.syncJob.findMany({
        where: { connection: { userId: mockUserId } },
        orderBy: { createdAt: "desc" },
        include: { connection: { include: { provider: true } } },
        take: 10,
      })

      const auditLogs = await prisma.integrationAudit.findMany({
        where: { userId: mockUserId },
        orderBy: { timestamp: "desc" },
        take: 10,
      })

      const providers = await prisma.provider.findMany()
      const providerHealth = providers.map((p) => {
        const conn = connections.find((c) => c.providerId === p.id)
        return {
          providerName: p.name,
          status: conn ? conn.status : "DISCONNECTED",
          lastChecked: new Date().toISOString(),
        }
      })

      return NextResponse.json({
        success: true,
        message: "Integration dashboard loaded",
        data: {
          connections,
          availableIntegrations,
          syncHistory,
          auditLogs,
          providerHealth,
        },
      })
    }

    const res = await IntegrationDashboardService.getDashboard()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
