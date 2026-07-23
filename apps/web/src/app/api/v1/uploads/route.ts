import { NextResponse } from "next/server"
import * as z from "zod"
import { UploadService } from "@lifesync/services"

const uploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  mimeType: z.string().min(1, "Mime type is required"),
  sizeBytes: z.coerce.number().positive("Size must be positive"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = uploadSchema.parse(body)

    const res = await UploadService.handleUpload(validated.fileName, validated.mimeType, validated.sizeBytes)
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
