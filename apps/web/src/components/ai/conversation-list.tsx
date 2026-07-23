"use client";

import * as React from "react";
import { Conversation, AgentType } from "@lifesync/types";
import { Plus, Pin, Archive, Trash2, MessageSquare, Search } from "lucide-react";
import { AgentBadge } from "./agent-badge";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onTogglePin,
  onToggleArchive,
  onDelete,
}: ConversationListProps) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (c) => c.title.toLowerCase().includes(q) || (c.summary && c.summary.toLowerCase().includes(q))
    );
  }, [conversations, query]);

  const pinnedList = filtered.filter((c) => c.isPinned && !c.isArchived);
  const activeList = filtered.filter((c) => !c.isPinned && !c.isArchived);

  return (
    <div className="flex flex-col h-full space-y-3 select-none">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onNewChat}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full bg-muted/40 border border-border/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Conversations Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Pinned Section */}
        {pinnedList.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              <Pin className="h-3 w-3 text-amber-500" />
              <span>Pinned</span>
            </div>
            {pinnedList.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeId}
                onSelect={() => onSelect(conv.id)}
                onTogglePin={() => onTogglePin(conv.id)}
                onToggleArchive={() => onToggleArchive(conv.id)}
                onDelete={() => onDelete(conv.id)}
              />
            ))}
          </div>
        )}

        {/* Regular Active Section */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">
            Recent Chats ({activeList.length})
          </div>
          {activeList.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/40 rounded-xl">
              No conversations found
            </div>
          ) : (
            activeList.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeId}
                onSelect={() => onSelect(conv.id)}
                onTogglePin={() => onTogglePin(conv.id)}
                onToggleArchive={() => onToggleArchive(conv.id)}
                onDelete={() => onDelete(conv.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onTogglePin,
  onToggleArchive,
  onDelete,
}: {
  conv: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
        isActive
          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium"
          : "hover:bg-muted/50 text-foreground border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
        <div className="truncate text-xs">
          <p className="font-medium truncate">{conv.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-muted-foreground">
              {new Date(conv.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Action Buttons */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className={`p-1 rounded-md hover:bg-muted text-muted-foreground ${conv.isPinned ? "text-amber-500" : ""}`}
          title="Pin Chat"
        >
          <Pin className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleArchive();
          }}
          className="p-1 rounded-md hover:bg-muted text-muted-foreground"
          title="Archive Chat"
        >
          <Archive className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          title="Delete Chat"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
