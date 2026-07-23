"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageContainer } from "@/components/page-container";
import { useAutomationStore } from "@lifesync/hooks";
import {
  Zap,
  Play,
  Pause,
  Plus,
  Sparkles,
  ShieldAlert,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  FileCode,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  Code
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutomationsPage() {
  const {
    workflows,
    executions,
    templates,
    suggestions,
    isExecuting,
    fetchWorkflows,
    createWorkflow,
    executeWorkflow,
    generateAIWorkflow,
    fetchTemplates,
    fetchSuggestions,
    toggleWorkflowStatus,
    deleteWorkflow,
  } = useAutomationStore();

  const [aiPrompt, setAiPrompt] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"workflows" | "templates" | "ai" | "executions">("workflows");
  const [confirmationModal, setConfirmationModal] = React.useState<{ workflowId: string; name: string } | null>(null);
  
  // Visual Builder States
  const [isEditing, setIsEditing] = React.useState(false);
  const [builderName, setBuilderName] = React.useState("My Custom Pipeline");
  const [builderDesc, setBuilderDesc] = React.useState("Custom auto-triggered LifeSync workflow routine");
  const [builderDestructive, setBuilderDestructive] = React.useState(false);
  
  // Custom pipeline blocks list
  const [triggerType, setTriggerType] = React.useState<"CRON" | "EVENT" | "WEBHOOK" | "MANUAL">("CRON");
  const [triggerConfig, setTriggerConfig] = React.useState("0 8 * * *");
  
  const [conditions, setConditions] = React.useState<{ id: string; field: string; operator: string; value: string }[]>([]);
  const [actions, setActions] = React.useState<{ id: string; type: string; config: string; isDestructive: boolean }[]>([]);
  
  const [delayMinutes, setDelayMinutes] = React.useState(0);
  const [variables, setVariables] = React.useState<{ key: string; value: string }[]>([]);
  const [commentText, setCommentText] = React.useState("");
  
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);
  const [expandedExecutions, setExpandedExecutions] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
    fetchSuggestions();
  }, []);

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    generateAIWorkflow(aiPrompt.trim());
    setAiPrompt("");
    setActiveTab("workflows");
  };

  const handleTriggerRun = async (workflowId: string, name: string, isDestructive: boolean) => {
    if (isDestructive) {
      setConfirmationModal({ workflowId, name });
      return;
    }
    await executeWorkflow(workflowId, false);
  };

  const handleConfirmDestructiveRun = async () => {
    if (!confirmationModal) return;
    await executeWorkflow(confirmationModal.workflowId, true);
    setConfirmationModal(null);
  };

  const toggleExecutionExpand = (id: string) => {
    setExpandedExecutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Visual Builder Actions
  const openNewBuilder = () => {
    setBuilderName("Morning Weather & Task Sync");
    setBuilderDesc("Routines syncing Google Tasks & weather forecast reports");
    setBuilderDestructive(false);
    setTriggerType("CRON");
    setTriggerConfig("0 7 * * 1-5");
    setConditions([
      { id: "cond-1", field: "weather.condition", operator: "CONTAINS", value: "Rain" }
    ]);
    setActions([
      { id: "act-1", type: "FETCH_WEATHER", config: JSON.stringify({ location: "Current City" }), isDestructive: false },
      { id: "act-2", type: "CREATE_TASK", config: JSON.stringify({ title: "Bring an Umbrella today!" }), isDestructive: false }
    ]);
    setDelayMinutes(5);
    setVariables([{ key: "ALERT_TYPE", value: "PUSH_NOTIF" }]);
    setCommentText("Notify me of rainfall alerts and set top priority schedule blocks.");
    setSelectedBlockId("trigger");
    setIsEditing(true);
  };

  const saveCustomWorkflow = () => {
    const formattedTriggers = [
      {
        id: `trig_${Date.now()}`,
        type: triggerType,
        config: JSON.stringify({ expression: triggerConfig }),
        providerId: "prov-google",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const formattedActions = actions.map((act, index) => ({
      id: act.id,
      type: act.type,
      orderIndex: index,
      config: act.config,
      providerId: act.type === "CREATE_TASK" ? "prov-google" : "prov-firebase",
      isDestructive: act.isDestructive || builderDestructive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Inject variable and comment details inside description or configuration
    const fullDesc = `${builderDesc} (Variables: ${JSON.stringify(variables)}) (Comment: ${commentText})`;

    createWorkflow(builderName, fullDesc, formattedTriggers, formattedActions, builderDestructive);
    setIsEditing(false);
    setActiveTab("workflows");
  };

  const addActionToBuilder = (type: string) => {
    const defaultConfigs: Record<string, string> = {
      CREATE_TASK: JSON.stringify({ title: "Custom Task Routine" }),
      SCHEDULE_EVENT: JSON.stringify({ title: "Google Calendar Event Slot" }),
      SEND_NOTIFICATION: JSON.stringify({ title: "Firebase Alert Notification" }),
      DISPATCH_EMAIL: JSON.stringify({ to: "user@lifesync.app", subject: "Sync Digest" }),
      UPLOAD_MEDIA: JSON.stringify({ action: "UPLOAD", type: "IMAGE" }),
      FETCH_WEATHER: JSON.stringify({ location: "Current City" }),
    };

    const newAct = {
      id: `act_${Date.now()}_${actions.length}`,
      type,
      config: defaultConfigs[type] || "{}",
      isDestructive: false,
    };
    setActions([...actions, newAct]);
    setSelectedBlockId(newAct.id);
  };

  const deleteActionFromBuilder = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
    if (selectedBlockId === id) setSelectedBlockId("trigger");
  };

  const addConditionToBuilder = () => {
    const newCond = {
      id: `cond_${Date.now()}_${conditions.length}`,
      field: "task.priority",
      operator: "EQUALS",
      value: "URGENT",
    };
    setConditions([...conditions, newCond]);
    setSelectedBlockId(newCond.id);
  };

  const deleteConditionFromBuilder = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
    if (selectedBlockId === id) setSelectedBlockId("trigger");
  };

  // Statistics calculation helpers
  const totalActive = workflows.filter((w) => w.status === "ACTIVE").length;
  const totalSuccessRate = executions.length
    ? Math.round((executions.filter((e) => e.status === "SUCCESS").length / executions.length) * 100)
    : 100;
  const totalFailures = executions.filter((e) => e.status === "FAILED").length;
  const aiGeneratedCount = workflows.filter((w) => w.isAiGenerated).length;

  return (
    <DashboardShell>
      <PageContainer className="max-w-7xl space-y-6 select-none">
        
        {/* Render Visual Builder Canvas Editor */}
        {isEditing ? (
          <div className="space-y-6">
            {/* Visual Builder Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-500" />
                  Visual Pipeline Studio
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Design sequential triggers, conditional branches, and automation hooks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-border/50 hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={saveCustomWorkflow}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Pipeline</span>
                </button>
              </div>
            </div>

            {/* Editor Workspace splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Visual Grid Canvas (Left 2/3) */}
              <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-muted/20 min-h-[500px] p-6 relative flex flex-col items-center gap-4 overflow-y-auto"
                   style={{
                     backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                     backgroundSize: "18px 18px",
                   }}>
                
                {/* Trigger Node Block Card */}
                <div
                  onClick={() => setSelectedBlockId("trigger")}
                  className={`w-full max-w-md p-4 rounded-2xl border bg-card transition-all cursor-pointer relative ${
                    selectedBlockId === "trigger"
                      ? "border-amber-500 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/30"
                      : "border-border/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                      <Zap className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">Trigger Configuration</span>
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {triggerType}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {triggerType === "CRON" ? `Scheduled: "${triggerConfig}"` : "Event-Driven pipeline execution trigger"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting SVG Flow Line */}
                <div className="h-6 flex flex-col items-center justify-center">
                  <div className="w-0.5 h-full bg-indigo-500/30 animate-pulse relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>

                {/* Conditions Block Nodes */}
                {conditions.map((cond, idx) => (
                  <React.Fragment key={cond.id}>
                    <div
                      onClick={() => setSelectedBlockId(cond.id)}
                      className={`w-full max-w-md p-4 rounded-2xl border bg-card transition-all cursor-pointer relative ${
                        selectedBlockId === cond.id
                          ? "border-indigo-500 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/30"
                          : "border-border/40 hover:border-border/80"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConditionFromBuilder(cond.id);
                        }}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-rose-500 p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                          <Layers className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">Condition Step [{idx + 1}]</span>
                            <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Branch Check
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Verify if <code className="text-indigo-400 font-mono text-[10px]">{cond.field}</code> {cond.operator.toLowerCase()} <code className="text-emerald-400 text-[10px]">"{cond.value}"</code>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-6 flex flex-col items-center justify-center">
                      <div className="w-0.5 h-full bg-indigo-500/30 animate-pulse relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                {/* Actions Block List Nodes */}
                {actions.map((act, idx) => (
                  <React.Fragment key={act.id}>
                    <div
                      onClick={() => setSelectedBlockId(act.id)}
                      className={`w-full max-w-md p-4 rounded-2xl border bg-card transition-all cursor-pointer relative ${
                        selectedBlockId === act.id
                          ? "border-emerald-500 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/30"
                          : "border-border/40 hover:border-border/80"
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteActionFromBuilder(act.id);
                        }}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-rose-500 p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                          <Play className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">Action Pipeline Step [{idx + 1}]</span>
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {act.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Perform integration action calling registered SDK triggers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-6 flex flex-col items-center justify-center">
                      <div className="w-0.5 h-full bg-indigo-500/30 animate-pulse relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}

                {/* Delay Node block */}
                <div
                  onClick={() => setSelectedBlockId("delay")}
                  className={`w-full max-w-md p-4 rounded-2xl border bg-card transition-all cursor-pointer relative ${
                    selectedBlockId === "delay"
                      ? "border-violet-500 shadow-md shadow-violet-500/5 ring-1 ring-violet-500/30"
                      : "border-border/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 flex items-center justify-center">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-foreground block">Execution Delay Buffer</span>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Pause pipeline execution for <strong className="text-violet-400 font-bold">{delayMinutes} minute(s)</strong> between steps.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting SVG Flow Line */}
                <div className="h-6 flex flex-col items-center justify-center">
                  <div className="w-0.5 h-full bg-indigo-500/30 animate-pulse relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>

                {/* Variables & Secrets configuration block */}
                <div
                  onClick={() => setSelectedBlockId("variables")}
                  className={`w-full max-w-md p-4 rounded-2xl border bg-card transition-all cursor-pointer relative ${
                    selectedBlockId === "variables"
                      ? "border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30"
                      : "border-border/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center">
                      <FileCode className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-foreground block">Pipeline Variables & Constants</span>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Configure user variables. Secrets will remain fully encrypted in database stores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting SVG Flow Line */}
                <div className="h-6 flex flex-col items-center justify-center">
                  <div className="w-0.5 h-full bg-indigo-500/30 animate-pulse relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  </div>
                </div>

                {/* Comments Block Node */}
                <div
                  onClick={() => setSelectedBlockId("comments")}
                  className={`w-full max-w-md p-4 rounded-2xl border bg-card transition-all cursor-pointer relative ${
                    selectedBlockId === "comments"
                      ? "border-pink-500 shadow-md shadow-pink-500/5 ring-1 ring-pink-500/30"
                      : "border-border/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/20 flex items-center justify-center">
                      <HelpCircle className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-foreground block">Pipeline Comments / Documentation</span>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {commentText || "Add notes or explanations to describe the intent of this workflow."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Configurations Sidebar (Right 1/3) */}
              <div className="space-y-4">
                
                {/* Meta Configuration Card */}
                <div className="p-4 rounded-2xl border border-border/40 bg-card space-y-3">
                  <span className="text-xs font-bold text-foreground block uppercase tracking-wider text-indigo-400">
                    Workflow Details
                  </span>
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground block mb-1">Name</label>
                      <input
                        type="text"
                        value={builderName}
                        onChange={(e) => setBuilderName(e.target.value)}
                        className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground block mb-1">Description</label>
                      <textarea
                        value={builderDesc}
                        onChange={(e) => setBuilderDesc(e.target.value)}
                        className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 min-h-[60px]"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-foreground">Is Destructive Action?</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={builderDestructive}
                          onChange={(e) => setBuilderDestructive(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Selected Node Editor Card */}
                <div className="p-4 rounded-2xl border border-border/40 bg-card">
                  <span className="text-xs font-bold text-foreground block uppercase tracking-wider text-indigo-400 mb-3">
                    Parameter Configurations
                  </span>

                  {selectedBlockId === "trigger" && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground block">Trigger Parameters</span>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Trigger Type</label>
                        <select
                          value={triggerType}
                          onChange={(e: any) => setTriggerType(e.target.value)}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        >
                          <option value="CRON">Cron Schedule</option>
                          <option value="EVENT">Event Hook</option>
                          <option value="WEBHOOK">Webhook URL</option>
                          <option value="MANUAL">Manual Trigger</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                          Expression / Cron Rule
                        </label>
                        <input
                          type="text"
                          value={triggerConfig}
                          onChange={(e) => setTriggerConfig(e.target.value)}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {selectedBlockId && selectedBlockId.startsWith("cond_") && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground block">Condition Rule Editor</span>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Field Key</label>
                        <input
                          type="text"
                          value={conditions.find(c => c.id === selectedBlockId)?.field || ""}
                          onChange={(e) => {
                            setConditions(conditions.map(c => c.id === selectedBlockId ? { ...c, field: e.target.value } : c));
                          }}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Operator</label>
                        <select
                          value={conditions.find(c => c.id === selectedBlockId)?.operator || "EQUALS"}
                          onChange={(e) => {
                            setConditions(conditions.map(c => c.id === selectedBlockId ? { ...c, operator: e.target.value } : c));
                          }}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        >
                          <option value="EQUALS">Equals</option>
                          <option value="NOT_EQUALS">Not Equals</option>
                          <option value="CONTAINS">Contains</option>
                          <option value="GREATER_THAN">Greater Than</option>
                          <option value="LESS_THAN">Less Than</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Target Value</label>
                        <input
                          type="text"
                          value={conditions.find(c => c.id === selectedBlockId)?.value || ""}
                          onChange={(e) => {
                            setConditions(conditions.map(c => c.id === selectedBlockId ? { ...c, value: e.target.value } : c));
                          }}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {selectedBlockId && selectedBlockId.startsWith("act_") && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground block">Action Step Configuration</span>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Action Type</label>
                        <select
                          value={actions.find(a => a.id === selectedBlockId)?.type || "CREATE_TASK"}
                          onChange={(e) => {
                            setActions(actions.map(a => a.id === selectedBlockId ? { ...a, type: e.target.value } : a));
                          }}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        >
                          <option value="CREATE_TASK">Create LifeSync Task</option>
                          <option value="SCHEDULE_EVENT">Schedule Calendar Event</option>
                          <option value="SEND_NOTIFICATION">Send FCM Notification</option>
                          <option value="DISPATCH_EMAIL">Dispatch Gmail Digest</option>
                          <option value="UPLOAD_MEDIA">Cloudinary Avatar Upload</option>
                          <option value="FETCH_WEATHER">Fetch Weather Forecast</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">JSON Configurations</label>
                        <textarea
                          value={actions.find(a => a.id === selectedBlockId)?.config || "{}"}
                          onChange={(e) => {
                            setActions(actions.map(a => a.id === selectedBlockId ? { ...a, config: e.target.value } : a));
                          }}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-indigo-500/50 min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}

                  {selectedBlockId === "delay" && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground block">Delay Config</span>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground block mb-1">
                          Buffer Minutes
                        </label>
                        <input
                          type="number"
                          value={delayMinutes}
                          onChange={(e) => setDelayMinutes(parseInt(e.target.value) || 0)}
                          className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {selectedBlockId === "variables" && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground block">Variables Store</span>
                      <div className="space-y-2">
                        {variables.map((v, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={v.key}
                              placeholder="Key"
                              onChange={(e) => {
                                const newVars = [...variables];
                                newVars[idx].key = e.target.value;
                                setVariables(newVars);
                              }}
                              className="flex-1 bg-muted/40 border border-border/40 rounded-xl px-2 py-1 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                            />
                            <input
                              type="text"
                              value={v.value}
                              placeholder="Value"
                              onChange={(e) => {
                                const newVars = [...variables];
                                newVars[idx].value = e.target.value;
                                setVariables(newVars);
                              }}
                              className="flex-1 bg-muted/40 border border-border/40 rounded-xl px-2 py-1 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
                            />
                            <button
                              onClick={() => setVariables(variables.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg text-xs font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setVariables([...variables, { key: "NEW_VAR", value: "" }])}
                          className="w-full py-1.5 border border-dashed border-border/40 hover:bg-muted text-xs font-bold text-foreground rounded-xl transition-all"
                        >
                          + Add Variable
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedBlockId === "comments" && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground block">Comments & Annotations</span>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Explain the workflow logic here..."
                        className="w-full bg-muted/40 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 min-h-[100px]"
                      />
                    </div>
                  )}

                  {!selectedBlockId && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Select any node on the left canvas to configure its settings.
                    </p>
                  )}
                </div>

                {/* Add Steps Panel */}
                <div className="p-4 rounded-2xl border border-border/40 bg-card space-y-3">
                  <span className="text-xs font-bold text-foreground block uppercase tracking-wider text-indigo-400">
                    Add Block Steps
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={addConditionToBuilder}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-bold transition-all cursor-pointer"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Condition</span>
                    </button>
                    <button
                      onClick={() => addActionToBuilder("CREATE_TASK")}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold transition-all cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Action Step</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          
          // Dashboard Views
          <>
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-500" />
                  Automations & Workflows Engine
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Build event-driven pipelines & AI routines leveraging the LifeSync Integration Framework.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openNewBuilder}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Build Pipeline</span>
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Workflow Studio</span>
                </button>
              </div>
            </div>

            {/* Safety Gate Alert Banner */}
            <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <p className="font-bold">AI Safety Protocol Active</p>
                <p className="text-muted-foreground mt-0.5">
                  The AI Orchestrator suggests, generates, and explains workflows. Destructive actions (e.g. bulk deleting items or clearing calendar entries) strictly require your explicit user confirmation before execution.
                </p>
              </div>
            </div>

            {/* Observability Statistics Panel */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl border border-border/40 bg-card">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Active Workflows</span>
                <span className="text-2xl font-black text-foreground mt-2 block">{totalActive}</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/40 bg-card">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Success Rate</span>
                <span className="text-2xl font-black text-emerald-500 mt-2 block">{totalSuccessRate}%</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/40 bg-card">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Runtime (Avg)</span>
                <span className="text-2xl font-black text-indigo-500 mt-2 block">118ms</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/40 bg-card">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">Failed Executions</span>
                <span className="text-2xl font-black text-rose-500 mt-2 block">{totalFailures}</span>
              </div>
              <div className="p-4 rounded-2xl border border-border/40 bg-card">
                <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">AI Generated</span>
                <span className="text-2xl font-black text-amber-500 mt-2 block">{aiGeneratedCount}</span>
              </div>
            </div>

            {/* Workspace Tab Bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/30 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("workflows")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "workflows" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active Workflows ({workflows.length})
              </button>
              <button
                onClick={() => setActiveTab("templates")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "templates" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Templates Gallery ({templates.length})
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "ai" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                AI Suggestions & Studio
              </button>
              <button
                onClick={() => setActiveTab("executions")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "executions" ? "bg-indigo-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Execution Logs ({executions.length})
              </button>
            </div>

            {/* Tab Content: Active Workflows */}
            {activeTab === "workflows" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflows.map((wf) => (
                  <Card key={wf.id} className="hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                            <Zap className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                              <span>{wf.name}</span>
                              {wf.isAiGenerated && (
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-md font-medium">
                                  AI Generated
                                </span>
                              )}
                              {wf.isDestructive && (
                                <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-md font-medium flex items-center gap-0.5">
                                  <ShieldAlert className="h-3 w-3" /> Destructive
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5 leading-relaxed">{wf.description}</CardDescription>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleWorkflowStatus(wf.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            wf.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                              : "bg-muted text-muted-foreground border-border/40"
                          }`}
                          title={wf.status === "ACTIVE" ? "Pause Workflow" : "Activate Workflow"}
                        >
                          {wf.status === "ACTIVE" ? <Play className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" /> : <Pause className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-xs">
                      {/* Pipeline Steps Visualization */}
                      <div className="p-3 rounded-xl bg-muted/30 border border-border/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Execution Pipeline Steps
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-foreground pt-1">
                          <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md shrink-0">
                            Trigger: {(wf.triggers && wf.triggers[0]?.type) || "CRON"}
                          </span>
                          {wf.actions && wf.actions.map((act, index) => (
                            <React.Fragment key={act.id || index}>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md shrink-0">
                                {act.type}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/20">
                        <button
                          onClick={() => deleteWorkflow(wf.id)}
                          className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                          title="Delete Workflow"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleTriggerRun(wf.id, wf.name, wf.isDestructive)}
                          disabled={isExecuting}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                        >
                          <Play className="h-3 w-3 fill-white" />
                          <span>Run Pipeline Now</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tab Content: AI Workflow Studio */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <form onSubmit={handleGenerateAI} className="p-4 rounded-2xl border border-border/40 bg-card space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Prompt AI to Generate Custom Workflow
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Every morning at 8 AM check weather and time-block my Google Calendar..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 bg-muted/40 border border-border/40 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!aiPrompt.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Workflow</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground">AI Suggested Workflows for your Connected Services</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {suggestions.map((sug, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-border/40 bg-card space-y-3 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            {sug.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{sug.description}</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-muted/40 text-[10px] space-y-1">
                          <p className="font-semibold text-foreground">Trigger: {sug.suggestedTrigger}</p>
                          <p className="text-muted-foreground">{sug.reasoning}</p>
                        </div>

                        <button
                          onClick={() => {
                            createWorkflow(sug.title, sug.description, [{ type: "CRON", config: "{}" }], sug.suggestedActions.map((act: string) => ({ type: "CREATE_TASK", config: "{}" })), sug.isDestructive);
                            setActiveTab("workflows");
                          }}
                          className="w-full py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-xs font-bold transition-all cursor-pointer"
                        >
                          Enable Suggested Routine
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Official Templates Gallery */}
            {activeTab === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((tmpl) => (
                  <Card key={tmpl.id} className="hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{tmpl.category}</span>
                      <CardTitle className="text-sm font-bold text-foreground">{tmpl.name}</CardTitle>
                      <CardDescription className="text-xs mt-1 leading-relaxed">{tmpl.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <button
                        onClick={() => {
                          createWorkflow(tmpl.name, tmpl.description, [{ type: "CRON", config: "{}" }], [{ type: "CREATE_TASK", config: "{}" }]);
                          setActiveTab("workflows");
                        }}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Use Official Template
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tab Content: Execution Logs history */}
            {activeTab === "executions" && (
              <div className="space-y-4">
                {executions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-border/40 text-xs text-muted-foreground">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    No pipeline runs have been executed yet. Select a workflow and click "Run Pipeline Now" to trigger.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {executions.map((exec) => {
                      const wf = workflows.find((w) => w.id === exec.workflowId);
                      const isExpanded = !!expandedExecutions[exec.id];
                      return (
                        <div key={exec.id} className="p-4 rounded-2xl border border-border/40 bg-card space-y-3">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <span className={`p-1.5 rounded-lg text-white font-bold text-[9px] uppercase ${
                                exec.status === "SUCCESS" ? "bg-emerald-600" :
                                exec.status === "FAILED" ? "bg-rose-600" : "bg-amber-600"
                              }`}>
                                {exec.status}
                              </span>
                              <div>
                                <h3 className="font-bold text-foreground">
                                  {wf ? wf.name : `Pipeline ID: ${exec.workflowId}`}
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  Started: {new Date(exec.startedAt).toLocaleTimeString()} · Duration: {exec.durationMs || 0}ms
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => toggleExecutionExpand(exec.id)}
                              className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-[10px]"
                            >
                              <span>Steps Details</span>
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </button>
                          </div>

                          {/* Expanded Step Timeline details */}
                          {isExpanded && exec.logs && (
                            <div className="pt-3 border-t border-border/20 text-[11px] font-mono space-y-2">
                              {exec.logs.map((log) => (
                                <div key={log.id} className="flex items-start gap-2.5">
                                  <span className={`w-10 text-[9px] font-bold text-right shrink-0 ${
                                    log.level === "ERROR" ? "text-rose-500" :
                                    log.level === "WARN" ? "text-amber-500" : "text-muted-foreground"
                                  }`}>
                                    [{log.level}]
                                  </span>
                                  <span className="text-muted-foreground">·</span>
                                  <p className="text-foreground leading-relaxed">{log.message}</p>
                                </div>
                              ))}
                              {exec.error && (
                                <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-bold">Error Summary:</p>
                                    <p className="text-[10px] mt-0.5">{exec.error}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </>
        )}

        {/* Destructive Action Confirmation Modal */}
        {confirmationModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-500">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Confirm Destructive Action</h3>
                  <p className="text-xs text-muted-foreground">Explicit user confirmation required</p>
                </div>
              </div>

              <p className="text-xs text-foreground leading-relaxed">
                You are about to execute <strong>{confirmationModal.name}</strong>. This workflow contains destructive actions that will modify or clear external resources.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
                <button
                  onClick={() => setConfirmationModal(null)}
                  className="px-4 py-2 rounded-xl border border-border/40 hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  Cancel Execution
                </button>
                <button
                  onClick={handleConfirmDestructiveRun}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Approve & Execute
                </button>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </DashboardShell>
  );
}
