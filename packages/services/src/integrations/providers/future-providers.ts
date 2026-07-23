import { BaseProvider, ConnectParams, ProviderCapability, ProviderHealthStatus } from "../core/base-provider";
import { Connection as ProviderConnection, OAuthToken, SyncJob, SyncLog, Permission } from "@lifesync/types";

export interface FutureProviderMetadata {
  providerId: string;
  name: string;
  category: string;
  description: string;
  status: "COMING_SOON" | "BETA" | "PLANNED";
}

export const FutureProvidersRegistry: FutureProviderMetadata[] = [
  { providerId: "prov-notion", name: "Notion Workspace", category: "NOTES", description: "Database sync & workspace pages access", status: "COMING_SOON" },
  { providerId: "prov-slack", name: "Slack", category: "COMMUNICATION", description: "Message digests & notification dispatch", status: "COMING_SOON" },
  { providerId: "prov-github", name: "GitHub", category: "DEVELOPMENT", description: "Issue tracking, PRs & commit digests", status: "COMING_SOON" },
  { providerId: "prov-dropbox", name: "Dropbox", category: "STORAGE", description: "Cloud file sync & document access", status: "PLANNED" },
  { providerId: "prov-discord", name: "Discord", category: "COMMUNICATION", description: "Community updates & status sync", status: "PLANNED" },
  { providerId: "prov-zoom", name: "Zoom", category: "MEETINGS", description: "Meeting scheduling & automated link generation", status: "COMING_SOON" },
  { providerId: "prov-apple-health", name: "Apple HealthKit", category: "HEALTH", description: "Step counts, active energy & sleep sync", status: "COMING_SOON" },
  { providerId: "prov-google-fit", name: "Google Fit", category: "HEALTH", description: "Fitness metrics & workout logs", status: "COMING_SOON" },
  { providerId: "prov-health-connect", name: "Health Connect (Android)", category: "HEALTH", description: "Unified Android health data pipeline", status: "BETA" },
  { providerId: "prov-spotify", name: "Spotify", category: "MEDIA", description: "Focus session playlists & mood audio sync", status: "PLANNED" },
  { providerId: "prov-openai-files", name: "OpenAI Files API", category: "AI_STORAGE", description: "Custom fine-tuning & vector file storage", status: "PLANNED" },
];

export class FutureProviderPlaceholder extends BaseProvider {
  public providerId: string;
  public integrationId: string;
  public name: string;
  public type: "OAUTH" | "API_KEY" | "WEBHOOK" = "OAUTH";

  constructor(meta: FutureProviderMetadata) {
    super();
    this.providerId = meta.providerId;
    this.integrationId = `int-${meta.providerId}`;
    this.name = meta.name;
  }

  public async connect(params: ConnectParams): Promise<{
    connection: ProviderConnection;
    tokens?: OAuthToken;
    permissions: Permission[];
  }> {
    throw new Error(`Provider '${this.name}' is coming soon in a future release.`);
  }

  public async disconnect(connectionId: string): Promise<boolean> {
    return true;
  }

  public async refresh(connectionId: string): Promise<OAuthToken> {
    throw new Error(`Provider '${this.name}' is coming soon.`);
  }

  public async sync(connectionId: string, syncType: "MANUAL" | "SCHEDULED" | "AUTO" = "MANUAL"): Promise<{
    job: SyncJob;
    logs: SyncLog[];
    recordsSynced: number;
  }> {
    throw new Error(`Provider '${this.name}' is coming soon.`);
  }

  public async validate(payload: Record<string, any>): Promise<boolean> {
    return false;
  }

  public getCapabilities(): ProviderCapability[] {
    return [
      { name: `${this.name} Integration`, code: `${this.providerId}.placeholder`, description: "Coming soon", category: "STORAGE", isSupported: false },
    ];
  }

  public async healthCheck(connectionId?: string): Promise<ProviderHealthStatus> {
    return {
      providerId: this.providerId,
      name: this.name,
      status: "DISCONNECTED",
      latencyMs: 0,
      lastChecked: new Date().toISOString(),
      message: "Provider reserved for future roadmap phase.",
    };
  }
}
