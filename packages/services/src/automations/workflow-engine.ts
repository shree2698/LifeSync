import {
  Workflow,
  WorkflowExecution,
  ExecutionLog,
  WorkflowAction,
  ExecutionStatus,
} from "@lifesync/types";
import { ToolRegistry } from "../../../ai/src/tools/tool-registry";
import { ProviderRegistry } from "../integrations/core/provider-registry";
import { SyncManager } from "../integrations/core/sync-manager";
import { z } from "zod";

export const WorkflowCreateSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().optional(),
  isAiGenerated: z.boolean().default(false),
  isDestructive: z.boolean().default(false),
  triggers: z.array(
    z.object({
      type: z.enum(["CRON", "EVENT", "WEBHOOK", "AI_SUGGESTION", "MANUAL"]),
      config: z.string(),
      providerId: z.string().optional(),
    })
  ).min(1, "At least one trigger is required"),
  actions: z.array(
    z.object({
      type: z.enum([
        "CREATE_TASK",
        "SCHEDULE_EVENT",
        "SEND_NOTIFICATION",
        "DISPATCH_EMAIL",
        "UPLOAD_MEDIA",
        "FETCH_WEATHER",
        "RUN_AI_AGENT",
      ]),
      orderIndex: z.number().default(0),
      config: z.string(),
      providerId: z.string().optional(),
      isDestructive: z.boolean().default(false),
    })
  ).min(1, "At least one action is required"),
});

export class WorkflowEngine {
  private static workflows: Map<string, Workflow> = new Map();
  private static executions: WorkflowExecution[] = [];

  /**
   * Execute a workflow step-by-step using Integration Framework & ToolRegistry
   */
  public static async executeWorkflow(
    workflowId: string,
    userId: string,
    triggerType: "MANUAL" | "CRON" | "EVENT" | "WEBHOOK" = "MANUAL",
    forceBypassConfirmation: boolean = false
  ): Promise<{ execution: WorkflowExecution; logs: ExecutionLog[] }> {
    const startTime = Date.now();
    const executionId = `exec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const workflow = this.workflows.get(workflowId);

    const logs: ExecutionLog[] = [];
    const addLog = (level: string, message: string, stepIndex?: number) => {
      logs.push({
        id: `log_${Date.now()}_${logs.length}`,
        executionId,
        level,
        message,
        stepIndex,
        createdAt: new Date().toISOString(),
      });
    };

    if (!workflow) {
      addLog("ERROR", `Workflow '${workflowId}' not found.`);
      const failedExec: WorkflowExecution = {
        id: executionId,
        workflowId,
        userId,
        status: "FAILED",
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        error: "Workflow not found",
        logs,
      };
      this.executions.push(failedExec);
      return { execution: failedExec, logs };
    }

    // Safety Gate: Check if destructive action requires confirmation
    if (workflow.isDestructive && !forceBypassConfirmation) {
      addLog("WARN", `Destructive workflow '${workflow.name}' requires explicit user confirmation before execution.`);
      const pendingExec: WorkflowExecution = {
        id: executionId,
        workflowId,
        userId,
        status: "PENDING_CONFIRMATION",
        startedAt: new Date().toISOString(),
        logs,
      };
      this.executions.push(pendingExec);
      return { execution: pendingExec, logs };
    }

    addLog("INFO", `Started workflow execution '${workflow.name}' via ${triggerType} trigger.`);

    let hasErrors = false;
    let errorMessage: string | undefined = undefined;

    // Execute each action step sequentially
    const actions = workflow.actions || [];
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      addLog("INFO", `Executing Action Step [${i + 1}/${actions.length}]: ${action.type}`, i);

      try {
        const actionConfig = JSON.parse(action.config || "{}");

        if (action.type === "CREATE_TASK") {
          const toolRes = await ToolRegistry.executeTool("task_tool", userId, { action: "create", ...actionConfig });
          addLog(toolRes.success ? "INFO" : "ERROR", `Task creation result: ${JSON.stringify(toolRes.data)}`, i);
        } else if (action.type === "SCHEDULE_EVENT") {
          const toolRes = await ToolRegistry.executeTool("calendar_tool", userId, { action: "schedule", ...actionConfig });
          addLog(toolRes.success ? "INFO" : "ERROR", `Calendar schedule result: ${JSON.stringify(toolRes.data)}`, i);
        } else if (action.type === "SEND_NOTIFICATION") {
          const toolRes = await ToolRegistry.executeTool("firebase_tool", userId, { action: "notify", ...actionConfig });
          addLog(toolRes.success ? "INFO" : "ERROR", `FCM Notification sent: ${JSON.stringify(toolRes.data)}`, i);
        } else if (action.type === "DISPATCH_EMAIL") {
          const toolRes = await ToolRegistry.executeTool("mail_tool", userId, actionConfig);
          addLog(toolRes.success ? "INFO" : "ERROR", `Email dispatched: ${JSON.stringify(toolRes.data)}`, i);
        } else if (action.type === "UPLOAD_MEDIA") {
          const toolRes = await ToolRegistry.executeTool("cloudinary_tool", userId, actionConfig);
          addLog(toolRes.success ? "INFO" : "ERROR", `Cloudinary media transform: ${JSON.stringify(toolRes.data)}`, i);
        } else if (action.type === "FETCH_WEATHER") {
          const toolRes = await ToolRegistry.executeTool("weather_tool", userId, actionConfig);
          addLog(toolRes.success ? "INFO" : "ERROR", `Weather data fetched: ${JSON.stringify(toolRes.data)}`, i);
        } else {
          addLog("INFO", `Executed generic integration step: ${action.type}`, i);
        }
      } catch (err: any) {
        hasErrors = true;
        errorMessage = err?.message || String(err);
        addLog("ERROR", `Failed step [${i + 1}]: ${errorMessage}`, i);
        break;
      }
    }

    const durationMs = Date.now() - startTime;
    const finalStatus: ExecutionStatus = hasErrors ? "FAILED" : "SUCCESS";
    addLog(finalStatus === "SUCCESS" ? "INFO" : "ERROR", `Workflow execution finished with status '${finalStatus}' in ${durationMs}ms.`);

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      userId,
      status: finalStatus,
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date().toISOString(),
      durationMs,
      error: errorMessage,
      logs,
    };

    this.executions.push(execution);
    return { execution, logs };
  }

  public static saveWorkflow(workflow: Workflow): Workflow {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  public static deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id);
  }

  public static updateWorkflowStatus(id: string, status: "ACTIVE" | "PAUSED"): boolean {
    const wf = this.workflows.get(id);
    if (wf) {
      wf.status = status;
      wf.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  public static getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  public static listWorkflows(userId: string): Workflow[] {
    return Array.from(this.workflows.values()).filter((w) => w.userId === userId);
  }

  public static listExecutions(workflowId?: string): WorkflowExecution[] {
    if (workflowId) {
      return this.executions.filter((e) => e.workflowId === workflowId);
    }
    return this.executions;
  }
}
