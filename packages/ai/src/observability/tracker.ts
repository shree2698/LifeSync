import { AIProvider } from "@lifesync/types";

export interface LogExecutionParams {
  userId: string;
  provider: AIProvider;
  model: string;
  agentType?: string;
  toolName?: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  error?: string;
  costEstimate?: number;
}

export class AIObservability {
  private static logs: LogExecutionParams[] = [];

  public static logExecution(params: LogExecutionParams): void {
    const cost = params.costEstimate ?? this.calculateCost(params.provider, params.inputTokens, params.outputTokens);
    this.logs.push({ ...params, costEstimate: cost });
  }

  public static getUserStats(userId: string): {
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
    averageLatencyMs: number;
    agentUsageCount: Record<string, number>;
    toolUsageCount: Record<string, number>;
    errorCount: number;
  } {
    const userLogs = this.logs.filter((l) => l.userId === userId);
    if (userLogs.length === 0) {
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        averageLatencyMs: 0,
        agentUsageCount: {},
        toolUsageCount: {},
        errorCount: 0,
      };
    }

    const totalTokens = userLogs.reduce((acc, curr) => acc + curr.inputTokens + curr.outputTokens, 0);
    const totalCost = userLogs.reduce((acc, curr) => acc + (curr.costEstimate || 0), 0);
    const totalLatency = userLogs.reduce((acc, curr) => acc + curr.latencyMs, 0);

    const agentUsageCount: Record<string, number> = {};
    const toolUsageCount: Record<string, number> = {};
    let errorCount = 0;

    for (const log of userLogs) {
      if (log.agentType) {
        agentUsageCount[log.agentType] = (agentUsageCount[log.agentType] || 0) + 1;
      }
      if (log.toolName) {
        toolUsageCount[log.toolName] = (toolUsageCount[log.toolName] || 0) + 1;
      }
      if (log.error) {
        errorCount++;
      }
    }

    return {
      totalRequests: userLogs.length,
      totalTokens,
      totalCost,
      averageLatencyMs: Math.round(totalLatency / userLogs.length),
      agentUsageCount,
      toolUsageCount,
      errorCount,
    };
  }

  public static calculateCost(provider: AIProvider, inputTokens: number, outputTokens: number): number {
    // Standard cost rates per 1k tokens
    let inputRate = 0.0025;
    let outputRate = 0.01;

    if (provider === "ANTHROPIC") {
      inputRate = 0.003;
      outputRate = 0.015;
    } else if (provider === "GEMINI") {
      inputRate = 0.00125;
      outputRate = 0.00375;
    } else if (provider === "OPENROUTER") {
      inputRate = 0.002;
      outputRate = 0.008;
    } else if (provider === "LOCAL") {
      return 0.0;
    }

    return (inputTokens / 1000) * inputRate + (outputTokens / 1000) * outputRate;
  }

  public static getLogs(userId?: string): LogExecutionParams[] {
    if (userId) {
      return this.logs.filter((l) => l.userId === userId);
    }
    return this.logs;
  }
}

