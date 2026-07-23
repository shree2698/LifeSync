"use client";

import * as React from "react";
import { WorkflowAction } from "@lifesync/types";
import { CheckCircle2, ShieldAlert } from "lucide-react";

interface ActionCardProps {
  action: WorkflowAction;
}

export function ActionCard({ action }: ActionCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card/60 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
          <CheckCircle2 className="h-4 w-4" />
        </div>
        <div>
          <p className="font-bold text-foreground">{action.type}</p>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{action.config}</p>
        </div>
      </div>

      {action.isDestructive && (
        <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-md font-medium flex items-center gap-0.5">
          <ShieldAlert className="h-3 w-3" /> Destructive
        </span>
      )}
    </div>
  );
}
