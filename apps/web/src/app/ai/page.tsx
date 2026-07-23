"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageContainer } from "@/components/page-container";
import { useAIStore } from "@lifesync/hooks";
import { ChatWindow } from "@/components/ai/chat-window";
import { ConversationList } from "@/components/ai/conversation-list";
import { MemoryCard } from "@/components/ai/memory-card";
import { AgentBadge } from "@/components/ai/agent-badge";
import {
  Sparkles,
  Brain,
  BarChart3,
  Bot,
  Plus,
  Trash2,
  Download,
  PanelLeft,
  X,
  Search,
} from "lucide-react";
import { AgentType } from "@lifesync/types";

export default function AIWorkspacePage() {
  const {
    conversations,
    activeConversationId,
    activeAgentType,
    isGenerating,
    memories,
    agents,
    observabilityStats,
    fetchConversations,
    selectConversation,
    setActiveAgentType,
    createConversation,
    sendMessage,
    togglePinConversation,
    toggleArchiveConversation,
    deleteConversation,
    fetchMemories,
    storeMemory,
    deleteMemory,
    clearMemories,
    exportMemories,
    fetchAgents,
    fetchObservability,
  } = useAIStore();

  const [activeTab, setActiveTab] = React.useState<"chat" | "memory" | "agents" | "observability">("chat");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [newMemoryKey, setNewMemoryKey] = React.useState("");
  const [newMemoryValue, setNewMemoryValue] = React.useState("");
  const [newMemoryCategory, setNewMemoryCategory] = React.useState<any>("PREFERENCE");

  React.useEffect(() => {
    fetchConversations();
    fetchMemories();
    fetchAgents();
    fetchObservability();
  }, []);

  // Keyboard Shortcuts Listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createConversation("New Conversation", activeAgentType);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAgentType]);

  const activeConversation = React.useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) return;
    await storeMemory(newMemoryCategory, newMemoryKey.trim(), newMemoryValue.trim());
    setNewMemoryKey("");
    setNewMemoryValue("");
  };

  const handleExportMemories = async () => {
    const data = await exportMemories();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifesync-memories-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <DashboardShell>
      <PageContainer className="max-w-7xl h-[calc(100vh-5rem)] flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Workspace Top Navigation Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl border border-border/40 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                LifeSync AI Workspace
              </h1>
              <p className="text-xs text-muted-foreground">
                Intelligent Life Operating System Agent Network
              </p>
            </div>
          </div>

          {/* Nav Workspace Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/30 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Chat Workspace</span>
            </button>
            <button
              onClick={() => setActiveTab("memory")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "memory"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              <span>Memory Layer ({memories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("agents")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "agents"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Agent Network</span>
            </button>
            <button
              onClick={() => setActiveTab("observability")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "observability"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Observability</span>
            </button>
          </div>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 flex gap-4 pt-4 overflow-hidden">
          {/* Conversation Sidebar (Collapsible) */}
          {activeTab === "chat" && sidebarOpen && (
            <div className="w-64 sm:w-72 shrink-0 h-full border border-border/40 bg-card/40 rounded-2xl p-3 backdrop-blur-md">
              <ConversationList
                conversations={conversations}
                activeId={activeConversationId}
                onSelect={(id) => selectConversation(id)}
                onNewChat={() => createConversation("New Conversation", activeAgentType)}
                onTogglePin={(id) => togglePinConversation(id)}
                onToggleArchive={(id) => toggleArchiveConversation(id)}
                onDelete={(id) => deleteConversation(id)}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 h-full overflow-hidden">
            {activeTab === "chat" && (
              <ChatWindow
                conversation={activeConversation}
                activeAgent={activeAgentType}
                isGenerating={isGenerating}
                onSendMessage={(prompt, agent) => sendMessage(prompt, agent)}
                onAgentChange={(agent) => setActiveAgentType(agent)}
              />
            )}

            {/* Memory Management Tab */}
            {activeTab === "memory" && (
              <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-1">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-card">
                  <div>
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Brain className="h-5 w-5 text-fuchsia-500" />
                      Long-Term User Memory & Preferences
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Information remembered by LifeSync agents to personalize your experience.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportMemories}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export JSON</span>
                    </button>
                    <button
                      onClick={clearMemories}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-xs font-semibold text-destructive transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                {/* Add New Memory Form */}
                <form onSubmit={handleAddMemory} className="p-4 rounded-2xl border border-border/40 bg-card space-y-3">
                  <span className="text-xs font-bold text-foreground">Add Custom Memory Item</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={newMemoryCategory}
                      onChange={(e) => setNewMemoryCategory(e.target.value as any)}
                      className="bg-muted/40 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                    >
                      <option value="PREFERENCE">PREFERENCE</option>
                      <option value="GOAL">GOAL</option>
                      <option value="HABIT">HABIT</option>
                      <option value="HEALTH">HEALTH</option>
                      <option value="FINANCE">FINANCE</option>
                      <option value="SHOPPING">SHOPPING</option>
                      <option value="WORK">WORK</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Key (e.g., wake_up_time)"
                      value={newMemoryKey}
                      onChange={(e) => setNewMemoryKey(e.target.value)}
                      className="bg-muted/40 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Value (e.g., 06:30 AM)"
                      value={newMemoryValue}
                      onChange={(e) => setNewMemoryValue(e.target.value)}
                      className="bg-muted/40 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMemoryKey.trim() || !newMemoryValue.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Save Memory</span>
                  </button>
                </form>

                {/* Memory Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {memories.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-xs text-muted-foreground border border-dashed border-border/40 rounded-2xl">
                      No memories stored yet. Tell LifeSync to remember something in chat!
                    </div>
                  ) : (
                    memories.map((m) => (
                      <MemoryCard key={m.id} memory={m} onDelete={(id) => deleteMemory(id)} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Agent Network Directory Tab */}
            {activeTab === "agents" && (
              <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-1">
                <div className="p-4 rounded-2xl border border-border/40 bg-card">
                  <h2 className="text-base font-bold text-foreground">
                    LifeSync Agent Network (14 Specialized Agents)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modular agent architecture with domain tool execution privileges.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-4 rounded-2xl border border-border/40 bg-card hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <AgentBadge agentType={agent.type} />
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          {agent.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-border/30">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Capabilities
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((cap: string, i: number) => (
                            <span key={i} className="text-[10px] bg-muted/60 text-foreground px-2 py-0.5 rounded-md">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveAgentType(agent.type);
                          setActiveTab("chat");
                        }}
                        className="w-full mt-2 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-xs font-bold transition-all cursor-pointer"
                      >
                        Start Chat with {agent.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observability Tab */}
            {activeTab === "observability" && (
              <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-1">
                <div className="p-4 rounded-2xl border border-border/40 bg-card">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    AI Platform Observability & Metrics
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time token analytics, request latency, and agent utilization logs.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-border/40 bg-card">
                    <span className="text-xs text-muted-foreground">Total AI Requests</span>
                    <p className="text-2xl font-extrabold text-foreground mt-1">
                      {observabilityStats?.totalRequests || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/40 bg-card">
                    <span className="text-xs text-muted-foreground">Tokens Processed</span>
                    <p className="text-2xl font-extrabold text-indigo-500 mt-1">
                      {observabilityStats?.totalTokens || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/40 bg-card">
                    <span className="text-xs text-muted-foreground">Avg Latency</span>
                    <p className="text-2xl font-extrabold text-emerald-500 mt-1">
                      {observabilityStats?.averageLatencyMs || 0}ms
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/40 bg-card">
                    <span className="text-xs text-muted-foreground">Est. Cost</span>
                    <p className="text-2xl font-extrabold text-amber-500 mt-1">
                      ${(observabilityStats?.totalCost || 0).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
