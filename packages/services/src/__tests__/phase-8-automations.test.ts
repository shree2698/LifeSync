import {
  WorkflowEngine,
  AIWorkflowGenerator,
  OfficialWorkflowTemplates,
} from "../index";

async function runPhase8Tests() {
  console.log("=========================================");
  console.log("🧪 LifeSync Phase 8 Automation Engine Tests");
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
    // Test 1: Save & List Workflows
    console.log("\n1. Testing Workflow Saving & Listing...");
    const wf = WorkflowEngine.saveWorkflow({
      id: "wf_test_1",
      userId: "u-1",
      name: "Test Morning Routine",
      description: "Auto-create tasks and fetch weather",
      status: "ACTIVE",
      isAiGenerated: false,
      isDestructive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers: [{ id: "trig_1", workflowId: "wf_test_1", type: "CRON", config: "0 8 * * *", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      actions: [{ id: "act_1", workflowId: "wf_test_1", type: "CREATE_TASK", orderIndex: 0, config: JSON.stringify({ title: "Morning Review" }), isDestructive: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
    });
    assert(wf.id === "wf_test_1", "Workflow saved successfully");

    const list = WorkflowEngine.listWorkflows("u-1");
    assert(list.length >= 1, `Listed ${list.length} active workflow(s)`);

    // Test 2: Safe Workflow Pipeline Execution
    console.log("\n2. Testing Safe Pipeline Execution...");
    const safeExecRes = await WorkflowEngine.executeWorkflow("wf_test_1", "u-1", "MANUAL", false);
    assert(safeExecRes.execution.status === "SUCCESS", "Safe workflow executed successfully with SUCCESS status");
    assert(safeExecRes.logs.length >= 2, "Execution step logs recorded");

    // Test 3: Destructive Action Safety Gate
    console.log("\n3. Testing Destructive Action Safety Gate...");
    WorkflowEngine.saveWorkflow({
      id: "wf_destructive_1",
      userId: "u-1",
      name: "Bulk Clear Expired Items",
      description: "Destructive workflow requiring explicit user approval",
      status: "ACTIVE",
      isAiGenerated: false,
      isDestructive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers: [{ id: "trig_2", workflowId: "wf_destructive_1", type: "MANUAL", config: "{}", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      actions: [{ id: "act_2", workflowId: "wf_destructive_1", type: "CREATE_TASK", orderIndex: 0, config: "{}", isDestructive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
    });

    const unconfirmedRes = await WorkflowEngine.executeWorkflow("wf_destructive_1", "u-1", "MANUAL", false);
    assert(
      unconfirmedRes.execution.status === "PENDING_CONFIRMATION",
      "Destructive workflow correctly paused with status PENDING_CONFIRMATION"
    );

    const confirmedRes = await WorkflowEngine.executeWorkflow("wf_destructive_1", "u-1", "MANUAL", true);
    assert(
      confirmedRes.execution.status === "SUCCESS",
      "Confirmed destructive workflow executed successfully after explicit approval"
    );

    // Test 4: AI Workflow Generation & Suggestions
    console.log("\n4. Testing AI Workflow Studio & Suggestions...");
    const aiGenWf = AIWorkflowGenerator.generateWorkflow("Every morning check weather and time-block Google Calendar", "u-1");
    assert(aiGenWf.isAiGenerated === true, "AI generated workflow marked isAiGenerated=true");

    const explanation = AIWorkflowGenerator.explainWorkflow(aiGenWf);
    assert(explanation.includes("triggered via"), "AI generated plain English explanation");

    const sugs = await AIWorkflowGenerator.suggestWorkflows("u-1");
    assert(sugs.length >= 3, `AI suggested ${sugs.length} proactive workflow routines`);

    // Test 5: Official Workflow Templates
    console.log("\n5. Testing Official Workflow Templates...");
    assert(OfficialWorkflowTemplates.length >= 3, `Found ${OfficialWorkflowTemplates.length} official pre-built templates`);
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

runPhase8Tests();
