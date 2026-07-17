"use client"

import * as React from "react"
import Link from "next/link"
import { Activity, Droplet, Moon, Flame, Heart, Pill, Smile } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealthStore } from "@lifesync/hooks"

export function HealthWidget() {
  const { dashboardData, fetchDashboard, isLoading } = useHealthStore()

  React.useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (isLoading || !dashboardData) {
    return (
      <Card className="h-full flex flex-col border border-border/40 bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 mt-1.5 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 flex-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-muted/60 animate-pulse rounded-xl" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const {
    todayWater,
    waterGoal,
    todaySleep,
    sleepGoal,
    workoutProgress,
    workoutGoal,
    medicationStatus,
    cycleStatus,
    todayMood,
  } = dashboardData

  return (
    <Card className="h-full flex flex-col border border-border/40 bg-card/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 select-none overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
            Health & Vitality
          </CardTitle>
          <Link
            href="/health"
            className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            Open Health Hub →
          </Link>
        </div>
        <CardDescription className="text-xs">
          Daily metrics, medication, cycles, and lifestyle tracking.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Water */}
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between hover:border-blue-500/20 hover:bg-blue-500/[0.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Water</span>
            <Droplet className="h-4 w-4 text-blue-500 fill-blue-500/20" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {todayWater} ml
            </p>
            <p className="text-[9px] text-muted-foreground font-mono mt-1 leading-none">
              Goal: {waterGoal} ml
            </p>
          </div>
        </div>

        {/* Sleep */}
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between hover:border-indigo-500/20 hover:bg-indigo-500/[0.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Sleep</span>
            <Moon className="h-4 w-4 text-indigo-500 fill-indigo-500/20" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {todaySleep ? `${todaySleep.duration.toFixed(1)}h` : "No log"}
            </p>
            <p className="text-[9px] text-muted-foreground font-mono mt-1 leading-none">
              Goal: {sleepGoal}h
            </p>
          </div>
        </div>

        {/* Workout */}
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between hover:border-orange-500/20 hover:bg-orange-500/[0.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Workout</span>
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500/20" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {workoutProgress}m
            </p>
            <p className="text-[9px] text-muted-foreground font-mono mt-1 leading-none">
              Goal: {workoutGoal}m
            </p>
          </div>
        </div>

        {/* Mood */}
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Mood</span>
            <Smile className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold text-foreground leading-none">
              {todayMood ? todayMood.mood : "Not logged"}
            </p>
            <p className="text-[9px] text-muted-foreground font-mono mt-1 leading-none">
              {todayMood ? `Energy: ${todayMood.energyLevel}/5` : "Log mood"}
            </p>
          </div>
        </div>

        {/* Cycle */}
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between hover:border-pink-500/20 hover:bg-pink-500/[0.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Cycle</span>
            <Heart className="h-4 w-4 text-pink-500 fill-pink-500/20" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold text-foreground leading-none">
              {cycleStatus.isPeriodToday ? "Period Day" : cycleStatus.phase || "No cycle"}
            </p>
            <p className="text-[9px] text-muted-foreground font-mono mt-1 leading-none font-bold">
              {cycleStatus.daysUntilPeriod !== null ? `${cycleStatus.daysUntilPeriod}d left` : "Track cycle"}
            </p>
          </div>
        </div>

        {/* Medication */}
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between hover:border-violet-500/20 hover:bg-violet-500/[0.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Meds</span>
            <Pill className="h-4 w-4 text-violet-500 fill-violet-500/20" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-bold font-mono text-foreground leading-none">
              {medicationStatus.taken} / {medicationStatus.total}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 leading-none">
              taken today
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
