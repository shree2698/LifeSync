import { NextResponse } from "next/server";
import { ToolRegistry } from "@lifesync/ai";

export async function GET() {
  try {
    const tools = ToolRegistry.listTools();
    return NextResponse.json({ success: true, data: tools });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed to list tools" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { toolName, userId, input } = body;

    if (!toolName || !userId) {
      return NextResponse.json({ success: false, message: "toolName and userId are required" }, { status: 400 });
    }

    const result = await ToolRegistry.executeTool(toolName, userId, input || {});
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Tool execution failed" }, { status: 500 });
  }
}
