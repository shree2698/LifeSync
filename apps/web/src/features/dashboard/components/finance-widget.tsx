"use client"

import * as React from "react"
import Link from "next/link"
import { Landmark, ArrowUpRight, ArrowDownRight, TrendingUp, Clock, PiggyBank } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@lifesync/hooks"

export function FinanceWidget() {
  const { dashboardData, fetchDashboard, isLoading } = useFinanceStore()

  React.useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (isLoading || !dashboardData) {
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
    currentBalance,
    monthlyExpenses,
    remainingBudget,
    savingsProgress,
    upcomingBills,
  } = dashboardData

  return (
    <Card className="h-full flex flex-col border border-border/40 bg-card/60 backdrop-blur-md hover:shadow-lg transition-all duration-300 select-none overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <Landmark className="h-4.5 w-4.5 text-emerald-500" />
            Financial Health
          </CardTitle>
          <Link
            href="/finance"
            className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            Open Finance Hub →
          </Link>
        </div>
        <CardDescription className="text-xs">
          Live wealth balance, budgets, and upcoming bills tracker.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-3">
        {/* Net Balance */}
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center hover:bg-emerald-500/[0.08] transition-all">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Net Wealth Balance</span>
          <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 leading-none">
            ${currentBalance.toFixed(2)}
          </span>
        </div>

        {/* Expenses & Budget Status */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Spent</span>
            <span className="text-xs font-bold font-mono text-rose-500 mt-1">
              ${monthlyExpenses.toFixed(0)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col justify-between">
            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Remaining Budget</span>
            <span className="text-xs font-bold font-mono text-foreground mt-1">
              ${remainingBudget.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Savings & Bills Progress */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Savings</p>
              <p className="text-xs font-bold font-mono text-blue-500 mt-0.5">{savingsProgress.toFixed(0)}%</p>
            </div>
            <PiggyBank className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />
          </div>

          <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Pending Bills</p>
              <p className="text-xs font-bold font-mono text-orange-500 mt-0.5">{upcomingBills.length} bills</p>
            </div>
            <Clock className="h-4.5 w-4.5 text-orange-500 fill-orange-500/10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
