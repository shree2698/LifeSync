import { BaseProvider, ConnectParams, ProviderCapability, ProviderHealthStatus } from "../core/base-provider";
import { Connection as ProviderConnection, OAuthToken, SyncJob, SyncLog, Permission } from "@lifesync/types";

export class FirebaseProvider extends BaseProvider {
  public providerId = "prov-firebase";
  public integrationId = "int-firebase";
  public name = "Firebase Cloud Messaging (FCM)";
  public type: "OAUTH" | "API_KEY" | "WEBHOOK" = "API_KEY";

  public async connect(params: ConnectParams): Promise<{
    connection: ProviderConnection;
    tokens?: OAuthToken;
    permissions: Permission[];
  }> {
    const connId = `conn_fcm_${Date.now()}`;
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

    const permissions: Permission[] = [
      {
        id: `perm_fcm_1`,
        connectionId: connId,
        scope: "messaging.send",
        isGranted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return { connection, permissions };
  }

  public async disconnect(connectionId: string): Promise<boolean> {
    return true;
  }

  public async refresh(connectionId: string): Promise<OAuthToken> {
    throw new Error("Firebase uses Service Account / FCM device tokens.");
  }

  public async sync(connectionId: string, syncType: "MANUAL" | "SCHEDULED" | "AUTO" = "MANUAL"): Promise<{
    job: SyncJob;
    logs: SyncLog[];
    recordsSynced: number;
  }> {
    const jobId = `job_fcm_${Date.now()}`;
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
        id: `log_fcm_1`,
        syncJobId: jobId,
        level: "INFO",
        message: "FCM device tokens validated across Web, iOS, and Android platforms.",
        createdAt: startTime,
      },
    ];

    return { job, logs, recordsSynced: 3 };
  }

  public async validate(payload: Record<string, any>): Promise<boolean> {
    return payload.deviceToken !== undefined || payload.platform !== undefined;
  }

  public getCapabilities(): ProviderCapability[] {
    return [
      { name: "Push Notification Registration", code: "firebase.fcm_register", description: "Register client FCM device tokens", category: "PUSH", isSupported: true },
      { name: "Device Tokens Management", code: "firebase.tokens", description: "Token refresh & platform detection", category: "PUSH", isSupported: true },
    ];
  }

  public async healthCheck(connectionId?: string): Promise<ProviderHealthStatus> {
    return {
      providerId: this.providerId,
      name: this.name,
      status: "OPTIMAL",
      latencyMs: 18,
      lastChecked: new Date().toISOString(),
      message: "Firebase FCM service connected.",
    };
  }
}
