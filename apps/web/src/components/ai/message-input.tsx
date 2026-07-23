"use client";

import * as React from "react";
import { Send, Square, Mic, Paperclip, Sparkles, ChevronDown } from "lucide-react";
import { AgentType } from "@lifesync/types";
import { AGENT_CONFIGS } from "./agent-badge";

interface MessageInputProps {
  onSendMessage: (prompt: string, preferredAgent?: AgentType) => void;
  isGenerating: boolean;
  onStopGeneration?: () => void;
  activeAgent: AgentType;
  onAgentChange: (agent: AgentType) => void;
}

export function MessageInput({
  onSendMessage,
  isGenerating,
  onStopGeneration,
  activeAgent,
  onAgentChange,
}: MessageInputProps) {
  const [prompt, setPrompt] = React.useState("");
  const [showAgentMenu, setShowAgentMenu] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!prompt.trim() || isGenerating) return;
    onSendMessage(prompt.trim(), activeAgent);
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const agentList: AgentType[] = [
    "ORCHESTRATOR",
    "PLANNER",
    "PRODUCTIVITY",
    "HEALTH",
    "FINANCE",
    "SHOPPING",
    "CALENDAR",
    "JOURNAL",
    "NOTIFICATION",
    "MEMORY",
    "RESEARCH",
    "AUTOMATION",
    "CAREER_COACH",
    "WELLNESS_COACH",
  ];

  const currentAgentConfig = AGENT_CONFIGS[activeAgent] || AGENT_CONFIGS.ORCHESTRATOR;
  const CurrentAgentIcon = currentAgentConfig.icon;

  return (
    <div className="relative flex flex-col gap-2 p-3 rounded-2xl border border-border/40 bg-card shadow-lg dark:border-border/20 backdrop-blur-md">
      {/* Agent Selection Header & Quick Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-border/20 select-none">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAgentMenu(!showAgentMenu)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground border border-border/30 transition-all cursor-pointer"
          >
            <CurrentAgentIcon className="h-3.5 w-3.5 text-indigo-500" />
            <span>{currentAgentConfig.label}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {showAgentMenu && (
            <div className="absolute left-0 bottom-full mb-2 w-56 max-h-64 overflow-y-auto rounded-xl border border-border/40 bg-popover p-1.5 shadow-xl z-50 text-xs">
              <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Select Agent Mode
              </div>
              {agentList.map((type) => {
                const cfg = AGENT_CONFIGS[type];
                const Icon = cfg.icon;
                const isSelected = type === activeAgent;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onAgentChange(type);
                      setShowAgentMenu(false);
                    }}
                    className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-indigo-500/10 text-indigo-500 font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="hidden sm:inline-block text-[11px]">Shift + Enter for new line</span>
        </div>
      </div>

      {/* Input Textarea */}
      <div className="flex items-end gap-2 pt-1">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${currentAgentConfig.label} anything...`}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[40px] max-h-[160px]"
        />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pb-1">
          <button
            type="button"
            className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-not-allowed"
            title="Attach file (Placeholder)"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-not-allowed"
            title="Voice input (Placeholder)"
          >
            <Mic className="h-4 w-4" />
          </button>

          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="p-2.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-sm cursor-pointer"
              title="Stop Generation"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!prompt.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
