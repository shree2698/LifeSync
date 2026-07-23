import { Webhook } from "@lifesync/types";
import { z } from "zod";

export const WebhookRegistrationSchema = z.object({
  connectionId: z.string().min(1, "Connection ID is required"),
  url: z.string().url("Invalid Webhook URL"),
  events: z.array(z.string()).min(1, "At least one event topic is required"),
});

export interface WebhookEventPayload {
  id: string;
  topic: string;
  connectionId: string;
  data: Record<string, any>;
  timestamp: string;
  signature?: string;
}

export class WebhookManager {
  private static webhooks: Map<string, Webhook> = new Map();
  private static eventQueue: WebhookEventPayload[] = [];

  public static registerWebhook(connectionId: string, url: string, events: string[]): Webhook {
    const id = `web_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const secret = `whsec_${Math.random().toString(36).substr(2, 12)}`;
    const webhook: Webhook = {
      id,
      connectionId,
      url,
      secret,
      isEnabled: true,
      events: JSON.stringify(events),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.webhooks.set(id, webhook);
    return webhook;
  }

  public static processIncomingEvent(payload: WebhookEventPayload): { success: boolean; message: string } {
    this.eventQueue.push(payload);
    return {
      success: true,
      message: `Incoming webhook event '${payload.topic}' queued successfully.`,
    };
  }

  public static listWebhooks(connectionId?: string): Webhook[] {
    const all = Array.from(this.webhooks.values());
    if (connectionId) {
      return all.filter((w) => w.connectionId === connectionId);
    }
    return all;
  }
}
