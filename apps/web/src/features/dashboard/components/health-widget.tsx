"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Activity, Droplet, Moon, Flame } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"

export function HealthWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const health = apiRes?.data?.health

  if (isLoading || !health) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-indigo-500" />
            Health Metrics
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Daily metrics synced from your companion devices.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-3 gap-3.5">
        {/* Water */}
        <div className="p-3.5 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 flex flex-col justify-between hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Water</span>
            <Droplet className="h-4 w-4 text-blue-500 fill-blue-500/20" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {health.waterIntakeMl / 1000}L
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 font-mono">
              of {health.waterGoalMl / 1000}L goal
            </p>
          </div>
        </div>

        {/* Sleep */}
        <div className="p-3.5 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 flex flex-col justify-between hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Sleep</span>
            <Moon className="h-4 w-4 text-indigo-500 fill-indigo-500/20" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {health.sleepHours}h
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 font-mono">
              7.5h avg target
            </p>
          </div>
        </div>

        {/* Workout */}
        <div className="p-3.5 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 flex flex-col justify-between hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Workout</span>
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500/20" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {health.workoutMinutes}m
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 font-mono">
              45m active
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
