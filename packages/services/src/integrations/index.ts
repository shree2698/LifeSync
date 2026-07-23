import { ProviderRegistry } from "./core/provider-registry";
import { GoogleProvider } from "./providers/google-provider";
import { MicrosoftProvider } from "./providers/microsoft-provider";
import { CloudinaryProvider } from "./providers/cloudinary-provider";
import { FirebaseProvider } from "./providers/firebase-provider";
import { LocationWeatherProvider } from "./providers/location-weather-provider";
import { FutureProvidersRegistry, FutureProviderPlaceholder } from "./providers/future-providers";

// Export Core Managers
export * from "./core/base-provider";
export * from "./core/provider-registry";
export * from "./core/oauth-manager";
export * from "./core/sync-manager";
export * from "./core/webhook-manager";

// Export Provider Classes
export * from "./providers/google-provider";
export * from "./providers/microsoft-provider";
export * from "./providers/cloudinary-provider";
export * from "./providers/firebase-provider";
export * from "./providers/location-weather-provider";
export * from "./providers/future-providers";

// Initialize and Register Providers
export function initializeIntegrationPlatform() {
  ProviderRegistry.register(new GoogleProvider());
  ProviderRegistry.register(new MicrosoftProvider());
  ProviderRegistry.register(new CloudinaryProvider());
  ProviderRegistry.register(new FirebaseProvider());
  ProviderRegistry.register(new LocationWeatherProvider());

  // Register Future Placeholders
  for (const meta of FutureProvidersRegistry) {
    ProviderRegistry.register(new FutureProviderPlaceholder(meta));
  }
}

// Auto-initialize on import
initializeIntegrationPlatform();
