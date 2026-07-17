"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Clock, AlertTriangle, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from "lucide-react"

// ==========================================
// 1. CURRENCY FORMATTER & AMOUNT DISPLAY
// ==========================================
interface AmountDisplayProps {
  amount: number
  type?: "INCOME" | "EXPENSE" | "TRANSFER" | "NEUTRAL"
  currency?: string
  className?: string
  colored?: boolean
}

export function AmountDisplay({
  amount,
  type = "NEUTRAL",
  currency = "USD",
  className,
  colored = true,
}: AmountDisplayProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Math.abs(amount))

  const sign = type === "INCOME" ? "+" : type === "EXPENSE" ? "-" : ""

  const colorStyle = colored
    ? type === "INCOME"
      ? "text-emerald-500 font-bold"
      : type === "EXPENSE"
      ? "text-rose-500 font-bold"
      : "text-foreground font-bold"
    : "text-foreground"

  return (
    <span className={cn("font-mono text-sm tracking-tight", colorStyle, className)}>
      {sign}
      {formatted}
    </span>
  )
}

// ==========================================
// 2. CATEGORY BADGE
// ==========================================
interface CategoryBadgeProps {
  name: string
  color?: string | null
  className?: string
}

export function CategoryBadge({ name, color, className }: CategoryBadgeProps) {
  const defaultColor = "#6B7280" // neutral gray
  const hexColor = color || defaultColor

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border font-sans tracking-wide uppercase select-none",
        className
      )}
      style={{
        backgroundColor: `${hexColor}15`,
        color: hexColor,
        borderColor: `${hexColor}30`,
      }}
    >
      {name}
    </span>
  )
}

// ==========================================
// 3. FINANCE CARD
// ==========================================
interface FinanceCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  accentColor?: "blue" | "rose" | "orange" | "emerald" | "violet" | "pink" | "muted"
  className?: string
}

