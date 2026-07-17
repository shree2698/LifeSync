"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Target, Flag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"

export function GoalsWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const goals = apiRes?.data?.goals || []

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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <Target className="h-4.5 w-4.5 text-rose-500" />
            Objectives & Goals
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Your overarching milestones.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3.5">
        {goals.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <Flag className="h-8 w-8 text-rose-500/70" />
            <p className="text-xs font-semibold text-foreground">Set your targets</p>
            <p className="text-2xs text-muted-foreground">Add objectives to focus on what matters.</p>
          </div>
        ) : (
          goals.map((goal: any) => {
            const percentage = Math.round((goal.progress / goal.target) * 100)
            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 space-y-2.5 transition-all hover:border-rose-500/20"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold text-foreground leading-tight truncate">
                    {goal.title}
                  </span>
                  <span className="text-2xs font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono shrink-0">
                    {percentage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-muted dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium font-mono">
                    <span>Current: {goal.progress}</span>
                    <span>Target: {goal.target}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
