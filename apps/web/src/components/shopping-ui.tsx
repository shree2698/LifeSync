"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Clock, AlertTriangle, Sparkles, Star, Plus, Minus, Heart, Trash2 } from "lucide-react"

// ==========================================
// 1. PRICE DISPLAY & CATEGORY BADGE
// ==========================================
interface PriceDisplayProps {
  amount: number
  currency?: string
  className?: string
  colored?: boolean
}

export function PriceDisplay({ amount, currency = "USD", className, colored = false }: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)

  return (
    <span className={cn("font-mono text-sm font-semibold tracking-tight", colored ? "text-indigo-500" : "text-foreground", className)}>
      {formatted}
    </span>
  )
}

interface CategoryBadgeProps {
  name: string
  color?: string | null
  className?: string
}

export function CategoryBadge({ name, color, className }: CategoryBadgeProps) {
  const defaultColor = "#10B981" // emerald default
  const hexColor = color || defaultColor

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider select-none",
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
// 2. SHOPPING CARD (CONTAINER)
// ==========================================
interface ShoppingCardProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  accentColor?: "emerald" | "blue" | "rose" | "orange" | "violet" | "pink" | "muted"
  className?: string
}

export function ShoppingCard({
  title,
  subtitle,
  action,
  children,
  accentColor = "emerald",
  className,
}: ShoppingCardProps) {
  const hoverBorders = {
    emerald: "hover:border-emerald-500/30",
    blue: "hover:border-blue-500/30",
    rose: "hover:border-rose-500/30",
    orange: "hover:border-orange-500/30",
    violet: "hover:border-violet-500/30",
    pink: "hover:border-pink-500/30",
    muted: "hover:border-border/60",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md p-5 flex flex-col transition-all duration-300 hover:shadow-md hover:bg-card/85",
        hoverBorders[accentColor],
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
// 3. STATISTIC CARD
// ==========================================
interface StatisticCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  variant?: "emerald" | "blue" | "orange" | "rose" | "violet"
  className?: string
}

export function StatisticCard({
  title,
  value,
  subtitle,
  icon,
  variant = "emerald",
  className,
}: StatisticCardProps) {
  const hoverStyles = {
    emerald: "hover:border-emerald-500/30 hover:bg-emerald-500/[0.01]",
    blue: "hover:border-blue-500/30 hover:bg-blue-500/[0.01]",
    orange: "hover:border-orange-500/30 hover:bg-orange-500/[0.01]",
    rose: "hover:border-rose-500/30 hover:bg-rose-500/[0.01]",
    violet: "hover:border-violet-500/30 hover:bg-violet-500/[0.01]",
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-muted/10 p-4 flex flex-col justify-between transition-all duration-300 select-none",
        hoverStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">{title}</span>
        <div className="p-1.5 rounded-lg bg-card border border-border/40 shadow-sm">{icon}</div>
      </div>
      <div>
        <p className="text-xl font-bold font-mono text-foreground leading-none">{value}</p>
        {subtitle && <p className="text-[9px] text-muted-foreground mt-1.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ==========================================
// 4. PROGRESS CARD
// ==========================================
interface ProgressCardProps {
  title: string
  completed: number
  total: number
  subtitle?: string
  className?: string
}

export function ProgressCard({ title, completed, total, subtitle, className }: ProgressCardProps) {
  const pct = Math.min(100, Math.max(0, (completed / (total || 1)) * 100))

  return (
    <div className={cn("p-4 rounded-xl border border-border/40 bg-muted/10 space-y-3 select-none", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-foreground">{title}</p>
          {subtitle && <p className="text-[9px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold font-mono">
            {completed}/{total}
          </p>
          <p className="text-[9px] text-emerald-500 font-bold mt-0.5">{pct.toFixed(0)}% Done</p>
        </div>
      </div>
      <div className="w-full bg-muted/60 dark:bg-muted/10 h-2 rounded-full overflow-hidden border border-border/10">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-emerald-500 shadow-emerald-500/20"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ==========================================
// 5. SHOPPING ITEM CARD
// ==========================================
interface ShoppingItemCardProps {
  name: string
  quantity: number
  unit: string
  price: number
  isCompleted: boolean
  isFavorite?: boolean
  notes?: string | null
  categoryName?: string
  categoryColor?: string | null
  onToggleComplete?: () => void
  onToggleFavorite?: () => void
  onDelete?: () => void
  className?: string
}

export function ShoppingItemCard({
  name,
  quantity,
  unit,
  price,
  isCompleted,
  isFavorite = false,
  notes,
  categoryName,
  categoryColor,
  onToggleComplete,
  onToggleFavorite,
  onDelete,
  className,
}: ShoppingItemCardProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-card border border-border/30 p-3 rounded-xl hover:border-emerald-500/25 hover:bg-muted/5 transition-all select-none",
        isCompleted && "opacity-60",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onToggleComplete && (
          <button
            onClick={onToggleComplete}
            className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
              isCompleted
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-border/60 hover:border-emerald-500/50 hover:bg-emerald-500/5"
            )}
          >
            {isCompleted && <Check className="h-3 w-3" />}
          </button>
        )}

        <div>
          <p className={cn("text-xs font-bold text-foreground leading-snug", isCompleted && "line-through")}>
            {name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-muted-foreground font-mono">
              Qty: {quantity} {unit}
            </span>
            {categoryName && (
              <>
                <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
                <CategoryBadge name={categoryName} color={categoryColor} />
              </>
            )}
            {notes && (
              <>
                <span className="h-1 w-1 bg-muted-foreground/40 rounded-full" />
                <span className="text-[9px] text-muted-foreground max-w-[120px] truncate italic">"{notes}"</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {price > 0 && <PriceDisplay amount={price * quantity} />}
        
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={cn("p-1 transition-colors cursor-pointer", isFavorite ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500")}
          >
            <Star className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 6. PANTRY CARD
// ==========================================
interface PantryCardProps {
  name: string
  currentQuantity: number
  minimumQuantity: number
  expiryDate?: string | null
  categoryName?: string
  categoryColor?: string | null
  onQuantityChange?: (quantity: number) => void
  className?: string
}

export function PantryCard({
  name,
  currentQuantity,
  minimumQuantity,
  expiryDate,
  categoryName,
  categoryColor,
  onQuantityChange,
  className,
}: PantryCardProps) {
  const isLow = currentQuantity <= minimumQuantity
  const daysToExpiry = expiryDate ? Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (24 * 3600000)) : null

  return (
    <div
      className={cn(
        "p-3 rounded-xl border border-border/30 bg-card hover:bg-muted/5 transition-all select-none space-y-3",
        isLow && "border-rose-500/20 bg-rose-500/[0.01]"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-foreground">{name}</p>
            {isLow && (
              <span className="text-[8px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.2 rounded font-bold animate-pulse uppercase">
                Low Stock
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {categoryName && <CategoryBadge name={categoryName} color={categoryColor} />}
            {daysToExpiry !== null && (
              <span className={cn("text-[9px] font-mono", daysToExpiry <= 7 ? "text-rose-500 font-bold" : "text-muted-foreground")}>
                {daysToExpiry <= 0 ? "Expired" : daysToExpiry <= 7 ? `Expires in ${daysToExpiry}d` : `Expires: ${new Date(expiryDate!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              </span>
            )}
          </div>
        </div>

        <div className="text-right select-none">
          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Stock level</p>
          <p className="text-xs font-bold font-mono mt-0.5">
            {currentQuantity} <span className="text-[10px] text-muted-foreground font-normal">/ Min {minimumQuantity}</span>
          </p>
        </div>
      </div>

      {onQuantityChange && (
        <div className="flex items-center justify-between pt-1 border-t border-border/10">
          <span className="text-[9px] text-muted-foreground">Adjust Inventory Quantity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(0, currentQuantity - 0.5))}
              className="p-1 rounded bg-muted/60 border border-border/20 hover:bg-muted text-foreground cursor-pointer"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-mono font-bold min-w-[24px] text-center">{currentQuantity}</span>
            <button
              onClick={() => onQuantityChange(currentQuantity + 0.5)}
              className="p-1 rounded bg-muted/60 border border-border/20 hover:bg-muted text-foreground cursor-pointer"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 7. WISHLIST CARD
// ==========================================
interface WishlistCardProps {
  name: string
  desiredPrice: number
  priority: string
  notes?: string | null
  isPurchased: boolean
  categoryName?: string
  categoryColor?: string | null
  onTogglePurchased?: () => void
  className?: string
}

export function WishlistCard({
  name,
  desiredPrice,
  priority,
  notes,
  isPurchased,
  categoryName,
  categoryColor,
  onTogglePurchased,
  className,
}: WishlistCardProps) {
  const priorityColors = {
    HIGH: "bg-rose-500/10 text-rose-500 border-rose-500/25",
    MEDIUM: "bg-orange-500/10 text-orange-500 border-orange-500/25",
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/25",
  } as Record<string, string>

  return (
    <div
      className={cn(
        "flex justify-between items-center bg-card border border-border/30 p-3 rounded-xl hover:border-violet-500/20 hover:bg-muted/5 transition-all select-none",
        isPurchased && "opacity-60",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onTogglePurchased && (
          <button
            onClick={onTogglePurchased}
            className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
              isPurchased
                ? "bg-violet-500 border-violet-500 text-white"
                : "border-border/60 hover:border-violet-500/50 hover:bg-violet-500/5"
            )}
          >
            {isPurchased && <Check className="h-3 w-3" />}
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <p className={cn("text-xs font-bold text-foreground leading-snug", isPurchased && "line-through")}>
              {name}
            </p>
            <span className={cn("text-[8px] border px-1.5 py-0.2 rounded font-bold uppercase", priorityColors[priority] || priorityColors.MEDIUM)}>
              {priority}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {categoryName && <CategoryBadge name={categoryName} color={categoryColor} />}
            {notes && (
              <span className="text-[9px] text-muted-foreground italic truncate max-w-[150px]">
                "{notes}"
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <PriceDisplay amount={desiredPrice} colored />
      </div>
    </div>
  )
}

// ==========================================
// 8. MONTHLY ESSENTIAL ITEM
// ==========================================
interface EssentialItemProps {
  name: string
  targetQuantity: number
  unit: string
  estimatedPrice: number
  isCompleted: boolean
  categoryName?: string
  categoryColor?: string | null
  onToggle?: () => void
  className?: string
}

export function EssentialItem({
  name,
  targetQuantity,
  unit,
  estimatedPrice,
  isCompleted,
  categoryName,
  categoryColor,
  onToggle,
  className,
}: EssentialItemProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-card border border-border/30 p-3 rounded-xl hover:border-orange-500/20 hover:bg-muted/5 transition-all select-none",
        isCompleted && "opacity-60",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onToggle && (
          <button
            onClick={onToggle}
            className={cn(
              "h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer",
              isCompleted
                ? "bg-orange-500 border-orange-500 text-white"
                : "border-border/60 hover:border-orange-500/50 hover:bg-orange-500/5"
            )}
          >
            {isCompleted && <Check className="h-3 w-3" />}
          </button>
        )}

        <div>
          <p className={cn("text-xs font-bold text-foreground leading-snug", isCompleted && "line-through")}>
            {name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-muted-foreground font-mono">
              Target: {targetQuantity} {unit}
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
        <PriceDisplay amount={estimatedPrice} />
      </div>
    </div>
  )
}

// ==========================================
// 9. CHARTS (CASH SPENT TREND)
// ==========================================
interface CostTrendChartProps {
  data: { month: string; estimated: number; actual: number }[]
  height?: number
  className?: string
}

export function CostTrendChart({ data, height = 150, className }: CostTrendChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.estimated, d.actual]), 1)

  const chartWidth = 500
  const chartHeight = height
  const paddingLeft = 40
  const paddingRight = 15
  const paddingTop = 15
  const paddingBottom = 20

  const widthScale = (chartWidth - paddingLeft - paddingRight) / (data.length - 1 || 1)
  const heightScale = (chartHeight - paddingTop - paddingBottom) / max

  const estPoints = data.map((d, i) => ({
    x: paddingLeft + i * widthScale,
    y: chartHeight - paddingBottom - d.estimated * heightScale,
  }))

  const actPoints = data.map((d, i) => ({
    x: paddingLeft + i * widthScale,
    y: chartHeight - paddingBottom - d.actual * heightScale,
  }))

  const estPath = estPoints.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "")
  const actPath = actPoints.reduce((acc, p, i) => acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "")

  return (
    <div className={cn("w-full bg-card/20 rounded-xl border border-border/40 p-3 select-none flex flex-col justify-between", className)}>
      <div className="flex gap-4 mb-2 justify-end text-[9px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground">Estimated Cost</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Actual spent</span>
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

        {/* Estimated Line */}
        {estPath && (
          <path
            d={estPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            className="text-muted-foreground/55 transition-all duration-500"
          />
        )}

        {/* Actual Line */}
        {actPath && (
          <path
            d={actPath}
            fill="none"
            stroke="#10B981"
            strokeWidth={2.5}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Dots */}
        {data.map((_, i) => (
          <g key={i}>
            <circle cx={estPoints[i].x} cy={estPoints[i].y} r={2.5} className="fill-card stroke-muted-foreground/50 stroke-1" />
            <circle cx={actPoints[i].x} cy={actPoints[i].y} r={3} className="fill-card stroke-emerald-500 stroke-2" />
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
