"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { AgentType } from "@lifesync/types";
import { AGENT_CONFIGS } from "./agent-badge";

export function ThinkingIndicator({ agentType = "ORCHESTRATOR" }: { agentType?: AgentType }) {
  const config = AGENT_CONFIGS[agentType] || AGENT_CONFIGS.ORCHESTRATOR;

  return (
    <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/40 bg-muted/20 dark:bg-muted/10 max-w-xs animate-pulse select-none">
      <div className={`p-2 rounded-xl ${config.bgClass} ${config.textClass}`}>
        <Sparkles className="h-4 w-4 animate-spin" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-muted-foreground">
          {config.label} reasoning...
        </span>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
