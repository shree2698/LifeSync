"use client";

import * as React from "react";
import { AgentType } from "@lifesync/types";
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  HeartPulse,
  DollarSign,
  ShoppingBag,
  BookOpen,
  Bell,
  Brain,
  Cpu,
  Briefcase,
  Smile,
  Bot,
} from "lucide-react";

interface AgentConfig {
  label: string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  ORCHESTRATOR: {
    label: "Orchestrator AI",
    icon: Bot,
    bgClass: "bg-indigo-500/10 dark:bg-indigo-500/20",
    textClass: "text-indigo-600 dark:text-indigo-400",
    borderClass: "border-indigo-500/30",
  },
  PLANNER: {
    label: "Planner Agent",
    icon: Calendar,
    bgClass: "bg-purple-500/10 dark:bg-purple-500/20",
    textClass: "text-purple-600 dark:text-purple-400",
    borderClass: "border-purple-500/30",
  },
  PRODUCTIVITY: {
    label: "Productivity Agent",
    icon: CheckCircle2,
    bgClass: "bg-blue-500/10 dark:bg-blue-500/20",
    textClass: "text-blue-600 dark:text-blue-400",
    borderClass: "border-blue-500/30",
  },
  HEALTH: {
    label: "Health Agent",
    icon: HeartPulse,
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  FINANCE: {
    label: "Finance Agent",
    icon: DollarSign,
    bgClass: "bg-amber-500/10 dark:bg-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-500/30",
  },
  SHOPPING: {
    label: "Shopping Agent",
    icon: ShoppingBag,
    bgClass: "bg-rose-500/10 dark:bg-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
    borderClass: "border-rose-500/30",
  },
  CALENDAR: {
    label: "Calendar Agent",
    icon: Calendar,
    bgClass: "bg-cyan-500/10 dark:bg-cyan-500/20",
    textClass: "text-cyan-600 dark:text-cyan-400",
    borderClass: "border-cyan-500/30",
  },
  JOURNAL: {
    label: "Journal Agent",
    icon: BookOpen,
    bgClass: "bg-violet-500/10 dark:bg-violet-500/20",
    textClass: "text-violet-600 dark:text-violet-400",
    borderClass: "border-violet-500/30",
  },
  NOTIFICATION: {
    label: "Notification Agent",
    icon: Bell,
    bgClass: "bg-yellow-500/10 dark:bg-yellow-500/20",
    textClass: "text-yellow-600 dark:text-yellow-400",
    borderClass: "border-yellow-500/30",
  },
  MEMORY: {
    label: "Memory Agent",
    icon: Brain,
    bgClass: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    textClass: "text-fuchsia-600 dark:text-fuchsia-400",
    borderClass: "border-fuchsia-500/30",
  },
  RESEARCH: {
    label: "Research Agent",
    icon: Sparkles,
    bgClass: "bg-teal-500/10 dark:bg-teal-500/20",
    textClass: "text-teal-600 dark:text-teal-400",
    borderClass: "border-teal-500/30",
  },
  AUTOMATION: {
    label: "Automation Agent",
    icon: Cpu,
    bgClass: "bg-slate-500/10 dark:bg-slate-500/20",
    textClass: "text-slate-600 dark:text-slate-400",
    borderClass: "border-slate-500/30",
  },
  CAREER_COACH: {
    label: "Career Coach",
    icon: Briefcase,
    bgClass: "bg-orange-500/10 dark:bg-orange-500/20",
    textClass: "text-orange-600 dark:text-orange-400",
    borderClass: "border-orange-500/30",
  },
  WELLNESS_COACH: {
    label: "Wellness Coach",
    icon: Smile,
    bgClass: "bg-pink-500/10 dark:bg-pink-500/20",
    textClass: "text-pink-600 dark:text-pink-400",
    borderClass: "border-pink-500/30",
  },
};

export function AgentBadge({ agentType, className = "" }: { agentType: AgentType; className?: string }) {
  const config = AGENT_CONFIGS[agentType] || AGENT_CONFIGS.ORCHESTRATOR;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
