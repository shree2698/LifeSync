"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { ShoppingCart, CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"

export function ShoppingWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const shopping = apiRes?.data?.shopping || []

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
            <ShoppingCart className="h-4.5 w-4.5 text-indigo-500" />
            Shopping List
          </CardTitle>
          <span className="text-2xs font-bold text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-lg dark:bg-muted/10">
            {shopping.filter((s: any) => s.completed).length}/{shopping.length} Got
          </span>
        </div>
        <CardDescription className="text-xs">
          Essential grocery items to pick up.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {shopping.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <ShoppingCart className="h-8 w-8 text-indigo-500/70" />
            <p className="text-xs font-semibold text-foreground">List is empty</p>
            <p className="text-2xs text-muted-foreground">Add items in the shopping tab.</p>
          </div>
        ) : (
          shopping.map((item: any) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 transition-all ${
                item.completed ? "opacity-60" : "hover:border-indigo-500/20"
              }`}
            >
              <button className="text-muted-foreground hover:text-indigo-500 transition">
                {item.completed ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500" />
                ) : (
                  <Circle className="h-4.5 w-4.5" />
                )}
              </button>
              <span className={`text-xs font-medium ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {item.name}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
