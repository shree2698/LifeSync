import { AgentType } from "@lifesync/types";
import { z } from "zod";

export const ChatInputSchema = z.object({
  userId: z.string().uuid().or(z.string().min(1)),
  prompt: z.string().min(1, "Prompt cannot be empty").max(10000, "Prompt exceeds max length"),
  conversationId: z.string().optional(),
  preferredAgent: z.string().optional(),
  stream: z.boolean().optional(),
});

export const MemoryUpdateSchema = z.object({
  userId: z.string().uuid().or(z.string().min(1)),
  category: z.enum([
    "PREFERENCE",
    "GOAL",
    "HABIT",
    "HEALTH",
    "FINANCE",
    "SHOPPING",
    "PERSONAL",
    "SCHEDULE",
    "WORK",
  ]),
  key: z.string().min(1),
  value: z.string().min(1),
  confidence: z.number().min(0).max(1).optional(),
  source: z.string().optional(),
});

export interface GatewayValidationResult {
  valid: boolean;
  sanitizedPrompt: string;
  threatLevel: "LOW" | "MEDIUM" | "HIGH";
  reason?: string;
}

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  action: string;
  threatLevel: "LOW" | "MEDIUM" | "HIGH";
  details?: string;
}

export class AIGateway {
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private static auditLogs: AuditLogEntry[] = [];
  private static RATE_LIMIT_MAX = 60; // 60 requests per minute
  private static WINDOW_MS = 60000;

  private static injectionPatterns = [
    /ignore previous instructions/i,
    /bypass safety/i,
    /reveal system prompt/i,
    /system override/i,
    /jailbreak/i,
    /sudo mode/i,
    /do anything now/i,
    /disregard rules/i,
    /forget all instructions/i,
    /pretend you are DAN/i,
  ];

  /**
   * Rate limiting check per user
   */
  public static checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const userRecord = this.rateLimitMap.get(userId);

    if (!userRecord || now > userRecord.resetTime) {
      this.rateLimitMap.set(userId, { count: 1, resetTime: now + this.WINDOW_MS });
      return { allowed: true, remaining: this.RATE_LIMIT_MAX - 1 };
    }

    if (userRecord.count >= this.RATE_LIMIT_MAX) {
      this.logAudit(userId, "RATE_LIMIT_EXCEEDED", "HIGH", "Exceeded 60 requests per minute limit");
      return { allowed: false, remaining: 0 };
    }

    userRecord.count += 1;
    return { allowed: true, remaining: this.RATE_LIMIT_MAX - userRecord.count };
  }

  /**
   * Inspect prompt for injection attacks and sanitize input
   */
  public static validateAndSanitize(prompt: string): GatewayValidationResult {
    let sanitizedPrompt = prompt.trim();

    // Prompt injection detection
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(sanitizedPrompt)) {
        return {
          valid: false,
          sanitizedPrompt,
          threatLevel: "HIGH",
          reason: "Potential prompt injection or safety bypass attempt detected.",
        };
      }
    }

    // Basic HTML/Script tag sanitization
    sanitizedPrompt = sanitizedPrompt
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "[filtered]")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "[filtered]")
      .replace(/javascript:/gi, "");

    return {
      valid: true,
      sanitizedPrompt,
      threatLevel: "LOW",
    };
  }

  /**
   * Response validation to ensure AI outputs do not leak secrets or unsafe content
   */
  public static validateResponse(content: string): { valid: boolean; sanitizedContent: string } {
    let sanitizedContent = content;

    // Filter potential API key leaks
    sanitizedContent = sanitizedContent.replace(/sk-[a-zA-Z0-9]{20,}/g, "[REDACTED_API_KEY]");
    sanitizedContent = sanitizedContent.replace(/AIzaSy[a-zA-Z0-9_-]{33}/g, "[REDACTED_KEY]");

    return { valid: true, sanitizedContent };
  }

  /**
   * Permissions check for agent actions
   */
  public static authorizeAgentAction(
    userId: string,
    agentType: AgentType,
    action: string,
    isHighRisk: boolean = false
  ): { authorized: boolean; requiresUserConfirmation: boolean; reason?: string } {
    if (!userId) {
      return { authorized: false, requiresUserConfirmation: false, reason: "Unauthorized user." };
    }

    if (isHighRisk) {
      this.logAudit(userId, `HIGH_RISK_ACTION:${action}`, "MEDIUM", `Agent ${agentType} requested high risk action`);
      return {
        authorized: true,
        requiresUserConfirmation: true,
        reason: `Action '${action}' by agent ${agentType} requires explicit user confirmation.`,
      };
    }

    return { authorized: true, requiresUserConfirmation: false };
  }

  /**
   * Log security audit event
   */
  public static logAudit(userId: string, action: string, threatLevel: "LOW" | "MEDIUM" | "HIGH", details?: string): void {
    this.auditLogs.push({
      timestamp: new Date().toISOString(),
      userId,
      action,
      threatLevel,
      details,
    });
  }

  /**
   * Get audit logs
   */
  public static getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}

