import { AgentInfo, AgentType } from "@lifesync/types";
import { ModelRouter } from "../router/model-router";
import { PromptLibrary } from "../prompts/prompt-library";
import { ToolRegistry } from "../tools/tool-registry";
import { MemoryPlatform } from "../memory/memory-platform";

export interface AgentExecutionInput {
  userId: string;
  userPrompt: string;
  conversationId?: string;
  contextData?: Record<string, any>;
}

export interface AgentExecutionResult {
  agentType: AgentType;
  content: string;
  toolCallsExecuted: string[];
  latencyMs: number;
}

export abstract class BaseAgent {
  public abstract type: AgentType;
  public abstract name: string;
  public abstract description: string;
  public abstract capabilities: string[];
  public abstract defaultTools: string[];

  public async execute(input: AgentExecutionInput): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const memories = await MemoryPlatform.getMemories(input.userId);
    const memoryStrings = memories.map((m) => `${m.category}:${m.key}=${m.value}`);

    const systemPrompt = PromptLibrary.getAgentSystemPrompt({
      agentType: this.type,
      contextSummary: input.contextData ? JSON.stringify(input.contextData) : undefined,
      memories: memoryStrings,
    });

    const toolsToUse = this.defaultTools.map((tName) => ToolRegistry.getTool(tName)).filter(Boolean);

    const modelResponse = await ModelRouter.generate({
      systemPrompt,
      prompt: input.userPrompt,
      tools: toolsToUse,
    });

    const executedTools: string[] = [];
    let toolResultContext = "";

    if (modelResponse.toolCalls && modelResponse.toolCalls.length > 0) {
      for (const call of modelResponse.toolCalls) {
        const result = await ToolRegistry.executeTool(call.name, input.userId, call.args);
        executedTools.push(call.name);
        toolResultContext += `\n[Tool Output (${call.name})]: ${JSON.stringify(result.data)}`;
      }
    }

    let finalContent = modelResponse.content;
    if (toolResultContext) {
      finalContent += `\n\n${toolResultContext}`;
    }

    return {
      agentType: this.type,
      content: finalContent,
      toolCallsExecuted: executedTools,
      latencyMs: Date.now() - startTime,
    };
  }

  public getInfo(): AgentInfo {
    return {
      id: `agent_${this.type.toLowerCase()}`,
      type: this.type,
      name: this.name,
      description: this.description,
      capabilities: this.capabilities,
      isSystem: true,
      isEnabled: true,
    };
  }
}

// 1. Planner Agent
export class PlannerAgent extends BaseAgent {
  public type: AgentType = "PLANNER";
  public name = "Planner Agent";
  public description = "Optimizes schedules, time-blocks tasks, and breaks down long-term goals.";
  public capabilities = ["Schedule Optimization", "Time Blocking", "Daily/Weekly Planning", "Workload Balancing"];
  public defaultTools = ["task_tool", "calendar_tool"];
}

// 2. Productivity Agent
export class ProductivityAgent extends BaseAgent {
  public type: AgentType = "PRODUCTIVITY";
  public name = "Productivity Agent";
  public description = "Manages tasks, habits, projects, notes, and focus sessions.";
  public capabilities = ["Task Prioritization", "Habit Coaching", "Focus Session Management", "Note Summarization"];
  public defaultTools = ["task_tool", "search_tool"];
}

// 3. Health Agent
export class HealthAgent extends BaseAgent {
  public type: AgentType = "HEALTH";
  public name = "Health Agent";
  public description = "Monitors sleep, workouts, water intake, weight, mood, medication & PCOS/women's health.";
  public capabilities = ["Health Summaries", "Hydration Suggestions", "Workout Guidance", "PCOS & Routine Support"];
  public defaultTools = ["health_tool", "notification_tool"];
}

// 4. Finance Agent
export class FinanceAgent extends BaseAgent {
  public type: AgentType = "FINANCE";
  public name = "Finance Agent";
  public description = "Tracks income, expenses, budgets, savings, bills, and subscriptions.";
  public capabilities = ["Expense Insights", "Budget Alerts", "Savings Predictions", "Subscription Auditing"];
  public defaultTools = ["finance_tool"];
}

// 5. Shopping Agent
export class ShoppingAgent extends BaseAgent {
  public type: AgentType = "SHOPPING";
  public name = "Shopping Agent";
  public description = "Manages shopping lists, pantry stock, monthly supplies, and wishlists.";
  public capabilities = ["Shopping List Generation", "Restock Alerts", "Price Alternatives", "Pantry Audits"];
  public defaultTools = ["shopping_tool"];
}

