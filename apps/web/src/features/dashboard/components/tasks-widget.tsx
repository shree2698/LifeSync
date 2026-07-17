"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Circle, Clock, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"
import { formatDate } from "@lifesync/utils"

export function TasksWidget() {
  const { data: apiRes, isLoading, error } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const tasks = apiRes?.data?.tasks || []

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
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <CheckSquare className="h-4.5 w-4.5 text-indigo-500" />
            Today&apos;s Agenda
          </CardTitle>
          <span className="text-2xs font-bold text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-lg dark:bg-muted/10">
            {tasks.filter((t: any) => t.completed).length}/{tasks.length} Done
          </span>
        </div>
        <CardDescription className="text-xs">
          Your tasks and actions for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {tasks.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <CheckCircle2 className="h-8 w-8 text-emerald-500/70" />
            <p className="text-xs font-semibold text-foreground">You are all caught up!</p>
            <p className="text-2xs text-muted-foreground">No tasks scheduled for today.</p>
          </div>
        ) : (
          tasks.map((task: any) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 transition-all ${
                task.completed ? "opacity-60" : "hover:border-indigo-500/20"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <button className="text-muted-foreground hover:text-indigo-500 transition">
                  {task.completed ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500" />
                  ) : (
                    <Circle className="h-4.5 w-4.5" />
                  )}
                </button>
                <span className={`text-xs font-medium truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title}
                </span>
              </div>
              {task.dueDate && (
                <div className="flex items-center space-x-1 text-2xs text-muted-foreground font-medium shrink-0 ml-2">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
