import { NextResponse } from "next/server";
import { AIOrchestrator, AIGateway, ConversationEngine, AIObservability } from "@lifesync/ai";
import { ChatInputSchema } from "@lifesync/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const parsed = ChatInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid payload", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { userId, prompt, conversationId, preferredAgent } = parsed.data;

    // 2. Gateway Rate Limit & Security
    const rateLimit = AIGateway.checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded. Try again in a minute." },
        { status: 429 }
      );
    }

    const validation = AIGateway.validateAndSanitize(prompt);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.reason, threatLevel: validation.threatLevel },
        { status: 400 }
      );
    }

    // 3. Ensure Conversation Session
    let activeConvId = conversationId;
    if (!activeConvId) {
      const conv = await ConversationEngine.createConversation(userId, "New Conversation", preferredAgent || "ORCHESTRATOR");
      activeConvId = conv.id;
    }

    await ConversationEngine.addMessage(activeConvId, "USER", validation.sanitizedPrompt);

    // 4. Orchestration
    const result = await AIOrchestrator.processRequest({
      userId,
      userPrompt: validation.sanitizedPrompt,
      conversationId: activeConvId,
      preferredAgent: preferredAgent as any,
    });

    const sanitizedResponse = AIGateway.validateResponse(result.content);

    await ConversationEngine.addMessage(
      activeConvId,
      "ASSISTANT",
      sanitizedResponse.sanitizedContent,
      result.primaryAgent,
      result.toolsUsed.length > 0 ? JSON.stringify(result.toolsUsed) : undefined
    );

    AIObservability.logExecution({
      userId,
      provider: "OPENAI",
      model: "gpt-4o",
      agentType: result.primaryAgent,
      inputTokens: Math.ceil(prompt.length / 4),
      outputTokens: Math.ceil(sanitizedResponse.sanitizedContent.length / 4),
      latencyMs: result.latencyMs,
    });

    return NextResponse.json({
      success: true,
      data: {
        conversationId: activeConvId,
        response: sanitizedResponse.sanitizedContent,
        agentType: result.primaryAgent,
        participatingAgents: result.participatingAgents,
        suggestedActions: result.suggestedActions,
        toolsUsed: result.toolsUsed,
        latencyMs: result.latencyMs,
      },
    });
  } catch (err: any) {
    console.error("AI Chat Route Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
