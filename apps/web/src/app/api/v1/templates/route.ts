import { NextResponse } from "next/server";
import { OfficialWorkflowTemplates } from "@lifesync/services";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Official workflow templates loaded",
      data: OfficialWorkflowTemplates,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
