import {
  Integration,
  Provider as IntegrationProvider,
  Connection as ProviderConnection,
  OAuthToken,
  SyncJob,
  SyncLog,
  Permission,
} from "@lifesync/types";

export interface ProviderCapability {
  name: string;
  code: string;
  description: string;
  category: "CALENDAR" | "TASKS" | "DRIVE" | "MAIL" | "CONTACTS" | "MAPS" | "STORAGE" | "PUSH" | "WEATHER";
  isSupported: boolean;
}

export interface ConnectParams {
  userId: string;
  authCode?: string;
  apiKey?: string;
  redirectUri?: string;
  scopes?: string[];
  metadata?: Record<string, any>;
}

export interface ProviderHealthStatus {
  providerId: string;
  name: string;
  status: "OPTIMAL" | "DEGRADED" | "DISCONNECTED" | "ERROR";
  latencyMs: number;
  lastChecked: string;
  message?: string;
}

export abstract class BaseProvider {
  public abstract providerId: string;
  public abstract integrationId: string;
  public abstract name: string;
  public abstract type: "OAUTH" | "API_KEY" | "WEBHOOK";

  /**
   * Connect to provider using OAuth code or API Key
   */
  public abstract connect(params: ConnectParams): Promise<{
    connection: ProviderConnection;
    tokens?: OAuthToken;
    permissions: Permission[];
  }>;

  /**
   * Disconnect service and revoke access credentials
   */
  public abstract disconnect(connectionId: string): Promise<boolean>;

  /**
   * Refresh expired OAuth credentials
   */
  public abstract refresh(connectionId: string): Promise<OAuthToken>;

  /**
   * Perform background / manual synchronization for the provider
   */
  public abstract sync(connectionId: string, syncType?: "MANUAL" | "SCHEDULED" | "AUTO"): Promise<{
    job: SyncJob;
    logs: SyncLog[];
    recordsSynced: number;
  }>;

  /**
   * Validate credentials or callback payloads
   */
  public abstract validate(payload: Record<string, any>): Promise<boolean>;

  /**
   * Return capability matrix for this provider
   */
  public abstract getCapabilities(): ProviderCapability[];

  /**
   * Perform health check against provider endpoint
   */
  public abstract healthCheck(connectionId?: string): Promise<ProviderHealthStatus>;
}
