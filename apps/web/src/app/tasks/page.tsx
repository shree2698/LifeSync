"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Table as TableIcon,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Pin,
  Star,
  Edit3,
  Paperclip,
  CheckSquare,
  AlertCircle
} from "lucide-react"
import { useTaskStore, useGoalStore } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Task, TaskStatus, Priority, Subtask, TaskSortOption } from "@lifesync/types"
import { formatDate } from "@lifesync/utils"

export default function TasksPage() {
  const {
    tasks,
    labels,
    filters,
    sort,
    viewMode,
    isLoading,
    fetchTasks,
    fetchLabels,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    toggleSubtask,
    deleteSubtask,
    setFilters,
    setSort,
    setViewMode,
    resetFilters,
  } = useTaskStore()

  const { goals, fetchGoals } = useGoalStore()

  // Form states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | null>(null)
  
  // Fields
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [status, setStatus] = React.useState<TaskStatus>("TODO")
  const [priority, setPriority] = React.useState<Priority>("MEDIUM")
  const [dueDate, setDueDate] = React.useState("")
  const [startDate, setStartDate] = React.useState("")
  const [time, setTime] = React.useState("")
  const [duration, setDuration] = React.useState("")
  const [pinned, setPinned] = React.useState(false)
  const [favorite, setFavorite] = React.useState(false)
  const [goalId, setGoalId] = React.useState("")
  const [recurringExpr, setRecurringExpr] = React.useState("")

  // Subtask UI state for editing task
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState("")

  React.useEffect(() => {
    fetchTasks()
    fetchLabels()
    fetchGoals()
  }, [fetchTasks, fetchLabels, fetchGoals])

  // Set form fields for editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description || "")
    setStatus(task.status)
    setPriority(task.priority)
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "")
    setStartDate(task.startDate ? task.startDate.split("T")[0] : "")
    setTime(task.time || "")
    setDuration(task.estimatedDuration ? String(task.estimatedDuration) : "")
    setPinned(task.pinned)
    setFavorite(task.favorite)
    setGoalId(task.goalId || "")
    setRecurringExpr(task.recurringExpr || "")
    setIsFormOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingTask(null)
    setTitle("")
    setDescription("")
    setStatus("TODO")
    setPriority("MEDIUM")
    setDueDate("")
    setStartDate("")
    setTime("")
    setDuration("")
    setPinned(false)
    setFavorite(false)
    setGoalId("")
    setRecurringExpr("")
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const taskData = {
      title,
      description: description || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      time: time || null,
      estimatedDuration: duration ? parseInt(duration, 10) : null,
      color: priority === "URGENT" ? "#EF4444" : priority === "HIGH" ? "#F59E0B" : "#5B7FFF",
      icon: "ClipboardList",
      pinned,
      favorite,
      recurringExpr: recurringExpr || null,
      goalId: goalId || null,
      dependsOnId: null,
    }

    let success = false
    if (editingTask) {
      success = await updateTask(editingTask.id, taskData)
    } else {
      success = await createTask(taskData)
    }

    if (success) {
      setIsFormOpen(false)
    }
  }

  const handleAddSubtask = async () => {
    if (!editingTask || !newSubtaskTitle) return
    const success = await createSubtask(editingTask.id, newSubtaskTitle)
    if (success) {
      setNewSubtaskTitle("")
      // Reload editing task references
      const reloadRes = await useTaskStore.getState().tasks.find((t) => t.id === editingTask.id)
      if (reloadRes) setEditingTask(reloadRes)
    }
  }

  const handleToggleSub = async (sub: Subtask) => {
    const success = await toggleSubtask(sub.id, !sub.completed)
    if (success && editingTask) {
      const reloadRes = await useTaskStore.getState().tasks.find((t) => t.id === editingTask.id)
      if (reloadRes) setEditingTask(reloadRes)
    }
  }

  const handleDeleteSub = async (subId: string) => {
    const success = await deleteSubtask(subId)
    if (success && editingTask) {
      const reloadRes = await useTaskStore.getState().tasks.find((t) => t.id === editingTask.id)
      if (reloadRes) setEditingTask(reloadRes)
    }
  }

  const getPriorityBadgeClass = (p: Priority) => {
    switch (p) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "HIGH":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "MEDIUM":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
      case "LOW":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  return (
    <DashboardShell>
      <PageContainer>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 dark:border-border/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Center</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, sort, and organize task structures and subtasks nested.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 h-10 shadow-md">
            <Plus className="h-4.5 w-4.5" /> Add Task
          </Button>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/40 dark:bg-card/10 p-3 rounded-2xl border border-border/60 dark:border-border/10 select-none">
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60 flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="h-9 w-full rounded-xl bg-background pl-9 pr-4 text-xs transition border border-border/60 focus:border-indigo-500 outline-none text-foreground"
              />
            </div>

            {/* Status Selector */}
            <select
              value={filters.status?.[0] || ""}
              onChange={(e) => setFilters({ status: e.target.value ? [e.target.value as TaskStatus] : null })}
              className="h-9 w-full sm:w-36 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-ring text-foreground"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Priority Selector */}
            <select
              value={filters.priority?.[0] || ""}
              onChange={(e) => setFilters({ priority: e.target.value ? [e.target.value as Priority] : null })}
              className="h-9 w-full sm:w-36 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-ring text-foreground"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="flex gap-4 items-center w-full lg:w-auto justify-between lg:justify-end">
            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold text-muted-foreground uppercase">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as TaskSortOption)}
                className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground font-semibold"
              >
                <option value="NEWEST">Newest</option>
                <option value="OLDEST">Oldest</option>
                <option value="PRIORITY_DESC">Priority: High to Low</option>
                <option value="PRIORITY_ASC">Priority: Low to High</option>
                <option value="DUE_DATE_ASC">Due Date: Soonest</option>
                <option value="DUE_DATE_DESC">Due Date: Latest</option>
                <option value="ALPHABETICAL_ASC">Name: A-Z</option>
              </select>
            </div>

            {/* View Mode switcher */}
            <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/40 dark:bg-muted/10">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "kanban" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="Kanban Board"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-background text-indigo-500 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="Table View"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Contents */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="h-32 animate-pulse" />
            <Card className="h-32 animate-pulse" />
            <Card className="h-32 animate-pulse" />
          </div>
        ) : (
          <>
            {/* 1. LIST VIEW */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center p-12 border border-dashed rounded-2xl text-muted-foreground">
                    No tasks found matching filter criteria.
                  </div>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id} className="hover:border-indigo-500/20 transition cursor-pointer" onClick={() => handleEditTask(task)}>
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 truncate">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateTask(task.id, { status: task.status === "COMPLETED" ? "TODO" : "COMPLETED" })
                            }}
                            className="text-muted-foreground hover:text-indigo-500"
                          >
                            {task.status === "COMPLETED" ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500" />
                            ) : (
                              <Circle className="h-4.5 w-4.5" />
                            )}
                          </button>
                          <div className="truncate">
                            <span className={`text-sm font-semibold truncate block ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {task.title}
                            </span>
                            {task.description && (
                              <span className="text-xs text-muted-foreground truncate block mt-0.5 max-w-xl">
                                {task.description}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          {task.pinned && <Pin className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />}
                          {task.favorite && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                          <span className={`text-2xs font-bold px-2 py-0.5 rounded-lg border font-mono ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-2xs text-muted-foreground flex items-center gap-1 font-mono">
                              <Calendar className="h-3 w-3" /> {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* 2. KANBAN BOARD */}
            {viewMode === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(["TODO", "IN_PROGRESS", "COMPLETED"] as TaskStatus[]).map((colStatus) => {
                  const colTasks = tasks.filter((t) => t.status === colStatus)
                  return (
                    <div key={colStatus} className="space-y-4">
                      <div className="flex justify-between items-center bg-card/60 dark:bg-card/10 p-3.5 rounded-2xl border border-border/40 dark:border-border/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {colStatus === "TODO" ? "To Do" : colStatus === "IN_PROGRESS" ? "In Progress" : "Completed"}
                        </span>
                        <span className="rounded-full bg-muted/60 dark:bg-muted/10 px-2 py-0.5 text-2xs font-bold text-muted-foreground font-mono">
                          {colTasks.length}
                        </span>
                      </div>

                      <div className="space-y-3 min-h-[300px]">
                        {colTasks.map((task) => (
                          <Card
                            key={task.id}
                            onClick={() => handleEditTask(task)}
                            className="hover:border-indigo-500/20 transition cursor-pointer bg-card/40 hover:shadow"
                          >
                            <CardContent className="p-4 space-y-3">
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-xs font-bold leading-tight ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                  {task.title}
                                </span>
                                <div className="flex space-x-1">
                                  {task.pinned && <Pin className="h-3 w-3 text-indigo-500 fill-indigo-500" />}
                                  {task.favorite && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className="text-2xs text-muted-foreground leading-normal line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex justify-between items-center pt-2 border-t border-border/20">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${getPriorityBadgeClass(task.priority)}`}>
                                  {task.priority}
                                </span>
                                {task.dueDate && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                                    <Clock className="h-3 w-3" /> {formatDate(task.dueDate)}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 3. TABLE VIEW */}
            {viewMode === "table" && (
              <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/20 dark:border-border/10 select-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 dark:border-border/10 bg-muted/40 dark:bg-muted/10 text-muted-foreground font-bold text-2xs uppercase tracking-wider">
                      <th className="p-4">Title</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No tasks logged.
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task) => (
                        <tr
                          key={task.id}
                          onClick={() => handleEditTask(task)}
                          className="border-b border-border/40 dark:border-border/10 hover:bg-muted/20 transition cursor-pointer"
                        >
                          <td className="p-4 font-semibold text-foreground truncate max-w-xs">{task.title}</td>
                          <td className="p-4">
                            <span className="rounded-lg bg-muted px-2 py-1 text-2xs font-semibold text-muted-foreground uppercase">
                              {task.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-lg border text-2xs font-bold font-mono ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground font-mono">{task.dueDate ? formatDate(task.dueDate) : "-"}</td>
                          <td className="p-4 text-muted-foreground font-mono">{task.estimatedDuration ? `${task.estimatedDuration}m` : "-"}</td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* CREATE / EDIT DRAWER FORM MODAL */}
        {isFormOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-112 bg-card border-l border-border/60 dark:border-border/10 p-6 z-50 flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center border-b border-border/40 pb-4 dark:border-border/10">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <CheckSquare className="h-5 w-5 text-indigo-500" />
                  {editingTask ? "Edit Task" : "New Task"}
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
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Title</label>
                  <Input
                    placeholder="Task summary..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                  <textarea
                    placeholder="Task details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-xs shadow-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-indigo-500 min-h-20 text-foreground"
                  />
                </div>

                {/* Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
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
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    />
                  </div>
                </div>

                {/* Time & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Duration (mins)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>

                {/* Link to Goal */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Linked Goal</label>
                  <select
                    value={goalId}
                    onChange={(e) => setGoalId(e.target.value)}
                    className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                  >
                    <option value="">None</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options Switches */}
                <div className="flex gap-6 items-center select-none pt-2">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span>Pin Task</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={favorite}
                      onChange={(e) => setFavorite(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span>Favorite Task</span>
                  </label>
                </div>

                {/* Subtasks checklist inside editing task */}
                {editingTask && (
                  <div className="border-t border-border/40 pt-4 space-y-3 dark:border-border/10">
                    <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Subtasks Checklist
                    </label>

                    {/* Subtask list */}
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {editingTask.subtasks?.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/40 dark:bg-muted/10 border border-border/20">
                          <div className="flex items-center space-x-2">
                            <button type="button" onClick={() => handleToggleSub(sub)} className="text-muted-foreground hover:text-indigo-500">
                              {sub.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                            <span className={`text-xs font-medium ${sub.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {sub.title}
                            </span>
                          </div>
                          <button type="button" onClick={() => handleDeleteSub(sub.id)} className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* New Subtask Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add subtask..."
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Button type="button" onClick={handleAddSubtask} variant="secondary" size="sm" className="h-8">
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/40 dark:border-border/10 mt-auto">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl">
                    {editingTask ? "Save Task" : "Create Task"}
                  </Button>
                  {editingTask && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        deleteTask(editingTask.id)
                        setIsFormOpen(false)
                      }}
                      className="border-destructive/30 hover:bg-destructive/10 text-destructive h-10 rounded-xl"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </PageContainer>
    </DashboardShell>
  )
}
