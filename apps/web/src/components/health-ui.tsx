"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

// ==========================================
// 1. STAT BADGE
// ==========================================
interface StatBadgeProps {
  label: string
  variant?: "blue" | "rose" | "orange" | "emerald" | "violet" | "pink" | "muted"
  className?: string
}

export function StatBadge({ label, variant = "muted", className }: StatBadgeProps) {
  const styles = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    pink: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    muted: "bg-muted text-muted-foreground border-border/40",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border font-sans tracking-wide uppercase select-none",
        styles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}

// ==========================================
// 2. PROGRESS RING
// ==========================================
interface ProgressRingProps {
  value: number
  target: number
  size?: number
  strokeWidth?: number
  variant?: "blue" | "rose" | "orange" | "emerald" | "pink"
  className?: string
}

export function ProgressRing({
  value,
  target,
  size = 64,
  strokeWidth = 6,
  variant = "blue",
  className,
}: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, (value / (target || 1)) * 100))
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const strokeDashoffset = circ - (pct / 100) * circ

  const colors = {
    blue: ["#3B82F6", "rgba(59, 130, 246, 0.1)"],
    rose: ["#F43F5E", "rgba(244, 63, 94, 0.1)"],
    orange: ["#F97316", "rgba(249, 115, 22, 0.1)"],
    emerald: ["#10B981", "rgba(16, 185, 129, 0.1)"],
    pink: ["#EC4899", "rgba(236, 72, 153, 0.1)"],
  }

  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke={colors[variant][1]}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={colors[variant][0]}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold font-mono text-foreground">
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  )
}

// ==========================================
// 3. PROGRESS BAR
// ==========================================
interface ProgressBarProps {
  value: number
  target: number
  variant?: "blue" | "rose" | "orange" | "emerald" | "pink" | "violet"
  className?: string
}

