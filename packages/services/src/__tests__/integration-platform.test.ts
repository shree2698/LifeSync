import {
  ConnectionService,
  OAuthService,
  SyncService,
  WebhookService,
  UploadService,
  IntegrationDashboardService,
} from "../index";

async function runIntegrationTests() {
  console.log("=========================================");
  console.log("🧪 LifeSync Integration Platform Test Suite");
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
    // Test 1: Connections & Available Integrations
    console.log("\n1. Testing Integration Dashboard & Connection Listing...");
    const dashRes = await IntegrationDashboardService.getDashboard();
    assert(dashRes.success === true && dashRes.data !== undefined, "Integration Dashboard loaded");
    assert(dashRes.data.connections.length >= 1, `Found ${dashRes.data.connections.length} active connection(s)`);

    // Test 2: OAuth Callback Flow
    console.log("\n2. Testing OAuth Callback Handling...");
    const oauthRes = await OAuthService.handleCallback("prov-1", "mock_authorization_code_12345");
    assert(oauthRes.success === true && oauthRes.data !== undefined && oauthRes.data.status === "CONNECTED", "OAuth callback created active connection");

    // Test 3: Sync Engine Execution
    console.log("\n3. Testing Sync Engine...");
    const syncJobRes = await SyncService.triggerSync(oauthRes.data.id);
    assert(syncJobRes.success === true && syncJobRes.data.status === "COMPLETED", "Sync job triggered and completed");

    const historyRes = await SyncService.getSyncHistory();
    assert(historyRes.data.length >= 1, "Sync history recorded successfully");

    // Test 4: Webhook Engine Registration
    console.log("\n4. Testing Webhook Engine...");
    const webRes = await WebhookService.registerWebhook(oauthRes.data.id, "https://api.lifesync.app/webhooks/gcal", ["calendar.update"]);
    assert(webRes.success === true && webRes.data.url.includes("gcal"), "Webhook registered successfully");

    // Test 5: Upload Service (Cloudinary Media)
    console.log("\n5. Testing Cloudinary Upload Service...");
    const uploadRes = await UploadService.handleUpload("user_avatar.jpg", "image/jpeg", 204850);
    assert(uploadRes.success === true && uploadRes.data.url.includes("cloudinary"), "Cloudinary upload URL generated");

    // Test 6: Disconnection & Token Revocation
    console.log("\n6. Testing Connection Disconnect...");
    const deleteRes = await ConnectionService.deleteConnection(oauthRes.data.id);
    assert(deleteRes.success === true, "Connection disconnected and tokens revoked");
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

runIntegrationTests();
