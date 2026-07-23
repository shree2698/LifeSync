"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  HeartPulse,
  DollarSign,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AIService } from "@lifesync/services";
import Link from "next/link";

export function AIWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-ai-summary"],
    queryFn: () => AIService.getDashboardAISummary(),
  });

  const [activeSection, setActiveSection] = React.useState<
    "summary" | "tasks" | "health" | "finance" | "shopping" | "events"
  >("summary");

  const ai = apiRes?.data;

  if (isLoading || !ai) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden border-indigo-500/20 bg-card/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
            <span>LifeSync AI Intelligence Hub</span>
          </CardTitle>
          <Link
            href="/ai"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            <span>Open AI Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <CardDescription className="text-xs">
          Daily tailored productivity, health & finance summary.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-3 pt-1">
        {/* Navigation Quick Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 text-[11px] font-semibold border border-border/30 overflow-x-auto select-none">
          <button
            onClick={() => setActiveSection("summary")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeSection === "summary" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveSection("tasks")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeSection === "tasks" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tasks ({ai.priorityTasks.length})
          </button>
          <button
            onClick={() => setActiveSection("health")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeSection === "health" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Health
          </button>
          <button
            onClick={() => setActiveSection("finance")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeSection === "finance" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Finance
          </button>
          <button
            onClick={() => setActiveSection("shopping")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeSection === "shopping" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Shopping
          </button>
        </div>

        {/* Dynamic Section View */}
        <div className="flex-1 flex flex-col justify-center">
          {activeSection === "summary" && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-foreground leading-relaxed">
                {ai.todaysSummary}
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/40 bg-muted/20 text-xs">
                <Target className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="text-[11px] font-medium text-foreground">
                  <strong>Daily Focus:</strong> {ai.dailyFocus}
                </span>
              </div>
            </div>
          )}

          {activeSection === "tasks" && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Priority Tasks</span>
              {ai.priorityTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 text-xs border border-border/30">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="font-medium text-foreground truncate">{task.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeSection === "health" && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Health Insights</span>
              {ai.healthInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 text-xs border border-emerald-500/20 text-foreground">
                  <HeartPulse className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}

          {activeSection === "finance" && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Finance Summary</span>
              <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Net Savings</span>
                  <span className="text-amber-600 font-bold">${ai.financeSummary.netSavings}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{ai.financeSummary.summary}</p>
              </div>
            </div>
          )}

          {activeSection === "shopping" && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shopping Restock</span>
              {ai.shoppingSuggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-rose-500/5 text-xs border border-rose-500/20 text-foreground">
                  <ShoppingBag className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

