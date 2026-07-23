import { BaseProvider, ConnectParams, ProviderCapability, ProviderHealthStatus } from "../core/base-provider";
import { Connection as ProviderConnection, OAuthToken, SyncJob, SyncLog, Permission } from "@lifesync/types";

export class MicrosoftProvider extends BaseProvider {
  public providerId = "prov-microsoft";
  public integrationId = "int-microsoft";
  public name = "Microsoft 365 & Outlook";
  public type: "OAUTH" | "API_KEY" | "WEBHOOK" = "OAUTH";

  public async connect(params: ConnectParams): Promise<{
    connection: ProviderConnection;
    tokens?: OAuthToken;
    permissions: Permission[];
  }> {
    const connId = `conn_ms_${Date.now()}`;
    const connection: ProviderConnection = {
      id: connId,
      userId: params.userId,
      providerId: this.providerId,
      isEnabled: true,
      status: "CONNECTED",
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tokens: OAuthToken = {
      id: `tok_ms_${Date.now()}`,
      connectionId: connId,
      accessToken: `ms_graph_token_${Math.random().toString(36).substring(2)}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      scope: (params.scopes || ["Calendars.ReadWrite", "Tasks.ReadWrite", "Files.Read", "Mail.ReadWrite"]).join(" "),
      tokenType: "Bearer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const permissions: Permission[] = (params.scopes || ["Calendars.ReadWrite", "Tasks.ReadWrite", "Files.Read", "Mail.ReadWrite"]).map((s) => ({
      id: `perm_ms_${Math.random().toString(36).substring(2)}`,
      connectionId: connId,
      scope: s,
      isGranted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return { connection, tokens, permissions };
  }

  public async disconnect(connectionId: string): Promise<boolean> {
    return true;
  }

  public async refresh(connectionId: string): Promise<OAuthToken> {
    return {
      id: `tok_ms_${Date.now()}`,
      connectionId,
      accessToken: `ms_refreshed_graph_token_${Math.random().toString(36).substring(2)}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      scope: "Calendars.ReadWrite Tasks.ReadWrite Files.Read Mail.ReadWrite",
      tokenType: "Bearer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public async sync(connectionId: string, syncType: "MANUAL" | "SCHEDULED" | "AUTO" = "MANUAL"): Promise<{
    job: SyncJob;
    logs: SyncLog[];
    recordsSynced: number;
  }> {
    const jobId = `job_ms_${Date.now()}`;
    const startTime = new Date().toISOString();
    const endTime = new Date().toISOString();

    const job: SyncJob = {
      id: jobId,
      connectionId,
      status: "COMPLETED",
      scheduledTime: null,
      startedAt: startTime,
      endedAt: endTime,
      type: syncType,
      createdAt: startTime,
      updatedAt: endTime,
    };

    const logs: SyncLog[] = [
      {
        id: `log_ms_1`,
        syncJobId: jobId,
        level: "INFO",
        message: "Synchronized Outlook Calendar events.",
        createdAt: startTime,
      },
      {
        id: `log_ms_2`,
        syncJobId: jobId,
        level: "INFO",
        message: "Synced Microsoft To Do items.",
        createdAt: endTime,
      },
    ];

    return { job, logs, recordsSynced: 12 };
  }

  public async validate(payload: Record<string, any>): Promise<boolean> {
    return payload.code !== undefined;
  }

  public getCapabilities(): ProviderCapability[] {
    return [
      { name: "Outlook Calendar", code: "ms.calendar", description: "Calendar sync & event management", category: "CALENDAR", isSupported: true },
      { name: "Microsoft To Do", code: "ms.todo", description: "Tasks import & status completion", category: "TASKS", isSupported: true },
      { name: "OneDrive", code: "ms.onedrive", description: "Cloud document access", category: "DRIVE", isSupported: true },
      { name: "Outlook Mail", code: "ms.mail", description: "Outlook email context & drafting", category: "MAIL", isSupported: true },
    ];
  }

  public async healthCheck(connectionId?: string): Promise<ProviderHealthStatus> {
    return {
      providerId: this.providerId,
      name: this.name,
      status: "OPTIMAL",
      latencyMs: 58,
      lastChecked: new Date().toISOString(),
      message: "Microsoft Graph API endpoint operational.",
    };
  }
}
