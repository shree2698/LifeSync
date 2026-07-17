"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { useAuthStore } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { TasksWidget } from "@/features/dashboard/components/tasks-widget"
import { HabitsWidget } from "@/features/dashboard/components/habits-widget"
import { GoalsWidget } from "@/features/dashboard/components/goals-widget"
import { FinanceWidget } from "@/features/dashboard/components/finance-widget"
import { HealthWidget } from "@/features/dashboard/components/health-widget"
import { ShoppingWidget } from "@/features/dashboard/components/shopping-widget"
import { AIWidget } from "@/features/dashboard/components/ai-widget"
import { CalendarWidget } from "@/features/dashboard/components/calendar-widget"
import { NotesWidget } from "@/features/dashboard/components/notes-widget"
import { DeadlinesWidget } from "@/features/dashboard/components/deadlines-widget"

export default function DashboardPage() {
  const profile = useAuthStore((state: any) => state.profile)

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <DashboardShell>
      <PageContainer>
        {/* Dashboard Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 dark:border-border/10 select-none">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {greeting}, {profile?.fullName?.split(" ")[0] || "there"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here is what is happening across your Life Operating System today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground bg-muted/40 dark:bg-muted/10 px-3 py-1.5 rounded-xl border border-border/40 dark:border-border/10">
            <CalendarIcon className="h-4 w-4 text-indigo-500" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Responsive Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* AI Insights (Full Row on Small, Double on Large) */}
          <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 h-[260px]">
            <AIWidget />
          </div>

          {/* Agenda Today */}
          <div className="h-[260px]">
            <TasksWidget />
          </div>

          {/* Calendar Events */}
          <div className="h-[260px]">
            <CalendarWidget />
          </div>

          {/* Upcoming Deadlines */}
          <div className="h-[260px]">
            <DeadlinesWidget />
          </div>

          {/* Notes Preview */}
          <div className="h-[260px]">
            <NotesWidget />
          </div>

          {/* Habits progress */}
          <div className="h-[260px]">
            <HabitsWidget />
          </div>

          {/* Goals and milestones */}
          <div className="h-[260px]">
            <GoalsWidget />
          </div>

          {/* Finance summary */}
          <div className="h-[260px]">
            <FinanceWidget />
          </div>

          {/* Health metrics */}
          <div className="h-[260px]">
            <HealthWidget />
          </div>

          {/* Shopping items */}
          <div className="h-[260px]">
            <ShoppingWidget />
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
