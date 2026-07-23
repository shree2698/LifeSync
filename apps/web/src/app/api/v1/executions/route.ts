import { NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { WorkflowEngine } from "@lifesync/services";

const executeWorkflowSchema = z.object({
  workflowId: z.string().min(1, "Workflow ID is required"),
  forceBypassConfirmation: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId") || undefined;
    const executions = WorkflowEngine.listExecutions(workflowId);
    return NextResponse.json({ success: true, message: "Executions retrieved", data: executions });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = executeWorkflowSchema.parse(body);

    const mockUserId = "u-1";

    const res = await WorkflowEngine.executeWorkflow(
      validated.workflowId,
      mockUserId,
      "MANUAL",
      validated.forceBypassConfirmation
    );

    return NextResponse.json({
      success: res.execution.status === "SUCCESS" || res.execution.status === "PENDING_CONFIRMATION",
      message:
        res.execution.status === "PENDING_CONFIRMATION"
          ? "Execution paused. Explicit user confirmation required for destructive workflow."
          : "Workflow executed successfully.",
      data: res,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
