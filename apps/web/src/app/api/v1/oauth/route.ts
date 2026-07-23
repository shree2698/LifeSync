import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { OAuthService } from "@lifesync/services"

const callbackSchema = z.object({
  code: z.string().min(1, "OAuth code is required"),
  providerId: z.string().uuid("Invalid Provider ID"),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const providerId = searchParams.get("providerId")

    const validated = callbackSchema.parse({ code, providerId })

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
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
          accessToken: "gcal_access_token_mock_" + Math.random(),
          expiresAt: new Date(Date.now() + 3600000),
          scope: "read write",
        },
      })

      return NextResponse.json({ success: true, message: "OAuth callback successful", data: connection })
    }

    const res = await OAuthService.handleCallback(validated.providerId, validated.code)
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
