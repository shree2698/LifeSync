"use client";

import * as React from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageContainer } from "@/components/page-container";
import {
  Layers,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Key,
  ExternalLink,
  Plus,
  Trash2,
  Radio,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<"ALL" | "STORAGE" | "PUSH" | "OAUTH">("ALL");
  const [isSyncing, setIsSyncing] = React.useState(false);

  const connectedServices = [
    {
      id: "conn-1",
      name: "Google Workspace & Drive",
      type: "OAUTH",
      category: "OAUTH",
      description: "Calendar sync, Gmail draft dispatch, and Drive document search.",
      status: "CONNECTED",
      health: "EXCELLENT",
      lastSynced: "5 mins ago",
      scopes: ["calendar.events", "gmail.send", "drive.readonly"],
      logo: "https://www.google.com/favicon.ico",
    },
    {
      id: "conn-2",
      name: "Cloudinary Media Cloud",
      type: "STORAGE",
      category: "STORAGE",
      description: "Avatar uploads, image optimization, PDF document storage.",
      status: "CONNECTED",
      health: "OPTIMAL",
      lastSynced: "12 mins ago",
      scopes: ["upload.auto", "image.transform", "pdf.storage"],
      logo: "https://cloudinary.com/favicon.ico",
    },
    {
      id: "conn-3",
      name: "Firebase Cloud Messaging",
      type: "PUSH",
      category: "PUSH",
      description: "Push notification registration, device tokens & platform alerts.",
      status: "CONNECTED",
      health: "ACTIVE",
      lastSynced: "1 min ago",
      scopes: ["messaging.send", "device.tokens"],
      logo: "https://firebase.google.com/favicon.ico",
    },
    {
      id: "conn-4",
      name: "Microsoft 365 & Outlook",
      type: "OAUTH",
      category: "OAUTH",
      description: "Outlook email integration and OneDrive document access.",
      status: "DISCONNECTED",
      health: "PAUSED",
      lastSynced: "2 days ago",
      scopes: ["mail.readwrite", "onedrive.read"],
      logo: "https://www.microsoft.com/favicon.ico",
    },
  ];

  const filteredServices = connectedServices.filter((s) => {
    if (selectedCategory === "ALL") return true;
    return s.category === selectedCategory;
  });

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <DashboardShell>
      <PageContainer className="max-w-7xl space-y-6 select-none">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-500" />
              Integrations & Connected Services
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage external service providers, OAuth token security, media storage & push notifications.
            </p>
          </div>
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing Services..." : "Sync All Services"}</span>
          </button>
        </div>

        {/* Security & Health Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Token Encryption & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground leading-relaxed">
                All OAuth tokens and refresh credentials are encrypted at rest with AES-256 and rotated automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Radio className="h-4 w-4" />
                Firebase FCM Push Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground leading-relaxed">
                Registered 3 active device tokens across Web, iOS, and Android platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Cloudinary Storage & Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground leading-relaxed">
                Automatic image optimization enabled (WebP conversion, auto-crop, and secure CDN delivery).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 border-b border-border/30 pb-3">
          {(["ALL", "OAUTH", "STORAGE", "PUSH"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "ALL" ? "All Integrations" : cat}
            </button>
          ))}
        </div>

        {/* Connected Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:border-indigo-500/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center p-2 border border-border/40">
                      <Layers className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">{service.name}</CardTitle>
                      <CardDescription className="text-[11px]">{service.description}</CardDescription>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      service.status === "CONNECTED"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {service.status === "CONNECTED" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" /> Disconnected
                      </>
                    )}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/20">
                  <span>Last Synchronized: {service.lastSynced}</span>
                  <span className="font-semibold text-foreground">Health: {service.health}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Granted Scopes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {service.scopes.map((scope, idx) => (
                      <span key={idx} className="text-[10px] bg-muted/60 text-foreground px-2 py-0.5 rounded-md font-mono">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:underline cursor-pointer">
                    <Key className="h-3 w-3" /> Rotate Tokens
                  </button>
                  {service.status === "CONNECTED" ? (
                    <button className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:underline cursor-pointer">
                      <Trash2 className="h-3 w-3" /> Revoke Access
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                      <Plus className="h-3.5 w-3.5" /> Reconnect
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
