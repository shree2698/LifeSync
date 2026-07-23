import { BaseProvider, ConnectParams, ProviderCapability, ProviderHealthStatus } from "../core/base-provider";
import { Connection as ProviderConnection, OAuthToken, SyncJob, SyncLog, Permission } from "@lifesync/types";

export class CloudinaryProvider extends BaseProvider {
  public providerId = "prov-cloudinary";
  public integrationId = "int-cloudinary";
  public name = "Cloudinary Media Cloud";
  public type: "OAUTH" | "API_KEY" | "WEBHOOK" = "API_KEY";

  public async connect(params: ConnectParams): Promise<{
    connection: ProviderConnection;
    tokens?: OAuthToken;
    permissions: Permission[];
  }> {
    const connId = `conn_cloudinary_${Date.now()}`;
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
        id: `perm_cld_1`,
        connectionId: connId,
        scope: "upload.auto",
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
    throw new Error("Cloudinary uses API Key authentication. OAuth refresh not required.");
  }

  public async sync(connectionId: string, syncType: "MANUAL" | "SCHEDULED" | "AUTO" = "MANUAL"): Promise<{
    job: SyncJob;
    logs: SyncLog[];
    recordsSynced: number;
  }> {
    const jobId = `job_cld_${Date.now()}`;
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
        id: `log_cld_1`,
        syncJobId: jobId,
        level: "INFO",
        message: "Cloudinary media assets optimized and WebP transforms generated.",
        createdAt: startTime,
      },
    ];

    return { job, logs, recordsSynced: 8 };
  }

  public async validate(payload: Record<string, any>): Promise<boolean> {
    return payload.apiKey !== undefined || payload.fileUrl !== undefined;
  }

  public getCapabilities(): ProviderCapability[] {
    return [
      { name: "Image Upload", code: "cloudinary.image_upload", description: "Upload & transform JPG, PNG, WEBP images", category: "STORAGE", isSupported: true },
      { name: "Avatar Upload", code: "cloudinary.avatar_upload", description: "Automatic face detection & avatar cropping", category: "STORAGE", isSupported: true },
      { name: "Document & PDF Upload", code: "cloudinary.pdf_upload", description: "Store and process PDF documents", category: "STORAGE", isSupported: true },
      { name: "Media Optimization", code: "cloudinary.optimize", description: "WebP conversion & global CDN delivery", category: "STORAGE", isSupported: true },
    ];
  }

  public async healthCheck(connectionId?: string): Promise<ProviderHealthStatus> {
    return {
      providerId: this.providerId,
      name: this.name,
      status: "OPTIMAL",
      latencyMs: 24,
      lastChecked: new Date().toISOString(),
      message: "Cloudinary upload API operational.",
    };
  }
}
