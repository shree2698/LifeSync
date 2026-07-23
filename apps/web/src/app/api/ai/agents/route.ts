import { NextResponse } from "next/server";
import { AgentManager } from "@lifesync/ai";

export async function GET() {
  try {
    const agents = AgentManager.listAgents();
    return NextResponse.json({ success: true, data: agents });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed to list agents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentType } = body;

    const agent = AgentManager.getAgent(agentType);
    if (!agent) {
      return NextResponse.json({ success: false, message: `Agent '${agentType}' not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: agent.getInfo() });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Agent request failed" }, { status: 500 });
  }
}
