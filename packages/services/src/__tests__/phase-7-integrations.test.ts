import {
  ProviderRegistry,
  OAuthManager,
  SyncManager,
  WebhookManager,
  GoogleProvider,
  MicrosoftProvider,
  CloudinaryProvider,
  FirebaseProvider,
  LocationWeatherProvider,
} from "../index";

async function runPhase7Tests() {
  console.log("=========================================");
  console.log("🧪 LifeSync Phase 7 Integration Framework Tests");
  console.log("=========================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Provider Registry
    console.log("\n1. Testing Provider Registry...");
    const providers = ProviderRegistry.list();
    assert(providers.length >= 10, `Registered ${providers.length} providers (active + future placeholders)`);

    // Test 2: Google Provider
    console.log("\n2. Testing Google Provider Capabilities & Health...");
    const googleProv = ProviderRegistry.get("prov-google") as GoogleProvider;
    assert(googleProv !== undefined, "GoogleProvider retrieved from registry");

    const caps = googleProv.getCapabilities();
    assert(caps.length >= 6, `Google Provider offers ${caps.length} capabilities (Calendar, Tasks, Drive, Gmail, Contacts, Maps)`);

    const health = await googleProv.healthCheck();
    assert(health.status === "OPTIMAL", "Google Provider health status is OPTIMAL");

    // Test 3: OAuth Manager CSRF Protection
    console.log("\n3. Testing OAuth Manager Security...");
    const stateToken = OAuthManager.generateState("u-1", "prov-google");
    const verifiedState = OAuthManager.verifyState(stateToken);
    assert(verifiedState.valid === true && verifiedState.userId === "u-1", "CSRF state token verified successfully");

    const encryptedToken = OAuthManager.encryptToken("secret_oauth_token");
    const decryptedToken = OAuthManager.decryptToken(encryptedToken);
    assert(decryptedToken === "secret_oauth_token", "AES-256 token encryption & decryption verified");

    // Test 4: Sync Manager Execution
    console.log("\n4. Testing Sync Manager Engine...");
    const syncRes = await SyncManager.executeSync("conn_123", "prov-google", "MANUAL");
    assert(syncRes.job.status === "COMPLETED", "SyncManager executed job successfully");
    assert(syncRes.logs.length >= 1, "Sync logs recorded successfully");

    // Test 5: Webhook Manager Registration & Processing
    console.log("\n5. Testing Webhook Manager...");
    const webhook = WebhookManager.registerWebhook("conn_123", "https://api.lifesync.app/webhooks/gcal", ["calendar.event.created"]);
    assert(webhook.secret !== undefined && webhook.secret.startsWith("whsec_"), "Webhook registered with HMAC secret");

    const incomingRes = WebhookManager.processIncomingEvent({
      id: "evt_1",
      topic: "calendar.event.created",
      connectionId: "conn_123",
      data: { eventId: "gcal_evt_101", title: "Architecture Sync" },
      timestamp: new Date().toISOString(),
    });
    assert(incomingRes.success === true, "Incoming webhook payload queued");

    // Test 6: Cloudinary & Firebase Providers
    console.log("\n6. Testing Cloudinary & Firebase Providers...");
    const cldProv = ProviderRegistry.get("prov-cloudinary") as CloudinaryProvider;
    assert(cldProv.getCapabilities().some((c) => c.code === "cloudinary.avatar_upload"), "Cloudinary avatar upload capability present");

    const fcmProv = ProviderRegistry.get("prov-firebase") as FirebaseProvider;
    assert(fcmProv.getCapabilities().some((c) => c.code === "firebase.fcm_register"), "Firebase FCM registration capability present");

    // Test 7: Location & Weather Provider
    console.log("\n7. Testing Geolocation & Weather Provider...");
    const locProv = ProviderRegistry.get("prov-location-weather") as LocationWeatherProvider;
    assert(locProv.getCapabilities().some((c) => c.code === "weather.forecast"), "Weather forecast capability present");
  } catch (err: any) {
    console.error("Fatal Test Exception:", err);
    failed++;
  }

  console.log("\n=========================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase7Tests();
