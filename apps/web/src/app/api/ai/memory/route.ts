import { NextResponse } from "next/server";
import { MemoryPlatform, MemoryUpdateSchema } from "@lifesync/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "u-1";
    const category = searchParams.get("category") as any;

    const memories = await MemoryPlatform.getMemories(userId, category);
    return NextResponse.json({ success: true, data: memories });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed to fetch memories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "EXPORT") {
      const data = await MemoryPlatform.exportMemories(body.userId || "u-1");
      return NextResponse.json({ success: true, data });
    }

    if (body.action === "CLEAR") {
      await MemoryPlatform.clearUserMemories(body.userId || "u-1");
      return NextResponse.json({ success: true, message: "All memories cleared successfully" });
    }

    if (body.action === "DELETE") {
      const deleted = await MemoryPlatform.deleteMemory(body.userId || "u-1", body.memoryId);
      return NextResponse.json({ success: true, data: { deleted } });
    }

    const parsed = MemoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid payload", errors: parsed.error.format() }, { status: 400 });
    }

    const memoryItem = await MemoryPlatform.storeMemory(parsed.data);
    return NextResponse.json({ success: true, data: memoryItem });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Memory operation failed" }, { status: 500 });
  }
}
