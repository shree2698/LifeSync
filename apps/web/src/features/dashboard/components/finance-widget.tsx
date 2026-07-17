"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Landmark, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"
import { formatCurrency } from "@lifesync/utils"

export function FinanceWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const finance = apiRes?.data?.finance

  if (isLoading || !finance) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <Landmark className="h-4.5 w-4.5 text-emerald-500" />
            Financial Health
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <CardDescription className="text-xs">
          Your current monthly ledger summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Net Balance */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 dark:bg-emerald-500/10/5 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Net Savings</span>
          <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 leading-none">
            {formatCurrency(finance.balance)}
          </span>
        </div>

        {/* Cash Flow */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Income</p>
              <p className="text-xs font-bold font-mono text-foreground mt-1">{formatCurrency(finance.income)}</p>
            </div>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Expenses</p>
              <p className="text-xs font-bold font-mono text-rose-500 mt-1">{formatCurrency(finance.expenses)}</p>
            </div>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
