"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart, AlertTriangle, Bookmark, ShieldAlert, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useShoppingStore } from "@lifesync/hooks"
import { cn } from "@/lib/utils"

export function ShoppingWidget() {
  const { shoppingDashboardData, fetchDashboard, isLoading } = useShoppingStore()

  React.useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (isLoading || !shoppingDashboardData) {
    return (
      <Card className="h-full flex flex-col border border-border/40 bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 mt-1.5 bg-muted/60 animate-pulse rounded" />
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="h-12 w-full bg-muted/60 animate-pulse rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 w-full bg-muted/60 animate-pulse rounded-xl" />
            <div className="h-10 w-full bg-muted/60 animate-pulse rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const {
    pendingItemsCount,
    lowStockItems,
    monthlyEssentialsCount,
    estimatedTotalCost,
  } = shoppingDashboardData

  return (
    <Card className="h-full flex flex-col border border-border/40 bg-card/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 select-none overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <ShoppingCart className="h-4.5 w-4.5 text-emerald-500" />
            Shopping Hub
          </CardTitle>
          <Link
            href="/shopping"
            className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            Open Hub →
          </Link>
        </div>
        <CardDescription className="text-xs">
          Your active pantry stock levels and grocery essentials status.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-3">
        {/* Estimated Cost */}
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center hover:bg-emerald-500/[0.08] transition-all">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Estimated Shopping Cost</span>
          <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 leading-none">
            ${estimatedTotalCost.toFixed(2)}
          </span>
        </div>

        {/* Counts summary grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Pending</span>
            <span className="text-xs font-bold font-mono text-foreground mt-1">
              {pendingItemsCount} items
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Low Stock</span>
            <span className={cn("text-xs font-bold font-mono mt-1", lowStockItems.length > 0 ? "text-orange-500" : "text-muted-foreground")}>
              {lowStockItems.length} items
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Essentials</span>
            <span className="text-xs font-bold font-mono text-foreground mt-1">
              {monthlyEssentialsCount} items
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
