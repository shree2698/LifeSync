import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { ProviderService, ConnectionService } from "@lifesync/services"

const connectSchema = z.object({
  providerId: z.string().uuid("Invalid Provider ID"),
  action: z.enum(["CONNECT", "DISCONNECT"]),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const providers = await prisma.provider.findMany({
        where: { isEnabled: true },
      })
      return NextResponse.json({ success: true, message: "Providers loaded", data: providers })
    }

    const res = await ProviderService.getProviders()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = connectSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      if (validated.action === "CONNECT") {
        const existing = await prisma.connection.findFirst({
          where: { userId: mockUserId, providerId: validated.providerId },
        })
        if (existing) {
          return NextResponse.json({ success: true, message: "Provider already connected", data: existing })
        }

        const connection = await prisma.connection.create({
          data: {
            userId: mockUserId,
            providerId: validated.providerId,
            isEnabled: true,
            status: "CONNECTED",
          },
        })

        await prisma.oAuthToken.create({
          data: {
            connectionId: connection.id,
            accessToken: "mock_gcal_access_token_" + Math.random(),
            expiresAt: new Date(Date.now() + 3600000),
          },
        })

        await prisma.integrationAudit.create({
          data: {
            userId: mockUserId,
            connectionId: connection.id,
            action: "CONNECT",
            details: `Connected provider ID ${validated.providerId} successfully.`,
          },
        })

        return NextResponse.json({ success: true, message: "Connected successfully", data: connection })
      } else {
        const existing = await prisma.connection.findFirst({
          where: { userId: mockUserId, providerId: validated.providerId },
        })
        if (!existing) {
          return NextResponse.json({ success: false, message: "Connection not found" }, { status: 404 })
        }

        await prisma.connection.delete({ where: { id: existing.id } })

        await prisma.integrationAudit.create({
          data: {
            userId: mockUserId,
            connectionId: null,
            action: "DISCONNECT",
            details: `Disconnected provider ID ${validated.providerId} successfully.`,
          },
        })

        return NextResponse.json({ success: true, message: "Disconnected successfully" })
      }
    }

    if (validated.action === "CONNECT") {
      const res = await ConnectionService.addConnection(validated.providerId)
      return NextResponse.json(res)
    } else {
      const mockUserId = "u-1"
      const currentConns = await ConnectionService.getConnections()
      const conn = currentConns.data?.find((c) => c.providerId === validated.providerId && c.userId === mockUserId)
      if (!conn) {
        return NextResponse.json({ success: false, message: "Connection not found" }, { status: 404 })
      }
      const res = await ConnectionService.deleteConnection(conn.id)
      return NextResponse.json(res)
    }
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
