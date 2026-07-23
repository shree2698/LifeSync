"use client";

import * as React from "react";
import { Message } from "@lifesync/types";
import { AIAvatar } from "./ai-avatar";
import { AgentBadge } from "./agent-badge";
import { MarkdownRenderer } from "./markdown-renderer";
import { ToolCard } from "./tool-card";
import { Copy, Check, RefreshCw, User as UserIcon } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  onRegenerate?: () => void;
}

export function ChatBubble({ message, onRegenerate }: ChatBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "USER";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toolCalls = React.useMemo(() => {
    if (!message.toolCalls) return [];
    try {
      return JSON.parse(message.toolCalls);
    } catch {
      return [];
    }
  }, [message.toolCalls]);

  return (
    <div className={`flex gap-3 py-3 px-2 sm:px-4 rounded-2xl transition-colors ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {isUser ? (
        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
          <UserIcon className="h-4.5 w-4.5" />
        </div>
      ) : (
        <AIAvatar agentType={message.agentType || "ORCHESTRATOR"} size="md" />
      )}

      {/* Message Content Container */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Header Badge */}
        {!isUser && message.agentType && (
          <div className="flex items-center gap-2 mb-0.5">
            <AgentBadge agentType={message.agentType} />
            <span className="text-[10px] text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}

        {/* Message Bubble Body */}
        <div
          className={`p-4 rounded-2xl shadow-xs leading-relaxed ${
            isUser
              ? "bg-indigo-600 text-white rounded-tr-xs"
              : "bg-card text-card-foreground border border-border/40 rounded-tl-xs dark:border-border/10"
          }`}
        >
          {isUser ? (
            <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {/* Tool Calls Execution */}
          {!isUser && toolCalls.length > 0 && (
            <div className="mt-3 pt-2 border-t border-border/20">
              {toolCalls.map((tName: string, idx: number) => (
                <ToolCard key={idx} toolName={tName} status="SUCCESS" />
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions for Assistant Messages */}
        {!isUser && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
              title="Copy Message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                title="Regenerate Response"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-[11px]">Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
