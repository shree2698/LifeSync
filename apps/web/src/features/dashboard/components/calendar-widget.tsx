"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Clock, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"
import { formatTime } from "@lifesync/utils"

export function CalendarWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const calendar = apiRes?.data?.calendar || []

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
            <Calendar className="h-4.5 w-4.5 text-indigo-500" />
            Calendar Timeline
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Today&apos;s scheduled meetings and events.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {calendar.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <Calendar className="h-8 w-8 text-indigo-500/70" />
            <p className="text-xs font-semibold text-foreground">Nothing scheduled</p>
            <p className="text-2xs text-muted-foreground">Your schedule is free for today.</p>
          </div>
        ) : (
          calendar.map((event: any) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 transition-all hover:border-indigo-500/20"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                <Video className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-foreground truncate block leading-tight">
                  {event.title}
                </span>
                <div className="flex items-center space-x-1 text-[10px] text-muted-foreground mt-1.5 font-medium font-mono">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
