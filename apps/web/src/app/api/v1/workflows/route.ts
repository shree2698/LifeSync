import { NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { WorkflowEngine } from "@lifesync/services";

const createWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().optional(),
  isAiGenerated: z.boolean().default(false),
  isDestructive: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    const mockUserId = "u-1";

    if (process.env.DATABASE_URL) {
      const workflows = await prisma.workflow.findMany({
        where: { userId: mockUserId },
        include: { triggers: true, actions: true, schedules: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, message: "Workflows retrieved", data: workflows });
    }

    const list = WorkflowEngine.listWorkflows(mockUserId);
    return NextResponse.json({ success: true, message: "Workflows retrieved", data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createWorkflowSchema.parse(body);

    const mockUserId = "u-1";

    if (process.env.DATABASE_URL) {
      const newWf = await prisma.workflow.create({
        data: {
          userId: mockUserId,
          name: validated.name,
          description: validated.description,
          status: "ACTIVE",
          isAiGenerated: validated.isAiGenerated,
          isDestructive: validated.isDestructive,
        },
      });
      return NextResponse.json({ success: true, message: "Workflow created successfully", data: newWf });
    }

    const newWf = WorkflowEngine.saveWorkflow({
      id: `wf_${Date.now()}`,
      userId: mockUserId,
      name: validated.name,
      description: validated.description,
      status: "ACTIVE",
      isAiGenerated: validated.isAiGenerated,
      isDestructive: validated.isDestructive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers: [],
      actions: [],
    });

    return NextResponse.json({ success: true, message: "Workflow created successfully", data: newWf });
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
