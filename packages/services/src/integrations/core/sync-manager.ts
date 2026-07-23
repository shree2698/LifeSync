import { SyncJob, SyncLog } from "@lifesync/types";
import { ProviderRegistry } from "./provider-registry";
import { z } from "zod";

export const SyncRequestSchema = z.object({
  connectionId: z.string().min(1, "Connection ID is required"),
  type: z.enum(["MANUAL", "SCHEDULED", "AUTO", "INCREMENTAL"]).default("MANUAL"),
});

export class SyncManager {
  private static syncHistory: SyncJob[] = [];
  private static syncLogs: SyncLog[] = [];

  public static async executeSync(
    connectionId: string,
    providerId: string,
    syncType: "MANUAL" | "SCHEDULED" | "AUTO" | "INCREMENTAL" = "MANUAL"
  ): Promise<{ job: SyncJob; logs: SyncLog[] }> {
    const provider = ProviderRegistry.get(providerId);

    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const startTime = new Date().toISOString();

    if (!provider) {
      const failedJob: SyncJob = {
        id: jobId,
        connectionId,
        status: "FAILED",
        scheduledTime: null,
        startedAt: startTime,
        endedAt: new Date().toISOString(),
        type: syncType,
        createdAt: startTime,
        updatedAt: new Date().toISOString(),
      };
      const failedLog: SyncLog = {
        id: `log_${Date.now()}`,
        syncJobId: jobId,
        level: "ERROR",
        message: `Provider '${providerId}' not found in ProviderRegistry.`,
        createdAt: new Date().toISOString(),
      };
      this.syncHistory.push(failedJob);
      this.syncLogs.push(failedLog);
      return { job: failedJob, logs: [failedLog] };
    }

    const res = await provider.sync(connectionId, syncType as any);
    this.syncHistory.push(res.job);
    this.syncLogs.push(...res.logs);

    return res;
  }

  public static getHistory(connectionId?: string): SyncJob[] {
    if (connectionId) {
      return this.syncHistory.filter((j) => j.connectionId === connectionId);
    }
    return this.syncHistory;
  }

  public static getLogs(jobId: string): SyncLog[] {
    return this.syncLogs.filter((l) => l.syncJobId === jobId);
  }
}
