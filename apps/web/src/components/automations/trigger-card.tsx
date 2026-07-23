"use client";

import * as React from "react";
import { WorkflowTrigger } from "@lifesync/types";
import { Clock, Radio, Globe, Sparkles, Play } from "lucide-react";

interface TriggerCardProps {
  trigger: WorkflowTrigger;
}

export function TriggerCard({ trigger }: TriggerCardProps) {
  const getIcon = () => {
    switch (trigger.type) {
      case "CRON":
        return <Clock className="h-4 w-4 text-indigo-500" />;
      case "WEBHOOK":
        return <Globe className="h-4 w-4 text-emerald-500" />;
      case "EVENT":
        return <Radio className="h-4 w-4 text-amber-500" />;
      case "AI_SUGGESTION":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <Play className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/40 bg-card/60 text-xs">
      <div className="p-2 rounded-lg bg-muted/60">{getIcon()}</div>
      <div>
        <p className="font-bold text-foreground">{trigger.type} Trigger</p>
        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{trigger.config}</p>
      </div>
    </div>
  );
}
