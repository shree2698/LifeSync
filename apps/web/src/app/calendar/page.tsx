"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ChevronLeft, ChevronRight, Video, CheckSquare, Sparkles } from "lucide-react"
import { useCalendarStore, useTaskStore } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarEvent } from "@lifesync/types"
import { formatTime } from "@lifesync/utils"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
  const {
    events,
    activeDate,
    calendarViewMode,
    isLoading,
    fetchEvents,
    createEvent,
    deleteEvent,
    setActiveDate,
    setCalendarViewMode,
  } = useCalendarStore()

  const { tasks, fetchTasks } = useTaskStore()

  // Form states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [startTime, setStartTime] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [endTime, setEndTime] = React.useState("")
  const [allDay, setAllDay] = React.useState(false)

  React.useEffect(() => {
    fetchEvents()
    fetchTasks()
  }, [fetchEvents, fetchTasks])

  const currentDateObj = new Date(activeDate)

  // Navigate months
  const handlePrevMonth = () => {
    const d = new Date(currentDateObj)
    d.setMonth(d.getMonth() - 1)
    setActiveDate(d.toISOString())
  }

  const handleNextMonth = () => {
    const d = new Date(currentDateObj)
    d.setMonth(d.getMonth() + 1)
    setActiveDate(d.toISOString())
  }

  const handleOpenCreate = () => {
    setTitle("")
    setDescription("")
    setStartDate(activeDate.split("T")[0])
    setStartTime("09:00")
    setEndDate(activeDate.split("T")[0])
    setEndTime("10:00")
    setAllDay(false)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const startISO = new Date(`${startDate}T${startTime}:00`).toISOString()
    const endISO = new Date(`${endDate}T${endTime}:00`).toISOString()

    const success = await createEvent({
      title,
      description: description || null,
      start: startISO,
      end: endISO,
      allDay,
      recurringRule: null,
    })

    if (success) {
      setIsFormOpen(false)
    }
  }

  // Calculate days in the current month's calendar sheet
  const monthDays = React.useMemo(() => {
    const year = currentDateObj.getFullYear()
    const month = currentDateObj.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay() // Week day index (0-6)
    const totalDays = new Date(year, month + 1, 0).getDate() // Total days in month
    const prevMonthTotalDays = new Date(year, month, 0).getDate()

    const days = []

    // 1. Previous month buffer days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNum: prevMonthTotalDays - i,
        dateStr: new Date(year, month - 1, prevMonthTotalDays - i).toISOString().split("T")[0],
        currentMonth: false,
      })
    }

    // 2. Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        dayNum: i,
        dateStr: new Date(year, month, i).toISOString().split("T")[0],
        currentMonth: true,
      })
    }

    // 3. Next month buffer days (pad to multiples of 7)
    const remaining = 35 - days.length
    const nextDays = remaining > 0 ? remaining : (42 - days.length)
    for (let i = 1; i <= nextDays; i++) {
      days.push({
        dayNum: i,
        dateStr: new Date(year, month + 1, i).toISOString().split("T")[0],
        currentMonth: false,
      })
    }

    return days
  }, [currentDateObj])

  // Get combined calendar items (Events + Tasks overlay)
  const getCalendarItemsForDate = (dateStr: string) => {
    const dateEvents = events.filter((e) => e.start.split("T")[0] === dateStr)
    const dateTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate.split("T")[0] === dateStr && t.status !== "COMPLETED"
    )

    return {
      events: dateEvents,
      tasks: dateTasks,
    }
  }

  return (
    <DashboardShell>
      <PageContainer>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 dark:border-border/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar & Timeline</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize calendar schedules and view task timelines in a single view.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/40 dark:bg-muted/10">
              <button
                onClick={() => setCalendarViewMode("month")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calendarViewMode === "month" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Month Grid
              </button>
              <button
                onClick={() => setCalendarViewMode("agenda")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${calendarViewMode === "agenda" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Agenda view
              </button>
            </div>
            <Button onClick={handleOpenCreate} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 h-10 shadow-md">
              <Plus className="h-4.5 w-4.5" /> Add Event
            </Button>
          </div>
        </div>

        {/* Calendar Nav */}
        <div className="flex items-center justify-between bg-card/60 dark:bg-card/10 p-4 rounded-2xl border border-border/40 dark:border-border/10 select-none">
          <h2 className="text-sm font-bold text-foreground">
            {currentDateObj.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center space-x-1">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setActiveDate(new Date().toISOString())} className="px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-muted-foreground transition">
              Today
            </button>
            <button onClick={handleNextMonth} className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 1. MONTH GRID VIEW */}
        {calendarViewMode === "month" && (
          <div className="border border-border/60 rounded-2xl overflow-hidden bg-card/25 dark:border-border/10">
            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 border-b border-border/60 dark:border-border/10 bg-muted/40 dark:bg-muted/10 text-center font-bold text-[10px] text-muted-foreground uppercase py-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 grid-rows-5 md:grid-rows-6 divide-x divide-y divide-border/60 dark:divide-border/10 border-t border-l border-border/60 dark:border-border/10">
              {monthDays.map((day, idx) => {
                const isToday = day.dateStr === new Date().toISOString().split("T")[0]
                const items = getCalendarItemsForDate(day.dateStr)

                return (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-[90px] md:min-h-[110px] p-2 flex flex-col justify-between transition-all",
                      day.currentMonth ? "bg-background" : "bg-muted/30 dark:bg-zinc-950/20"
                    )}
                  >
                    {/* Day number */}
                    <div className="flex justify-between items-center mb-1 select-none">
                      <span
                        className={cn(
                          "text-2xs font-bold rounded-lg h-5 w-5 flex items-center justify-center font-mono",
                          isToday
                            ? "bg-indigo-600 text-white shadow shadow-indigo-600/20"
                            : day.currentMonth
                            ? "text-foreground"
                            : "text-muted-foreground/60"
                        )}
                      >
                        {day.dayNum}
                      </span>
                    </div>

                    {/* Events & Tasks lists */}
                    <div className="flex-1 space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                      {/* Events */}
                      {items.events.map((e) => (
                        <div
                          key={e.id}
                          className="bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[10px] text-indigo-500 truncate font-semibold"
                          title={`${e.title} (${formatTime(e.start)})`}
                        >
                          {e.title}
                        </div>
                      ))}

                      {/* Tasks overlay */}
                      {items.tasks.map((t) => (
                        <div
                          key={t.id}
                          className="bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] text-emerald-500 truncate font-semibold"
                          title={`Task: ${t.title}`}
                        >
                          ✓ {t.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. AGENDA VIEW */}
        {calendarViewMode === "agenda" && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-2xl text-muted-foreground">
                No calendar events scheduled.
              </div>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="hover:shadow transition duration-200">
                  <CardContent className="p-4 flex items-start gap-3.5 justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-8.5 w-8.5 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                        <Video className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground block">{event.title}</span>
                        {event.description && <span className="text-xs text-muted-foreground block mt-0.5">{event.description}</span>}
                        <div className="flex items-center space-x-2 text-[10px] text-muted-foreground mt-2 font-medium font-mono">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {new Date(event.start).toLocaleDateString()} {formatTime(event.start)} - {formatTime(event.end)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition"
                      title="Delete Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* CREATE EVENT DRAWER */}
        {isFormOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-112 bg-card border-l border-border/60 dark:border-border/10 p-6 z-50 flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center border-b border-border/40 pb-4 dark:border-border/10">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <CalendarIcon className="h-5 w-5 text-indigo-500" />
                  New Schedule Event
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
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Event Title</label>
                  <Input
                    placeholder="e.g. Sync review meeting..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                  <textarea
                    placeholder="Agenda details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-xs shadow-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-indigo-500 min-h-20 text-foreground"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    />
                  </div>
                </div>

                {/* Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    />
                  </div>
                </div>

                {/* Options Switches */}
                <div className="flex gap-6 items-center select-none pt-2">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allDay}
                      onChange={(e) => setAllDay(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span>All Day Event</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/40 dark:border-border/10 mt-auto">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl">
                    Create Event
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