export function FinanceCard({
  title,
  subtitle,
  action,
  children,
  accentColor = "blue",
  className,
}: FinanceCardProps) {
  const borderColors = {
    blue: "hover:border-blue-500/30",
    rose: "hover:border-rose-500/30",
    orange: "hover:border-orange-500/30",
    emerald: "hover:border-emerald-500/30",
    violet: "hover:border-violet-500/30",
    pink: "hover:border-pink-500/30",
    muted: "hover:border-border/60",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col transition-all duration-300 hover:shadow-md hover:bg-card/85",
        borderColors[accentColor],
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/40 dark:border-border/10 pb-3 mb-4 select-none">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}

// ==========================================
// 4. STATISTICS CARD
// ==========================================
interface StatisticsCardProps {
  title: string
  value: number
  currency?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  variant?: "blue" | "rose" | "orange" | "emerald" | "violet" | "pink"
  className?: string
}

export function StatisticsCard({
  title,
  value,
  currency = "USD",
  icon,
  trend,
  variant = "blue",
  className,
}: StatisticsCardProps) {
  const glowStyles = {
    blue: "hover:border-blue-500/30 hover:bg-blue-500/[0.01]",
    rose: "hover:border-rose-500/30 hover:bg-rose-500/[0.01]",
    orange: "hover:border-orange-500/30 hover:bg-orange-500/[0.01]",
    emerald: "hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]",
    pink: "hover:border-pink-500/30 hover:bg-pink-500/[0.01]",
    violet: "hover:border-violet-500/30 hover:bg-violet-500/[0.01]",
  }

  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value)

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-muted/10 p-4 flex flex-col justify-between transition-all duration-300",
        glowStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between mb-3 select-none">
        <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">{title}</span>
        <div className="p-1.5 rounded-lg bg-card border border-border/40 shadow-sm">{icon}</div>
      </div>
      <div>
        <p className="text-xl font-bold font-mono text-foreground leading-none">
          {formattedValue}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground">
            <span className={trend.value >= 0 ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 5. TRANSACTION CARD
// ==========================================
interface TransactionCardProps {
  description: string
  accountName: string
  categoryName: string
  categoryColor?: string | null
  amount: number
  type: "INCOME" | "EXPENSE" | "TRANSFER"
  date: string
  onDelete?: () => void
  className?: string
}

export function TransactionCard({
  description,
  accountName,
  categoryName,
  categoryColor,
  amount,
  type,
  date,
  onDelete,
  className,
}: TransactionCardProps) {
  const icon = type === "INCOME" ? (
    <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
  ) : type === "EXPENSE" ? (
    <ArrowUpRight className="h-4 w-4 text-rose-500" />
  ) : (
    <ArrowRightLeft className="h-4 w-4 text-blue-500" />
  )

  return (
    <div
      className={cn(
        "flex justify-between items-center bg-card border border-border/30 p-3 rounded-xl hover:border-indigo-500/20 hover:bg-muted/5 transition-all select-none",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted/60 dark:bg-muted/10 rounded-lg border border-border/20">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-foreground leading-snug">{description || "No description"}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-muted-foreground font-mono">{accountName}</span>
            <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
            <CategoryBadge name={categoryName} color={categoryColor} />
            <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
            <span className="text-[9px] text-muted-foreground font-mono">
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AmountDisplay amount={amount} type={type} colored />
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
          >
            <Clock className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 6. BUDGET CARD
// ==========================================
interface BudgetCardProps {
  name: string
  limitAmount: number
  spentAmount: number
  categoryName?: string
  categoryColor?: string | null
  className?: string
}

export function BudgetCard({
  name,
  limitAmount,
  spentAmount,
  categoryName,
  categoryColor,
  className,
}: BudgetCardProps) {
  const pct = Math.min(100, Math.max(0, (spentAmount / (limitAmount || 1)) * 100))
  const remaining = Math.max(0, limitAmount - spentAmount)
  const isOver = spentAmount > limitAmount

  return (
    <div className={cn("p-4 rounded-xl border border-border/40 bg-muted/10 space-y-3 select-none", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-foreground">{name}</p>
          {categoryName && (
            <div className="mt-1">
              <CategoryBadge name={categoryName} color={categoryColor} />
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold font-mono">
            {spentAmount.toFixed(0)} / {limitAmount.toFixed(0)} <span className="text-[10px] font-normal text-muted-foreground">USD</span>
          </p>
          <p className={cn("text-[9px] font-medium mt-0.5", isOver ? "text-rose-500" : "text-emerald-500")}>
            {isOver ? "Over budget" : `${remaining.toFixed(0)} remaining`}
          </p>
        </div>
      </div>

      <div className="w-full bg-muted/60 dark:bg-muted/10 h-2 rounded-full overflow-hidden border border-border/10">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            isOver
              ? "bg-rose-500 shadow-rose-500/20"
              : pct >= 85
              ? "bg-orange-500 shadow-orange-500/20"
              : "bg-emerald-500 shadow-emerald-500/20"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ==========================================
// 7. SAVINGS CARD
// ==========================================
interface SavingsCardProps {
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string | null
  onContribute?: (amount: number) => void
  className?: string
}

export function SavingsCard({
  name,
  targetAmount,
  currentAmount,
  deadline,
  onContribute,
  className,
}: SavingsCardProps) {
  const pct = Math.min(100, Math.max(0, (currentAmount / (targetAmount || 1)) * 100))
  const remaining = Math.max(0, targetAmount - currentAmount)
  const [contribution, setContribution] = React.useState("")

  return (
    <div className={cn("p-4 rounded-xl border border-border/40 bg-muted/10 space-y-3 select-none", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-foreground">{name}</p>
          {deadline && (
            <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-1 font-mono">
              <Clock className="h-2.5 w-2.5" /> Due {new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold font-mono">
            {currentAmount.toFixed(0)} / {targetAmount.toFixed(0)} <span className="text-[10px] font-normal text-muted-foreground">USD</span>
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            {pct.toFixed(0)}% reached • {remaining.toFixed(0)} left
          </p>
        </div>
      </div>

      <div className="w-full bg-muted/60 dark:bg-muted/10 h-2 rounded-full overflow-hidden border border-border/10">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-blue-500 shadow-blue-500/20"
          style={{ width: `${pct}%` }}
        />
      </div>

      {onContribute && (
        <div className="flex gap-2 pt-1.5">
          <input
            type="number"
            placeholder="Amount"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            className="flex-1 bg-card border border-border/40 rounded-lg text-[10px] px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              const amt = parseFloat(contribution)
              if (!isNaN(amt) && amt > 0) {
                onContribute(amt)
                setContribution("")
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg transition-all"
          >
            Contribute
          </button>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 8. BILL CARD
// ==========================================
interface BillCardProps {
  name: string
  amount: number
  dueDate: string
  status: "PAID" | "UNPAID" | "OVERDUE"
  onPay?: () => void
  className?: string
}

export function BillCard({
  name,
  amount,
  dueDate,
  status,
  onPay,
  className,
}: BillCardProps) {
  const isPaid = status === "PAID"
  const isOverdue = new Date(dueDate) < new Date() && !isPaid

  return (
    <div
      className={cn(
        "flex justify-between items-center bg-card border border-border/30 p-3 rounded-xl hover:border-indigo-500/20 hover:bg-muted/5 transition-all select-none",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg border", isPaid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : isOverdue ? "bg-rose-500/10 border-rose-500/20 text-rose-500 animate-pulse" : "bg-orange-500/10 border-orange-500/20 text-orange-500")}>
          {isPaid ? <Check className="h-4 w-4" /> : isOverdue ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
        </div>
        <div>
          <p className="text-xs font-bold text-foreground leading-snug">{name}</p>
          <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
            Due: {new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {isOverdue && <span className="text-rose-500 font-bold ml-1">OVERDUE</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-foreground">
          ${amount.toFixed(2)}
        </span>
        {onPay && !isPaid && (
          <button
            onClick={onPay}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 9. SUBSCRIPTION CARD
// ==========================================
interface SubscriptionCardProps {
  name: string
  amount: number
  billingCycle: string
  renewalDate: string
  categoryName?: string
  categoryColor?: string | null
  className?: string
}

export function SubscriptionCard({
  name,
  amount,
  billingCycle,
  renewalDate,
  categoryName,
  categoryColor,
  className,
}: SubscriptionCardProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-card border border-border/30 p-3 rounded-xl hover:border-pink-500/20 hover:bg-muted/5 transition-all select-none",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs font-bold text-foreground leading-snug">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-muted-foreground font-mono">
              Renews: {new Date(renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
            <span className="text-[8px] bg-pink-500/10 text-pink-500 px-1.5 py-0.2 rounded font-bold uppercase font-mono">
              {billingCycle}
            </span>
            {categoryName && (
              <>
                <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
                <CategoryBadge name={categoryName} color={categoryColor} />
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <span className="font-mono text-xs font-bold text-foreground">
          ${amount.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

// ==========================================
// 10. CASH FLOW CHART
// ==========================================
interface CashFlowChartProps {
  data: { month: string; income: number; expense: number }[]
  height?: number
  className?: string
}

export function CashFlowChart({ data, height = 150, className }: CashFlowChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1)

  const chartWidth = 500
  const chartHeight = height
  const paddingLeft = 40
  const paddingRight = 15
  const paddingTop = 15
  const paddingBottom = 20

  const widthScale = (chartWidth - paddingLeft - paddingRight) / (data.length - 1 || 1)
  const heightScale = (chartHeight - paddingTop - paddingBottom) / max

  const incomePoints = data.map((d, i) => ({
    x: paddingLeft + i * widthScale,
    y: chartHeight - paddingBottom - d.income * heightScale,
  }))

  const expensePoints = data.map((d, i) => ({
    x: paddingLeft + i * widthScale,
    y: chartHeight - paddingBottom - d.expense * heightScale,
  }))

  const incomePath = incomePoints.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "")
  const expensePath = expensePoints.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "")

  return (
    <div className={cn("w-full bg-card/20 rounded-xl border border-border/40 p-3 select-none flex flex-col justify-between", className)}>
      <div className="flex gap-4 mb-2 justify-end text-[10px] font-bold select-none">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-muted-foreground">Expense</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
        {/* Gridlines */}
        {[0, 0.5, 1].map((scale, i) => {
          const val = Math.round(max * scale)
          const y = chartHeight - paddingBottom - val * heightScale
          return (
            <g key={i} className="opacity-40">
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="4 4"
                className="text-border/60"
              />
              <text x={paddingLeft - 5} y={y + 3} className="text-[8px] font-mono fill-muted-foreground text-right" textAnchor="end">
                ${val}
              </text>
            </g>
          )
        })}

        {/* Income Line */}
        {incomePath && (
          <path
            d={incomePath}
            fill="none"
            stroke="#10B981"
            strokeWidth={2.5}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Expense Line */}
        {expensePath && (
          <path
            d={expensePath}
            fill="none"
            stroke="#F43F5E"
            strokeWidth={2.5}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Data points */}
        {data.map((_, i) => (
          <g key={i}>
            <circle cx={incomePoints[i].x} cy={incomePoints[i].y} r={3} className="fill-card stroke-emerald-500 stroke-2" />
            <circle cx={expensePoints[i].x} cy={expensePoints[i].y} r={3} className="fill-card stroke-rose-500 stroke-2" />
          </g>
        ))}

        {/* X Labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={paddingLeft + i * widthScale}
            y={chartHeight - 4}
            className="text-[8px] font-mono fill-muted-foreground"
            textAnchor="middle"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  )
}
