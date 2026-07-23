"use client";

import * as React from "react";
import { WorkflowCondition } from "@lifesync/types";
import { Filter } from "lucide-react";

interface ConditionCardProps {
  condition: WorkflowCondition;
}

export function ConditionCard({ condition }: ConditionCardProps) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/40 bg-card/60 text-xs">
      <div className="p-2 rounded-lg bg-muted/60 text-amber-500">
        <Filter className="h-4 w-4" />
      </div>
      <div>
        <p className="font-bold text-foreground">Condition Gate</p>
        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
          {condition.field} {condition.operator} "{condition.value}"
        </p>
      </div>
    </div>
  );
}
