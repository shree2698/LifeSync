"use client";

import * as React from "react";
import { AgentType } from "@lifesync/types";
import { AGENT_CONFIGS } from "./agent-badge";

interface AIAvatarProps {
  agentType?: AgentType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AIAvatar({ agentType = "ORCHESTRATOR", size = "md", className = "" }: AIAvatarProps) {
  const config = AGENT_CONFIGS[agentType] || AGENT_CONFIGS.ORCHESTRATOR;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-xl border font-semibold transition-all duration-200 shadow-sm ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
    </div>
  );
}
