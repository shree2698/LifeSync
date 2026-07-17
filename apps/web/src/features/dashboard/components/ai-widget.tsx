"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Sparkles, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"

export function AIWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const ai = apiRes?.data?.aiAssistant

  if (isLoading || !ai) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
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
            <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
            AI Assistant Summary
          </CardTitle>
          <Zap className="h-4 w-4 text-indigo-500" />
        </div>
        <CardDescription className="text-xs">
          Daily tailored productivity & wellbeing summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-3.5">
        <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 dark:bg-indigo-500/10/5 text-xs text-foreground leading-relaxed">
          {ai.summary}
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10">
          <Sparkles className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Suggestion</p>
            <p className="text-xs text-foreground mt-1 leading-relaxed">{ai.suggestion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
