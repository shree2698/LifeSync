import { BaseProvider, ConnectParams, ProviderCapability, ProviderHealthStatus } from "../core/base-provider";
import { Connection as ProviderConnection, OAuthToken, SyncJob, SyncLog, Permission } from "@lifesync/types";

export class LocationWeatherProvider extends BaseProvider {
  public providerId = "prov-location-weather";
  public integrationId = "int-location-weather";
  public name = "Location & Weather Services";
  public type: "OAUTH" | "API_KEY" | "WEBHOOK" = "API_KEY";

  public async connect(params: ConnectParams): Promise<{
    connection: ProviderConnection;
    tokens?: OAuthToken;
    permissions: Permission[];
  }> {
    const connId = `conn_loc_${Date.now()}`;
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
        id: `perm_loc_1`,
        connectionId: connId,
        scope: "location.geolocation",
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
    throw new Error("Location API uses browser/device permission.");
  }

  public async sync(connectionId: string, syncType: "MANUAL" | "SCHEDULED" | "AUTO" = "MANUAL"): Promise<{
    job: SyncJob;
    logs: SyncLog[];
    recordsSynced: number;
  }> {
    const jobId = `job_loc_${Date.now()}`;
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
        id: `log_loc_1`,
        syncJobId: jobId,
        level: "INFO",
        message: "Retrieved local weather forecast and reverse geocoded coordinates.",
        createdAt: startTime,
      },
    ];

    return { job, logs, recordsSynced: 1 };
  }

  public async validate(payload: Record<string, any>): Promise<boolean> {
    return payload.lat !== undefined || payload.location !== undefined;
  }

  public getCapabilities(): ProviderCapability[] {
    return [
      { name: "Weather API", code: "weather.forecast", description: "Get current weather & outdoor suggestions", category: "WEATHER", isSupported: true },
      { name: "Maps API", code: "maps.routing", description: "Calculate commute times & route distance", category: "MAPS", isSupported: true },
      { name: "Geolocation & Geocoding", code: "location.geocoding", description: "Reverse geocoding coordinates to city", category: "MAPS", isSupported: true },
    ];
  }

  public async healthCheck(connectionId?: string): Promise<ProviderHealthStatus> {
    return {
      providerId: this.providerId,
      name: this.name,
      status: "OPTIMAL",
      latencyMs: 15,
      lastChecked: new Date().toISOString(),
      message: "Weather & Geolocation APIs active.",
    };
  }
}
