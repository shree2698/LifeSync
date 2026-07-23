"use client";

import * as React from "react";
import { Zap, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface AutomationStatisticsProps {
  totalWorkflows: number;
  totalExecutions: number;
  successRate: number;
  activeAutomations: number;
}

export function AutomationStatistics({
  totalWorkflows,
  totalExecutions,
  successRate,
  activeAutomations,
}: AutomationStatisticsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
      <div className="p-4 rounded-2xl border border-border/40 bg-card">
        <span className="text-xs text-muted-foreground">Active Workflows</span>
        <p className="text-2xl font-extrabold text-foreground mt-1">{activeAutomations}</p>
      </div>

      <div className="p-4 rounded-2xl border border-border/40 bg-card">
        <span className="text-xs text-muted-foreground">Total Pipelines</span>
        <p className="text-2xl font-extrabold text-amber-500 mt-1">{totalWorkflows}</p>
      </div>

      <div className="p-4 rounded-2xl border border-border/40 bg-card">
        <span className="text-xs text-muted-foreground">Total Executions</span>
        <p className="text-2xl font-extrabold text-indigo-500 mt-1">{totalExecutions}</p>
      </div>

      <div className="p-4 rounded-2xl border border-border/40 bg-card">
        <span className="text-xs text-muted-foreground">Success Rate</span>
        <p className="text-2xl font-extrabold text-emerald-500 mt-1">{successRate}%</p>
      </div>
    </div>
  );
}
