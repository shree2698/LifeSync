import { NextResponse } from "next/server";
import { ModelRouter, AIGateway } from "@lifesync/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, provider, model, systemPrompt, userId } = body;

    if (!prompt) {
      return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
    }

    if (userId) {
      const rateLimit = AIGateway.checkRateLimit(userId);
      if (!rateLimit.allowed) {
        return NextResponse.json({ success: false, message: "Rate limit exceeded" }, { status: 429 });
      }
    }

    const validation = AIGateway.validateAndSanitize(prompt);
    if (!validation.valid) {
      return NextResponse.json({ success: false, message: validation.reason }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = ModelRouter.stream({
            prompt: validation.sanitizedPrompt,
            provider,
            model,
            systemPrompt,
          });

          for await (const chunk of generator) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (err: any) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Stream error" }, { status: 500 });
  }
}