export function ProgressBar({ value, target, variant = "blue", className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / (target || 1)) * 100))

  const colors = {
    blue: "bg-blue-500 shadow-blue-500/20",
    rose: "bg-rose-500 shadow-rose-500/20",
    orange: "bg-orange-500 shadow-orange-500/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20",
    pink: "bg-pink-500 shadow-pink-500/20",
    violet: "bg-violet-500 shadow-violet-500/20",
  }

  return (
    <div className={cn("w-full bg-muted/60 dark:bg-muted/10 h-2.5 rounded-full overflow-hidden border border-border/10", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-sm", colors[variant])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ==========================================
// 4. HEALTH CARD
// ==========================================
interface HealthCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  accentColor?: "blue" | "rose" | "orange" | "emerald" | "violet" | "pink"
  className?: string
}

export function HealthCard({
  title,
  subtitle,
  action,
  children,
  accentColor = "blue",
  className,
}: HealthCardProps) {
  const borderColors = {
    blue: "hover:border-blue-500/30",
    rose: "hover:border-rose-500/30",
    orange: "hover:border-orange-500/30",
    emerald: "hover:border-emerald-500/30",
    violet: "hover:border-violet-500/30",
    pink: "hover:border-pink-500/30",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col transition-all duration-300 hover:shadow-md hover:bg-card/80",
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
// 5. METRIC CARD
// ==========================================
interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  progress?: { value: number; target: number }
  variant?: "blue" | "rose" | "orange" | "emerald" | "pink" | "violet"
  className?: string
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  progress,
  variant = "blue",
  className,
}: MetricCardProps) {
  const glowStyles = {
    blue: "hover:border-blue-500/30 hover:bg-blue-500/[0.01]",
    rose: "hover:border-rose-500/30 hover:bg-rose-500/[0.01]",
    orange: "hover:border-orange-500/30 hover:bg-orange-500/[0.01]",
    emerald: "hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]",
    pink: "hover:border-pink-500/30 hover:bg-pink-500/[0.01]",
    violet: "hover:border-violet-500/30 hover:bg-violet-500/[0.01]",
  }

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
          {value} <span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>
        </p>
        {progress && (
          <div className="mt-3">
            <ProgressBar value={progress.value} target={progress.target} variant={variant} />
            <div className="flex justify-between items-center mt-1 text-[9px] text-muted-foreground font-mono">
              <span>Progress</span>
              <span>{Math.round((progress.value / (progress.target || 1)) * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 6. TIMELINE
// ==========================================
interface TimelineItem {
  id: string
  title: string
  subtitle: string
  time: string
  details?: string | null
}

interface TimelineProps {
  items: TimelineItem[]
  emptyText?: string
  className?: string
}

export function Timeline({ items, emptyText = "No history recorded yet.", className }: TimelineProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center select-none border border-dashed border-border/60 rounded-xl bg-muted/5">
        <p className="text-xs text-muted-foreground font-sans">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60", className)}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <div className="absolute -left-[18px] top-1 h-2.5 w-2.5 rounded-full border border-card bg-indigo-500 group-hover:scale-125 transition-transform" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 select-none">
            <div>
              <p className="text-xs font-bold text-foreground">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{item.subtitle}</p>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground bg-muted/60 dark:bg-muted/10 px-2 py-0.5 rounded-md border border-border/20 self-start md:self-auto">
              {item.time}
            </span>
          </div>
          {item.details && (
            <p className="text-[10px] text-muted-foreground mt-1.5 bg-muted/20 dark:bg-muted/5 border border-border/20 p-2 rounded-lg font-sans">
              {item.details}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 7. HISTORY TABLE
// ==========================================
interface HistoryTableProps {
  headers: string[]
  rows: Array<Array<React.ReactNode>>
  emptyText?: string
  className?: string
}

export function HistoryTable({ headers, rows, emptyText = "No records found.", className }: HistoryTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center select-none border border-dashed border-border/60 rounded-xl bg-muted/5">
        <p className="text-xs text-muted-foreground font-sans">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto border border-border/40 dark:border-border/10 rounded-xl select-none", className)}>
      <table className="min-w-full divide-y divide-border/40 dark:divide-border/10 font-sans">
        <thead className="bg-muted/40 dark:bg-muted/5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40 dark:divide-border/10 text-xs bg-card/10">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-muted/5 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2.5 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ==========================================
// 8. HEALTH CHART
// ==========================================
interface HealthChartProps {
  data: number[]
  labels: string[]
  height?: number
  variant?: "blue" | "rose" | "orange" | "emerald" | "pink" | "violet"
  className?: string
}

export function HealthChart({ data, labels, height = 120, variant = "blue", className }: HealthChartProps) {
  const max = Math.max(...data, 1)
  const colors = {
    blue: "fill-blue-500/20 stroke-blue-500",
    rose: "fill-rose-500/20 stroke-rose-500",
    orange: "fill-orange-500/20 stroke-orange-500",
    emerald: "fill-emerald-500/20 stroke-emerald-500",
    pink: "fill-pink-500/20 stroke-pink-500",
    violet: "fill-violet-500/20 stroke-violet-500",
  }

  // Draw pure SVG Area Chart! Extremely premium, responsive, accessible, zero external dependency.
  const chartWidth = 500
  const chartHeight = height
  const paddingLeft = 35
  const paddingRight = 15
  const paddingTop = 15
  const paddingBottom = 20

  const widthScale = (chartWidth - paddingLeft - paddingRight) / (data.length - 1 || 1)
  const heightScale = (chartHeight - paddingTop - paddingBottom) / max

  const points = data.map((val, idx) => {
    const x = paddingLeft + idx * widthScale
    const y = chartHeight - paddingBottom - val * heightScale
    return { x, y }
  })

  const pathD = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`
  }, "")

  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
    : ""

  return (
    <div className={cn("w-full bg-card/20 rounded-xl border border-border/40 p-3 select-none flex flex-col justify-between", className)}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
        {/* Y Axis Gridlines */}
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
                {val}
              </text>
            </g>
          )
        })}

        {/* The Filled Area */}
        {areaD && <path d={areaD} className={cn("transition-all duration-500 ease-out", colors[variant].split(" ")[0])} />}

        {/* The Stroke Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            strokeWidth={2}
            className={cn("transition-all duration-500 ease-out", colors[variant].split(" ")[1])}
          />
        )}

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              className={cn("fill-card stroke-2", colors[variant].split(" ")[1].replace("stroke-", "stroke-"))}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={7}
              className={cn("fill-transparent opacity-0 group-hover:opacity-20", colors[variant].split(" ")[1].replace("stroke-", "fill-"))}
            />
          </g>
        ))}

        {/* X Labels */}
        {labels.map((lbl, idx) => {
          const x = paddingLeft + idx * widthScale
          return (
            <text
              key={idx}
              x={x}
              y={chartHeight - 4}
              className="text-[8px] font-mono fill-muted-foreground"
              textAnchor="middle"
            >
              {lbl}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ==========================================
// 9. ROUTINE CHECKLIST
// ==========================================
interface RoutineItem {
  id: string
  label: string
  done: boolean
}

interface RoutineChecklistProps {
  items: RoutineItem[]
  onToggle: (id: string) => void
  variant?: "pink" | "blue" | "emerald" | "violet"
  className?: string
}

export function RoutineChecklist({ items, onToggle, variant = "pink", className }: RoutineChecklistProps) {
  const styles = {
    pink: "border-pink-500/20 hover:border-pink-500/40 text-pink-500 bg-pink-500/10",
    blue: "border-blue-500/20 hover:border-blue-500/40 text-blue-500 bg-blue-500/10",
    emerald: "border-emerald-500/20 hover:border-emerald-500/40 text-emerald-500 bg-emerald-500/10",
    violet: "border-violet-500/20 hover:border-violet-500/40 text-violet-500 bg-violet-500/10",
  }

  return (
    <div className={cn("space-y-2 select-none", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onToggle(item.id)}
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-all",
            item.done && "opacity-75"
          )}
        >
          <div
            className={cn(
              "h-5 w-5 rounded-md border border-border/60 flex items-center justify-center transition-all",
              item.done && styles[variant]
            )}
          >
            {item.done && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
          </div>
          <span className={cn("text-xs font-semibold font-sans", item.done && "line-through text-muted-foreground")}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 10. CALENDAR PICKER
// ==========================================
interface CalendarPickerProps {
  value: string
  onChange: (val: string) => void
  className?: string
}

export function CalendarPicker({ value, onChange, className }: CalendarPickerProps) {
  const today = new Date()
  const dates = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(today.getDate() - 6 + i)
    return d
  })

  return (
    <div className={cn("flex justify-between items-center gap-1 bg-muted/10 border border-border/40 p-1.5 rounded-xl select-none", className)}>
      {dates.map((date, idx) => {
        const isSelected = date.toISOString().split("T")[0] === value.split("T")[0]
        const labelDay = date.toLocaleDateString("en-US", { weekday: "narrow" })
        const labelNum = date.getDate()
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(date.toISOString())}
            className={cn(
              "flex-1 flex flex-col items-center py-1.5 rounded-lg border border-transparent transition-all",
              isSelected
                ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-[8px] uppercase tracking-wider opacity-85 font-semibold">{labelDay}</span>
            <span className="text-xs font-mono mt-0.5">{labelNum}</span>
          </button>
        )
      })}
    </div>
  )
}
