"use client";

import * as React from "react";
import { Conversation, AgentType } from "@lifesync/types";
import { ChatBubble } from "./chat-bubble";
import { MessageInput } from "./message-input";
import { ThinkingIndicator } from "./thinking-indicator";
import { AgentBadge } from "./agent-badge";
import { Sparkles, Calendar, HeartPulse, DollarSign, ShoppingBag, ArrowRight } from "lucide-react";

interface ChatWindowProps {
  conversation: Conversation | null;
  activeAgent: AgentType;
  isGenerating: boolean;
  onSendMessage: (prompt: string, preferredAgent?: AgentType) => void;
  onAgentChange: (agent: AgentType) => void;
  onStopGeneration?: () => void;
}

export function ChatWindow({
  conversation,
  activeAgent,
  isGenerating,
  onSendMessage,
  onAgentChange,
  onStopGeneration,
}: ChatWindowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, isGenerating]);

  const suggestedPrompts = [
    {
      title: "Plan My Workday",
      prompt: "Analyze my tasks and schedule a time-blocked plan for today.",
      icon: Calendar,
      agent: "PLANNER" as AgentType,
    },
    {
      title: "Health & Water Check",
      prompt: "Summarize my water intake, sleep quality, and workout metrics.",
      icon: HeartPulse,
      agent: "HEALTH" as AgentType,
    },
    {
      title: "Budget & Expense Audit",
      prompt: "Give me an overview of my monthly expenses and budget remaining.",
      icon: DollarSign,
      agent: "FINANCE" as AgentType,
    },
    {
      title: "Restock Groceries",
      prompt: "Check my pantry items and create a grocery shopping list.",
      icon: ShoppingBag,
      agent: "SHOPPING" as AgentType,
    },
  ];

  const messages = conversation?.messages || [];

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-2xl border border-border/40 overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/60 backdrop-blur-md select-none">
        <div className="flex items-center gap-2">
          <AgentBadge agentType={activeAgent} />
          <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
            {conversation?.title || "New Session"}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-lg mx-auto">
            <div className="p-4 rounded-3xl bg-indigo-500/10 text-indigo-500 ring-8 ring-indigo-500/5">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                How can LifeSync assist you today?
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Choose a specialized agent or pick a quick starter prompt to optimize your schedule, health, or budget.
              </p>
            </div>

            {/* Suggested Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
              {suggestedPrompts.map((sp, idx) => {
                const Icon = sp.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onAgentChange(sp.agent);
                      onSendMessage(sp.prompt, sp.agent);
                    }}
                    className="flex flex-col justify-between p-3.5 rounded-2xl border border-border/40 bg-card hover:border-indigo-500/40 hover:bg-muted/30 transition-all text-xs group cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2 text-indigo-500 font-semibold mb-1">
                      <Icon className="h-4 w-4" />
                      <span>{sp.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{sp.prompt}</p>
                    <div className="flex items-center justify-end text-indigo-500 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatBubble key={msg.id || idx} message={msg} />
            ))}

            {isGenerating && (
              <div className="py-2">
                <ThinkingIndicator agentType={activeAgent} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Message Input */}
      <div className="p-3 bg-card/40 border-t border-border/30 backdrop-blur-md">
        <MessageInput
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
          onStopGeneration={onStopGeneration}
          activeAgent={activeAgent}
          onAgentChange={onAgentChange}
        />
      </div>
    </div>
  );
}
