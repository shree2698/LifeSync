"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"
import { formatDate } from "@lifesync/utils"

export function DeadlinesWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const tasks = apiRes?.data?.tasks || []
  const goals = apiRes?.data?.goals || []

  // Combine and filter upcoming items
  const upcomingDeadlines = React.useMemo(() => {
    const list: Array<{ id: string; title: string; date: string; type: "task" | "goal"; urgency: boolean }> = []
    
    // Check tasks with due dates that aren't completed
    tasks.forEach((t) => {
      if (t.dueDate && t.status !== "COMPLETED") {
        list.push({
          id: t.id,
          title: t.title,
          date: t.dueDate,
          type: "task",
          urgency: t.priority === "URGENT" || t.priority === "HIGH",
        })
      }
    })

    // Check active goals with deadlines
    goals.forEach((g) => {
      if (g.deadline && g.status === "ACTIVE") {
        list.push({
          id: g.id,
          title: g.title,
          date: g.deadline,
          type: "goal",
          urgency: g.priority === "URGENT",
        })
      }
    })

    // Sort chronologically
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return list.slice(0, 3)
  }, [tasks, goals])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col border-rose-500/10 dark:border-rose-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 text-rose-500" />
            Upcoming Deadlines
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Approaching tasks and objectives.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {upcomingDeadlines.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <Clock className="h-8 w-8 text-rose-500/50" />
            <p className="text-xs font-semibold text-foreground">No immediate deadlines</p>
            <p className="text-2xs text-muted-foreground">Keep up the steady progress!</p>
          </div>
        ) : (
          upcomingDeadlines.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex justify-between items-center gap-3 transition-all hover:bg-muted/30 ${
                item.urgency
                  ? "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10/5"
                  : "border-border/40 bg-muted/10 dark:border-border/10"
              }`}
            >
              <div className="truncate min-w-0">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {item.type}
                </span>
                <span className="text-xs font-semibold text-foreground truncate block mt-0.5 leading-tight">
                  {item.title}
                </span>
              </div>
              <span className="text-2xs font-bold text-muted-foreground font-mono shrink-0 ml-2">
                {formatDate(item.date)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
