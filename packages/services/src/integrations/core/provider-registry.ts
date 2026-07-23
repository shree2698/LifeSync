import { BaseProvider, ProviderHealthStatus } from "./base-provider";

export class ProviderRegistry {
  private static providersMap: Map<string, BaseProvider> = new Map();

  public static register(provider: BaseProvider): void {
    this.providersMap.set(provider.providerId, provider);
  }

  public static get(providerId: string): BaseProvider | undefined {
    return this.providersMap.get(providerId);
  }

  public static list(): BaseProvider[] {
    return Array.from(this.providersMap.values());
  }

  public static async checkAllHealth(): Promise<ProviderHealthStatus[]> {
    const results: ProviderHealthStatus[] = [];
    for (const provider of this.providersMap.values()) {
      const status = await provider.healthCheck();
      results.push(status);
    }
    return results;
  }
}
