"use client";

import * as React from "react";
import { Workflow } from "@lifesync/types";
import { Zap, Play, Pause, Trash2, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

interface WorkflowCardProps {
  workflow: Workflow;
  onToggleStatus: (id: string) => void;
  onRun: (workflow: Workflow) => void;
  onDelete: (id: string) => void;
}

export function WorkflowCard({ workflow, onToggleStatus, onRun, onDelete }: WorkflowCardProps) {
  return (
    <div className="p-4 rounded-2xl border border-border/40 bg-card hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>{workflow.name}</span>
              {workflow.isAiGenerated && (
                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md font-medium">
                  AI
                </span>
              )}
              {workflow.isDestructive && (
                <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-md font-medium flex items-center gap-0.5">
                  <ShieldAlert className="h-3 w-3" /> Destructive
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{workflow.description}</p>
          </div>
        </div>

        <button
          onClick={() => onToggleStatus(workflow.id)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            workflow.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
              : "bg-muted text-muted-foreground border-border/40"
          }`}
          title={workflow.status === "ACTIVE" ? "Pause Workflow" : "Activate Workflow"}
        >
          {workflow.status === "ACTIVE" ? <Play className="h-3.5 w-3.5 fill-emerald-500" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Execution Pipeline Steps Preview */}
      <div className="p-3 rounded-xl bg-muted/30 border border-border/30 space-y-1.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Pipeline Flow
        </span>
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-foreground pt-1">
          <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md shrink-0">
            Trigger: {(workflow.triggers && workflow.triggers[0]?.type) || "CRON"}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md shrink-0">
            Action: {(workflow.actions && workflow.actions[0]?.type) || "CREATE_TASK"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border/20">
        <button
          onClick={() => onDelete(workflow.id)}
          className="text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
          title="Delete Workflow"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onRun(workflow)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
        >
          <Play className="h-3 w-3 fill-white" />
          <span>Run Pipeline</span>
        </button>
      </div>
    </div>
  );
}
