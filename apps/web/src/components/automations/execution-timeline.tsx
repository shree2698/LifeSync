"use client";

import * as React from "react";
import { WorkflowExecution } from "@lifesync/types";
import { CheckCircle2, AlertCircle, Clock, ShieldAlert } from "lucide-react";

interface ExecutionTimelineProps {
  executions: WorkflowExecution[];
}

export function ExecutionTimeline({ executions }: ExecutionTimelineProps) {
  if (executions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/40 rounded-2xl">
        No workflow executions recorded yet. Trigger a pipeline to view telemetry logs!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {executions.map((exec) => (
        <div key={exec.id} className="p-4 rounded-2xl border border-border/40 bg-card space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {exec.status === "SUCCESS" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {exec.status === "FAILED" && <AlertCircle className="h-4 w-4 text-rose-500" />}
              {exec.status === "PENDING_CONFIRMATION" && <ShieldAlert className="h-4 w-4 text-amber-500" />}
              {exec.status === "RUNNING" && <Clock className="h-4 w-4 text-indigo-500 animate-spin" />}

              <span className="font-bold text-foreground">Execution {exec.id}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  exec.status === "SUCCESS"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : exec.status === "FAILED"
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {exec.status}
              </span>
            </div>

            <span className="text-muted-foreground text-[11px]">
              {exec.durationMs ? `${exec.durationMs}ms` : "In Progress..."}
            </span>
          </div>

          {/* Steps Telemetry Log */}
          {exec.logs && exec.logs.length > 0 && (
            <div className="p-3 rounded-xl bg-muted/40 font-mono text-[11px] space-y-1">
              {exec.logs.map((log) => (
                <div key={log.id} className="flex items-center gap-2">
                  <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  <span
                    className={
                      log.level === "ERROR"
                        ? "text-rose-500 font-bold"
                        : log.level === "WARN"
                        ? "text-amber-500 font-bold"
                        : "text-foreground"
                    }
                  >
                    [{log.level}] {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
