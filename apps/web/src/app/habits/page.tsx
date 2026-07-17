"use client"

import * as React from "react"
import { Flame, Plus, Award, Calendar, ChevronRight, Check, Trash2, HelpCircle, Lightbulb } from "lucide-react"
import { useHabitStore, useAIPlanner } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Habit, HabitFrequency } from "@lifesync/types"

export default function HabitsPage() {
  const {
    habits,
    isLoading,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
  } = useHabitStore()

  const { generateDailySchedule, isLoading: isAiLoading } = useAIPlanner()

  // Form states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [frequency, setFrequency] = React.useState<HabitFrequency>("DAILY")
  const [reminderTime, setReminderTime] = React.useState("")
  const [category, setCategory] = React.useState("Personal")

  // AI suggestions state
  const [aiInsight, setAiInsight] = React.useState<any>(null)

  React.useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const handleOpenCreate = () => {
    setTitle("")
    setFrequency("DAILY")
    setReminderTime("")
    setCategory("Personal")
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const success = await createHabit({
      title,
      frequency,
      customFreq: null,
      reminderTime: reminderTime || null,
      category,
    })

    if (success) {
      setIsFormOpen(false)
    }
  }

  const handleTriggerAI = async () => {
    const res = await generateDailySchedule()
    setAiInsight(res)
  }

  // Get past 7 days array
  const last7Days = React.useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push({
        dateStr: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        dayNum: d.getDate(),
      })
    }
    return days
  }, [])

  return (
    <DashboardShell>
      <PageContainer>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 dark:border-border/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Habit Rituals</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Log daily rituals, maintain completion streaks, and review statistical trends.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleTriggerAI} variant="outline" className="rounded-xl border-indigo-500/20 hover:bg-indigo-500/5 text-indigo-500 font-semibold h-10 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" /> AI Suggestion
            </Button>
            <Button onClick={handleOpenCreate} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 h-10 shadow-md">
              <Plus className="h-4.5 w-4.5" /> Add Habit
            </Button>
          </div>
        </div>

        {/* AI Insight Box */}
        {aiInsight && (
          <Card className="border-indigo-600/30 bg-indigo-500/5 dark:bg-indigo-500/10/5 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-indigo-500 flex items-center gap-1.5">
                ✦ AI Co-Pilot Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-foreground leading-relaxed">
              <p>{aiInsight.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiInsight.timeBlocks.map((tb: any, i: number) => (
                  <div key={i} className="p-3 bg-card border border-border/60 rounded-xl dark:border-border/10">
                    <span className="font-mono text-2xs font-bold text-indigo-500 block">{tb.time}</span>
                    <span className="font-semibold block mt-1">{tb.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habits Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="h-40 animate-pulse" />
              <Card className="h-40 animate-pulse" />
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-2xl text-muted-foreground">
              No active habits found. Create a habit to begin tracking rituals.
            </div>
          ) : (
            habits.map((habit) => (
              <Card key={habit.id} className="hover:shadow transition duration-200">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left Side Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground">{habit.title}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-lg dark:bg-muted/10">
                        {habit.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Category: {habit.category} {habit.reminderTime ? `• Remind at ${habit.reminderTime}` : ""}
                    </p>
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-500 pt-1.5">
                      <Flame className="h-4 w-4 fill-orange-500" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>

                  {/* Right Side Logs Grid */}
                  <div className="flex items-center space-x-2 select-none">
                    {last7Days.map((day) => {
                      // Check if habit logs include this date
                      const isCompleted = habit.logs?.some((l) => l.completedAt === day.dateStr)
                      return (
                        <div key={day.dateStr} className="flex flex-col items-center">
                          <span className="text-[10px] text-muted-foreground font-bold font-mono tracking-wide uppercase mb-1">
                            {day.label}
                          </span>
                          <button
                            onClick={() => toggleHabit(habit.id, day.dateStr)}
                            className={`h-8.5 w-8.5 rounded-xl border flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-border/60 hover:border-orange-500 bg-background"
                            }`}
                            title={`Toggle completion for ${day.dateStr}`}
                          >
                            {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="text-2xs font-bold">{day.dayNum}</span>}
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end md:justify-center md:border-l border-border/20 md:pl-5">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-muted-foreground hover:text-destructive p-2 rounded-xl hover:bg-destructive/10 transition"
                      title="Delete Habit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* HABIT CREATE DRAWER */}
        {isFormOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-112 bg-card border-l border-border/60 dark:border-border/10 p-6 z-50 flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center border-b border-border/40 pb-4 dark:border-border/10">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Award className="h-5 w-5 text-indigo-500" />
                  New Habit
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-xl hover:bg-muted"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 pt-4 flex-1">
                {/* Title */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Habit Name</label>
                  <Input
                    placeholder="e.g. Write journal pages..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Frequency */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>

                {/* Category */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Study">Study</option>
                  </select>
                </div>

                {/* Reminder Time */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Reminder Time</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/40 dark:border-border/10 mt-auto">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl">
                    Create Habit
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </PageContainer>
    </DashboardShell>
  )
}
