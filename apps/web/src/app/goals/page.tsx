"use client"

import * as React from "react"
import { Target, Flag, Plus, Trash2, CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react"
import { useGoalStore } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Goal, Priority, GoalStatus } from "@lifesync/types"
import { formatDate } from "@lifesync/utils"

export default function GoalsPage() {
  const {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    createMilestone,
    toggleMilestone,
    deleteMilestone,
  } = useGoalStore()

  // Form states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedGoalId, setSelectedGoalId] = React.useState<string | null>(null)
  
  // Fields
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState("General")
  const [priority, setPriority] = React.useState<Priority>("MEDIUM")
  const [deadline, setDeadline] = React.useState("")
  
  // Milestone creation field
  const [newMilestoneTitle, setNewMilestoneTitle] = React.useState("")

  React.useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const handleOpenCreate = () => {
    setTitle("")
    setCategory("General")
    setPriority("MEDIUM")
    setDeadline("")
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const success = await createGoal({
      title,
      category,
      target: 100,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status: "ACTIVE",
      priority,
    })

    if (success) {
      setIsFormOpen(false)
    }
  }

  const handleAddMilestone = async (goalId: string) => {
    if (!newMilestoneTitle) return
    const success = await createMilestone(goalId, newMilestoneTitle)
    if (success) {
      setNewMilestoneTitle("")
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
            <h1 className="text-2xl font-bold tracking-tight">Objectives & Goals</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track multi-stage objectives, complete milestones, and analyze progress.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 h-10 shadow-md">
            <Plus className="h-4.5 w-4.5" /> Add Goal
          </Button>
        </div>

        {/* Goals Progress Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Goals List (Left side) */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Card className="h-32 animate-pulse" />
                <Card className="h-32 animate-pulse" />
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center p-12 border border-dashed rounded-2xl text-muted-foreground">
                No active goals found. Set up milestones to target achievements.
              </div>
            ) : (
              goals.map((goal) => {
                const isActive = selectedGoalId === goal.id
                return (
                  <Card
                    key={goal.id}
                    className={`hover:border-indigo-500/20 transition cursor-pointer ${
                      isActive ? "border-indigo-500/30 ring-1 ring-indigo-500/10" : ""
                    }`}
                    onClick={() => setSelectedGoalId(isActive ? null : goal.id)}
                  >
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-foreground">{goal.title}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-lg dark:bg-muted/10">
                              {goal.category}
                            </span>
                          </div>
                          {goal.deadline && (
                            <span className="text-2xs text-muted-foreground mt-1 block font-mono">
                              Deadline: {formatDate(goal.deadline)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono ${getPriorityBadgeClass(goal.priority)}`}>
                            {goal.priority}
                          </span>
                          <span className="text-2xs font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-muted dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                          <span>Milestones: {goal.milestones?.filter((m) => m.completed).length || 0} completed</span>
                          <span>Total: {goal.milestones?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Milestone Details (Right side - visible when goal selected) */}
          <div className="lg:col-span-1">
            {selectedGoalId ? (
              (() => {
                const goal = goals.find((g) => g.id === selectedGoalId)
                if (!goal) return null
                return (
                  <Card className="sticky top-6 border-indigo-500/20">
                    <CardHeader className="pb-3 border-b border-border/40 dark:border-border/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <Flag className="h-4.5 w-4.5 text-indigo-500" />
                          Milestones Checklist
                        </CardTitle>
                        <button
                          onClick={() => deleteGoal(goal.id).then(() => setSelectedGoalId(null))}
                          className="text-2xs font-semibold text-destructive hover:underline"
                        >
                          Delete Goal
                        </button>
                      </div>
                      <CardDescription className="text-2xs font-bold truncate mt-1">
                        {goal.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Milestones list */}
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {goal.milestones?.length === 0 ? (
                          <p className="text-2xs text-muted-foreground text-center py-4">No milestones logged.</p>
                        ) : (
                          goal.milestones?.map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/40 dark:bg-muted/10 border border-border/20">
                              <div className="flex items-center space-x-2">
                                <button onClick={() => toggleMilestone(milestone.id)} className="text-muted-foreground hover:text-indigo-500">
                                  {milestone.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                                  ) : (
                                    <Circle className="h-4 w-4" />
                                  )}
                                </button>
                                <span className={`text-xs font-medium ${milestone.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                  {milestone.title}
                                </span>
                              </div>
                              <button onClick={() => deleteMilestone(milestone.id)} className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add milestone */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="New milestone..."
                          value={newMilestoneTitle}
                          onChange={(e) => setNewMilestoneTitle(e.target.value)}
                          className="h-8 text-xs"
                        />
                        <Button onClick={() => handleAddMilestone(goal.id)} variant="secondary" size="sm" className="h-8 text-xs">
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()
            ) : (
              <Card className="text-center p-6 border border-dashed rounded-2xl text-muted-foreground">
                <Flag className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs font-semibold">No goal selected</p>
                <p className="text-2xs mt-1 max-w-[150px] mx-auto">Click any goal to view and complete its specific milestones checklist.</p>
              </Card>
            )}
          </div>
        </div>

        {/* GOAL CREATE DRAWER */}
        {isFormOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-112 bg-card border-l border-border/60 dark:border-border/10 p-6 z-50 flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center border-b border-border/40 pb-4 dark:border-border/10">
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Target className="h-5 w-5 text-indigo-500" />
                  New Objective Goal
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
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Goal Title</label>
                  <Input
                    placeholder="e.g. Run half-marathon..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                  >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                {/* Priority */}
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

                {/* Deadline */}
                <div className="grid gap-1">
                  <label className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none text-foreground"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/40 dark:border-border/10 mt-auto">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl">
                    Create Goal
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
