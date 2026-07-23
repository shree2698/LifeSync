"use client";

import * as React from "react";
import { Wrench, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface ToolCardProps {
  toolName: string;
  status?: string;
  latencyMs?: number;
  data?: any;
}

export function ToolCard({ toolName, status = "SUCCESS", latencyMs, data }: ToolCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="my-2 rounded-xl border border-border/40 bg-muted/20 dark:bg-muted/10 overflow-hidden text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-muted/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Wrench className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-mono">{toolName}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <CheckCircle className="h-3 w-3" />
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
          {latencyMs !== undefined && <span>{latencyMs}ms</span>}
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </div>

      {isOpen && data && (
        <div className="p-3 border-t border-border/30 bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