// 6. Calendar Agent
export class CalendarAgent extends BaseAgent {
  public type: AgentType = "CALENDAR";
  public name = "Calendar Agent";
  public description = "Schedules events, detects conflicts, and calculates travel buffer times.";
  public capabilities = ["Conflict Resolution", "Event Scheduling", "Availability Calculation"];
  public defaultTools = ["calendar_tool", "maps_tool"];
}

// 7. Journal Agent
export class JournalAgent extends BaseAgent {
  public type: AgentType = "JOURNAL";
  public name = "Journal Agent";
  public description = "Provides daily reflection prompts, mood trend analysis, and weekly digests.";
  public capabilities = ["Daily Reflection", "Mood Analytics", "Weekly Summary Generation"];
  public defaultTools = ["search_tool"];
}

// 8. Notification Agent
export class NotificationAgent extends BaseAgent {
  public type: AgentType = "NOTIFICATION";
  public name = "Notification Agent";
  public description = "Schedules smart reminders and optimizes push notification timing.";
  public capabilities = ["Push Notification Dispatch", "Reminder Scheduling", "Digest Creation"];
  public defaultTools = ["notification_tool"];
}

// 9. Memory Agent
export class MemoryAgent extends BaseAgent {
  public type: AgentType = "MEMORY";
  public name = "Memory Agent";
  public description = "Manages long-term context, user preferences, and semantic memory retrieval.";
  public capabilities = ["Store Context", "Forget Outdated Info", "Export Memory", "Preference Auditing"];
  public defaultTools = [];

  public async execute(input: AgentExecutionInput): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    // Parse memory intent
    if (input.userPrompt.toLowerCase().includes("remember")) {
      const memoryVal = input.userPrompt.replace(/remember/i, "").trim();
      await MemoryPlatform.storeMemory({
        userId: input.userId,
        category: "PREFERENCE",
        key: "user_note",
        value: memoryVal,
      });
      return {
        agentType: "MEMORY",
        content: `I have saved this to your long-term memory: "${memoryVal}".`,
        toolCallsExecuted: [],
        latencyMs: Date.now() - startTime,
      };
    }
    return super.execute(input);
  }
}

// 10. Research Agent
export class ResearchAgent extends BaseAgent {
  public type: AgentType = "RESEARCH";
  public name = "Research Agent";
  public description = "Answers questions, summarizes external articles, and compares choices.";
  public capabilities = ["Synthesis", "Summaries", "Option Comparison", "Citation Support"];
  public defaultTools = ["search_tool", "weather_tool"];
}

// 11. Automation Agent
export class AutomationAgent extends BaseAgent {
  public type: AgentType = "AUTOMATION";
  public name = "Automation Agent";
  public description = "Coordinates internal smart workflows and triggers rules.";
  public capabilities = ["Scheduled Workflows", "Event Triggering", "Internal Rules Execution"];
  public defaultTools = ["notification_tool", "task_tool"];
}

// 12. Wellness Coach
export class WellnessCoachAgent extends BaseAgent {
  public type: AgentType = "WELLNESS_COACH";
  public name = "Wellness Coach";
  public description = "Provides positive reinforcement, habit motivation, and stress management techniques.";
  public capabilities = ["Daily Motivation", "Stress Reduction", "Habit Coaching"];
  public defaultTools = ["health_tool"];
}

// 13. Career Coach
export class CareerCoachAgent extends BaseAgent {
  public type: AgentType = "CAREER_COACH";
  public name = "Career Coach";
  public description = "Assists with professional development, learning roadmaps, and interview prep.";
  public capabilities = ["Skill Tracking", "Resume Review", "Interview Prep", "Goal Alignment"];
  public defaultTools = ["task_tool", "search_tool"];
}

// Agent Manager & Registry
export class AgentManager {
  private static agentsMap: Map<AgentType, BaseAgent> = new Map();

  public static initialize(): void {
    const agents: BaseAgent[] = [
      new PlannerAgent(),
      new ProductivityAgent(),
      new HealthAgent(),
      new FinanceAgent(),
      new ShoppingAgent(),
      new CalendarAgent(),
      new JournalAgent(),
      new NotificationAgent(),
      new MemoryAgent(),
      new ResearchAgent(),
      new AutomationAgent(),
      new WellnessCoachAgent(),
      new CareerCoachAgent(),
    ];

    for (const agent of agents) {
      this.agentsMap.set(agent.type, agent);
    }
  }

  public static getAgent(type: AgentType): BaseAgent | undefined {
    if (this.agentsMap.size === 0) {
      this.initialize();
    }
    return this.agentsMap.get(type);
  }

  public static listAgents(): AgentInfo[] {
    if (this.agentsMap.size === 0) {
      this.initialize();
    }
    return Array.from(this.agentsMap.values()).map((a) => a.getInfo());
  }
}
