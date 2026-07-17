"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Flame, CheckCircle2, Circle, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"

export function HabitsWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const habits = apiRes?.data?.habits || []

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
            <Award className="h-4.5 w-4.5 text-violet-500" />
            Habit Tracker
          </CardTitle>
          <span className="text-2xs font-bold text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-lg dark:bg-muted/10">
            Streaks
          </span>
        </div>
        <CardDescription className="text-xs">
          Daily rituals to build a better life.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {habits.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <Flame className="h-8 w-8 text-orange-500/70" />
            <p className="text-xs font-semibold text-foreground">Build a routine</p>
            <p className="text-2xs text-muted-foreground">Add habits in the productivity drawer.</p>
          </div>
        ) : (
          habits.map((habit: any) => (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 transition-all ${
                habit.completed ? "opacity-75" : "hover:border-violet-500/20"
              }`}
            >
              <div className="flex items-center space-x-3">
                <button className="text-muted-foreground hover:text-violet-500 transition">
                  {habit.completed ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-violet-500" />
                  ) : (
                    <Circle className="h-4.5 w-4.5" />
                  )}
                </button>
                <span className={`text-xs font-medium ${habit.completed ? "text-muted-foreground" : "text-foreground"}`}>
                  {habit.name}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-2xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg shrink-0">
                <Flame className="h-3.5 w-3.5 fill-orange-500" />
                <span>{habit.streak}d</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
