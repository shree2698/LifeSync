"use client";

import * as React from "react";
import { MemoryItem } from "@lifesync/types";
import { Brain, Trash2, Tag, Clock } from "lucide-react";

interface MemoryCardProps {
  memory: MemoryItem;
  onDelete: (id: string) => void;
}

export function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  return (
    <div className="flex items-start justify-between p-3.5 rounded-xl border border-border/40 bg-card hover:border-indigo-500/30 transition-all shadow-xs group">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 mt-0.5">
          <Brain className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{memory.key}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Tag className="h-2.5 w-2.5" />
              {memory.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{memory.value}</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 pt-1">
            <Clock className="h-3 w-3" />
            <span>Added {new Date(memory.createdAt).toLocaleDateString()}</span>
            <span>• Confidence: {Math.round(memory.confidence * 100)}%</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(memory.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
        title="Delete Memory"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
