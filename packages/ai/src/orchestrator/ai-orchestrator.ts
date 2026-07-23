import { AgentType } from "@lifesync/types";
import { AgentManager } from "../agents/agent-manager";
import { AIGateway } from "../security/gateway";
import { MemoryPlatform } from "../memory/memory-platform";

export interface OrchestrationInput {
  userId: string;
  userPrompt: string;
  conversationId?: string;
  preferredAgent?: AgentType;
}

export interface OrchestrationResult {
  primaryAgent: AgentType;
  participatingAgents: AgentType[];
  content: string;
  toolsUsed: string[];
  suggestedActions?: { label: string; action: string }[];
  latencyMs: number;
}

export class AIOrchestrator {
  /**
   * Main entry point for processing AI requests
   */
  public static async processRequest(input: OrchestrationInput): Promise<OrchestrationResult> {
    const startTime = Date.now();

    // 1. Gateway Check & Sanitization
    const rateLimit = AIGateway.checkRateLimit(input.userId);
    if (!rateLimit.allowed) {
      return {
        primaryAgent: "ORCHESTRATOR",
        participatingAgents: [],
        content: "Rate limit exceeded. Please wait a moment before sending more requests.",
        toolsUsed: [],
        latencyMs: Date.now() - startTime,
      };
    }

    const validation = AIGateway.validateAndSanitize(input.userPrompt);
    if (!validation.valid) {
      return {
        primaryAgent: "ORCHESTRATOR",
        participatingAgents: [],
        content: `I'm unable to process this prompt. Reason: ${validation.reason}`,
        toolsUsed: [],
        latencyMs: Date.now() - startTime,
      };
    }

    // 2. Intent Detection & Agent Selection
    const selectedAgentType = input.preferredAgent || this.detectIntent(validation.sanitizedPrompt);
    const agent = AgentManager.getAgent(selectedAgentType) || AgentManager.getAgent("PRODUCTIVITY")!;

    // 3. Context & Memory Retrieval
    const userMemories = await MemoryPlatform.getMemories(input.userId);
    const contextData = {
      userMemoriesCount: userMemories.length,
      timestamp: new Date().toISOString(),
    };

    // 4. Agent Execution
    const agentResult = await agent.execute({
      userId: input.userId,
      userPrompt: validation.sanitizedPrompt,
      conversationId: input.conversationId,
      contextData,
    });

    // 5. Multi-agent Coordination (e.g. check if notification / planner step is needed)
    const participatingAgents: AgentType[] = [agentResult.agentType];

    let finalContent = agentResult.content;
    let suggestedActions: { label: string; action: string }[] = [];

    // Add smart suggestions based on domain
    if (selectedAgentType === "PLANNER" || selectedAgentType === "PRODUCTIVITY") {
      suggestedActions = [
        { label: "View Task Board", action: "NAVIGATE_TASKS" },
        { label: "Schedule Focus Block", action: "SCHEDULE_FOCUS" },
      ];
    } else if (selectedAgentType === "HEALTH") {
      suggestedActions = [
        { label: "Log Water Intake", action: "LOG_WATER" },
        { label: "View Health Score", action: "NAVIGATE_HEALTH" },
      ];
    } else if (selectedAgentType === "FINANCE") {
      suggestedActions = [
        { label: "View Budget Breakdown", action: "NAVIGATE_FINANCE" },
        { label: "Add Expense", action: "ADD_EXPENSE" },
      ];
    } else if (selectedAgentType === "SHOPPING") {
      suggestedActions = [
        { label: "View Shopping List", action: "NAVIGATE_SHOPPING" },
        { label: "Add Item", action: "ADD_SHOPPING_ITEM" },
      ];
    }

    return {
      primaryAgent: agentResult.agentType,
      participatingAgents,
      content: finalContent,
      toolsUsed: agentResult.toolCallsExecuted,
      suggestedActions,
      latencyMs: Date.now() - startTime,
    };
  }

  /**
   * Intelligent intent classification
   */
  private static detectIntent(prompt: string): AgentType {
    const p = prompt.toLowerCase();

    if (p.includes("plan") || p.includes("schedule") || p.includes("prioritize") || p.includes("time block")) {
      return "PLANNER";
    }
    if (p.includes("health") || p.includes("sleep") || p.includes("water") || p.includes("workout") || p.includes("pcos") || p.includes("skin") || p.includes("hair")) {
      return "HEALTH";
    }
    if (p.includes("finance") || p.includes("money") || p.includes("spend") || p.includes("budget") || p.includes("bill") || p.includes("income") || p.includes("saving")) {
      return "FINANCE";
    }
    if (p.includes("shop") || p.includes("buy") || p.includes("grocery") || p.includes("pantry") || p.includes("wishlist")) {
      return "SHOPPING";
    }
    if (p.includes("remember") || p.includes("preference") || p.includes("forget")) {
      return "MEMORY";
    }
    if (p.includes("remind") || p.includes("notify") || p.includes("alarm")) {
      return "NOTIFICATION";
    }
    if (p.includes("journal") || p.includes("reflect") || p.includes("mood log")) {
      return "JOURNAL";
    }
    if (p.includes("search") || p.includes("research") || p.includes("compare") || p.includes("explain")) {
      return "RESEARCH";
    }
    if (p.includes("career") || p.includes("resume") || p.includes("job") || p.includes("interview")) {
      return "CAREER_COACH";
    }
    if (p.includes("motivation") || p.includes("stress") || p.includes("mindset")) {
      return "WELLNESS_COACH";
    }

    return "PRODUCTIVITY";
  }
}
