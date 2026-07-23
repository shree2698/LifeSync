import { NextResponse } from "next/server";
import { ConversationEngine } from "@lifesync/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "u-1";
    const query = searchParams.get("query");
    const includeArchived = searchParams.get("includeArchived") === "true";

    if (query) {
      const results = await ConversationEngine.searchConversations(userId, query);
      return NextResponse.json({ success: true, data: results });
    }

    const conversations = await ConversationEngine.getConversations(userId, includeArchived);
    return NextResponse.json({ success: true, data: conversations });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId || "u-1";

    if (body.action === "PIN") {
      const isPinned = await ConversationEngine.togglePin(body.conversationId);
      return NextResponse.json({ success: true, data: { isPinned } });
    }

    if (body.action === "ARCHIVE") {
      const isArchived = await ConversationEngine.toggleArchive(body.conversationId);
      return NextResponse.json({ success: true, data: { isArchived } });
    }

    if (body.action === "DELETE") {
      const deleted = await ConversationEngine.deleteConversation(body.conversationId);
      return NextResponse.json({ success: true, data: { deleted } });
    }

    const conv = await ConversationEngine.createConversation(userId, body.title || "New Conversation", body.agentType || "ORCHESTRATOR");
    return NextResponse.json({ success: true, data: conv });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Conversation operation failed" }, { status: 500 });
  }
}
