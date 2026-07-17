"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Activity,
  Droplet,
  Moon,
  Flame,
  Heart,
  Pill,
  Smile,
  Plus,
  Trash2,
  Calendar,
  FileText,
  RefreshCw,
  Dumbbell,
  Sparkles,
  PlusCircle,
  Clock,
  Weight,
  Scissors,
  Sparkle
} from "lucide-react"
import {
  useHealthStore,
  useHealthCoach,
  useWorkoutSuggestions,
  useSleepAnalysis,
  useWaterReminder
} from "@lifesync/hooks"
import {
  HealthCard,
  MetricCard,
  ProgressRing,
  ProgressBar,
  Timeline,
  HistoryTable,
  HealthChart,
  RoutineChecklist,
  CalendarPicker,
  StatBadge
} from "@/components/health-ui"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Input } from "@/components/ui/input"

// Forms Validation Schemas
const waterFormSchema = z.object({
  amount: z.coerce.number().min(50, "Minimum 50ml").max(5000, "Maximum 5L"),
})

const sleepFormSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  quality: z.coerce.number().min(1).max(5),
  notes: z.string().optional(),
})

const workoutFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 chars"),
  category: z.string().min(1, "Category is required"),
  duration: z.coerce.number().min(1, "Minimum 1 minute"),
  calories: z.coerce.number().optional(),
  notes: z.string().optional(),
})

const weightFormSchema = z.object({
  weight: z.coerce.number().min(20, "Must be at least 20kg"),
  chest: z.coerce.number().optional(),
  waist: z.coerce.number().optional(),
  hips: z.coerce.number().optional(),
})

const medicationFormSchema = z.object({
  name: z.string().min(1, "Medication name required"),
  dosage: z.string().min(1, "Dosage required"),
  schedule: z.string().min(1, "Schedule required"),
  frequency: z.string().min(1, "Frequency required"),
  startDate: z.string().min(1, "Start date required"),
})

const cycleFormSchema = z.object({
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
})

const moodFormSchema = z.object({
  mood: z.string().min(1, "Mood selection required"),
  energyLevel: z.coerce.number().min(1).max(5),
  stressLevel: z.coerce.number().min(1).max(5),
  notes: z.string().optional(),
})

type TabName = "overview" | "water_sleep" | "fitness" | "meds" | "womens" | "beauty" | "mood" | "reports"

export default function HealthPage() {
  const [activeTab, setActiveTab] = React.useState<TabName>("overview")
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString())
  
  const {
    dashboardData,
    reportData,
    offlineQueue,
    isLoading,
    fetchDashboard,
    fetchReport,
    logWater,
    logSleep,
    logWorkout,
    logWeight,
    logMedication,
    takeMedication,
    logCycle,
    logPcos,
    logHairActivity,
    logSkinActivity,
    logMood,
    syncOfflineQueue,
    clearOfflineQueue
  } = useHealthStore()

  // AI Hook analysis mock
  const coach = useHealthCoach()
  const workoutSug = useWorkoutSuggestions()
  const sleepAnal = useSleepAnalysis()
  const waterRem = useWaterReminder()
  
  const [advice, setAdvice] = React.useState("Loading AI advisor...")
  const [suggestions, setSuggestions] = React.useState<any[]>([])

  React.useEffect(() => {
    fetchDashboard()
    fetchReport()
    coach.getCoachAdvice().then(setAdvice)
    workoutSug.getSuggestions().then(setSuggestions)
  }, [fetchDashboard, fetchReport])

  // Forms Hook Setup
  const waterForm = useForm<z.infer<typeof waterFormSchema>>({
    resolver: zodResolver(waterFormSchema) as any,
    defaultValues: { amount: 250 },
  })

  const sleepForm = useForm<z.infer<typeof sleepFormSchema>>({
    resolver: zodResolver(sleepFormSchema) as any,
    defaultValues: {
      startTime: new Date(Date.now() - 8 * 3600000).toISOString().slice(0, 16),
      endTime: new Date().toISOString().slice(0, 16),
      quality: 4,
      notes: "",
    },
  })

  const workoutForm = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema) as any,
    defaultValues: {
      title: "",
      category: "Strength",
      duration: 30,
      notes: "",
    },
  })

  const weightForm = useForm<z.infer<typeof weightFormSchema>>({
    resolver: zodResolver(weightFormSchema) as any,
    defaultValues: { weight: 70 },
  })

  const medicationForm = useForm<z.infer<typeof medicationFormSchema>>({
    resolver: zodResolver(medicationFormSchema) as any,
    defaultValues: {
      name: "",
      dosage: "1 pill",
      schedule: "09:00",
      frequency: "DAILY",
      startDate: new Date().toISOString().split("T")[0],
    },
  })

  const cycleForm = useForm<z.infer<typeof cycleFormSchema>>({
    resolver: zodResolver(cycleFormSchema) as any,
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
    },
  })

  const moodForm = useForm<z.infer<typeof moodFormSchema>>({
    resolver: zodResolver(moodFormSchema) as any,
    defaultValues: {
      mood: "Happy",
      energyLevel: 4,
      stressLevel: 2,
      notes: "",
    },
  })

  // Submit Handlers
  const onWaterSubmit = async (data: z.infer<typeof waterFormSchema>) => {
    await logWater(data.amount, selectedDate)
    waterForm.reset()
  }

  const onSleepSubmit = async (data: z.infer<typeof sleepFormSchema>) => {
    await logSleep({
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      quality: data.quality,
      notes: data.notes || null,
      date: selectedDate,
    })
    sleepForm.reset()
  }

  const onWorkoutSubmit = async (data: z.infer<typeof workoutFormSchema>) => {
    await logWorkout({
      title: data.title,
      category: data.category,
      duration: data.duration,
      calories: data.calories || null,
      notes: data.notes || null,
      date: selectedDate,
      exercises: [],
    })
    workoutForm.reset()
  }

  const onWeightSubmit = async (data: z.infer<typeof weightFormSchema>) => {
    await logWeight({
      weight: data.weight,
      chest: data.chest || null,
      waist: data.waist || null,
      hips: data.hips || null,
      date: selectedDate,
    })
    weightForm.reset()
  }

  const onMedicationSubmit = async (data: z.infer<typeof medicationFormSchema>) => {
    await logMedication({
      name: data.name,
      dosage: data.dosage,
      schedule: data.schedule,
      frequency: data.frequency,
      startDate: new Date(data.startDate).toISOString(),
    })
    medicationForm.reset()
  }

  const onCycleSubmit = async (data: z.infer<typeof cycleFormSchema>) => {
    await logCycle({
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      notes: data.notes || null,
      symptoms: [],
    })
    cycleForm.reset()
  }

  const onMoodSubmit = async (data: z.infer<typeof moodFormSchema>) => {
    await logMood({
      mood: data.mood,
      energyLevel: data.energyLevel,
      stressLevel: data.stressLevel,
      notes: data.notes || null,
      date: selectedDate,
    })
    moodForm.reset()
  }

  if (isLoading || !dashboardData) {
    return (
      <DashboardShell>
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-[500px]">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Initializing health modules...</p>
          </div>
        </PageContainer>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <PageContainer>
        {/* Header section with offline queue badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 select-none">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Health Platform</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Holistic life OS tracking water, sleep, physical fitness, treatments, cycles, skin and hair routines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {offlineQueue.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-yellow-500 font-bold font-mono">
                  {offlineQueue.length} Offline Logs Pending
                </span>
                <button
                  onClick={() => syncOfflineQueue()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all"
                >
                  Sync Now
                </button>
              </div>
            )}
            
            <CalendarPicker value={selectedDate} onChange={setSelectedDate} className="w-[300px]" />
          </div>
        </div>

        {/* Modular Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 border-b border-border/40 dark:border-border/10 my-6 scrollbar-thin select-none">
          {[
            { id: "overview", label: "Overview", icon: <Activity className="h-3.5 w-3.5" /> },
            { id: "water_sleep", label: "Water & Sleep", icon: <Droplet className="h-3.5 w-3.5" /> },
            { id: "fitness", label: "Fitness & Weight", icon: <Dumbbell className="h-3.5 w-3.5" /> },
            { id: "meds", label: "Medication & Reminders", icon: <Pill className="h-3.5 w-3.5" /> },
            { id: "womens", label: "Women's Health", icon: <Heart className="h-3.5 w-3.5" /> },
            { id: "beauty", label: "Skin & Hair", icon: <Sparkles className="h-3.5 w-3.5" /> },
            { id: "mood", label: "Mood Tracker", icon: <Smile className="h-3.5 w-3.5" /> },
            { id: "reports", label: "Reports", icon: <FileText className="h-3.5 w-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabName)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10"
                  : "border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="grid grid-cols-1 gap-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily Metrics Dashboard Rings */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  title="Today's Water"
                  value={dashboardData.todayWater}
                  unit="ml"
                  icon={<Droplet className="h-4 w-4 text-blue-500" />}
                  progress={{ value: dashboardData.todayWater, target: dashboardData.waterGoal }}
                  variant="blue"
                />
                <MetricCard
                  title="Sleep duration"
                  value={dashboardData.todaySleep ? `${dashboardData.todaySleep.duration.toFixed(1)}` : "0"}
                  unit="hrs"
                  icon={<Moon className="h-4 w-4 text-indigo-500" />}
                  progress={{ value: dashboardData.todaySleep ? dashboardData.todaySleep.duration : 0, target: dashboardData.sleepGoal }}
                  variant="violet"
                />
                <MetricCard
                  title="Workout minutes"
                  value={dashboardData.workoutProgress}
                  unit="min"
                  icon={<Flame className="h-4 w-4 text-orange-500" />}
                  progress={{ value: dashboardData.workoutProgress, target: dashboardData.workoutGoal }}
                  variant="orange"
                />
              </div>

              {/* AI Coaching & Reminders */}
              <div className="space-y-6">
                <HealthCard title="✦ AI Health Coach Advice" accentColor="violet">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-xs text-foreground font-sans leading-relaxed">{advice}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Suggested Workouts
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((s, i) => (
                        <div key={i} className="flex justify-between items-center bg-muted/20 border border-border/20 p-2 rounded-lg text-[10px]">
                          <span className="font-semibold">{s.title}</span>
                          <span className="font-mono text-muted-foreground">{s.duration} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </HealthCard>
              </div>

              {/* Other parameters cards */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
                <HealthCard title="Weight Status" accentColor="orange">
                  <div className="text-center py-4">
                    <Weight className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold font-mono">
                      {dashboardData.currentWeight || "—"} <span className="text-xs font-normal">kg</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Target: {dashboardData.targetWeight || "—"} kg
                    </p>
                  </div>
                </HealthCard>

                <HealthCard title="Cycle Tracking" accentColor="pink">
                  <div className="text-center py-4">
                    <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <p className="text-lg font-bold">
                      {dashboardData.cycleStatus.isPeriodToday ? "Period Day" : dashboardData.cycleStatus.phase || "No Cycle"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {dashboardData.cycleStatus.daysUntilPeriod !== null
                        ? `${dashboardData.cycleStatus.daysUntilPeriod} days to next period`
                        : "Start logging cycle"}
                    </p>
                  </div>
                </HealthCard>

                <HealthCard title="Medications" accentColor="violet">
                  <div className="text-center py-4">
                    <Pill className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold font-mono">
                      {dashboardData.medicationStatus.taken} / {dashboardData.medicationStatus.total}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">doses taken today</p>
                  </div>
                </HealthCard>

                <HealthCard title="Mood status" accentColor="emerald">
                  <div className="text-center py-4">
                    <Smile className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-lg font-bold">
                      {dashboardData.todayMood ? dashboardData.todayMood.mood : "Not Logged"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {dashboardData.todayMood ? `Stress level: ${dashboardData.todayMood.stressLevel}/5` : "Record mood"}
                    </p>
                  </div>
                </HealthCard>
              </div>
            </div>
          )}

          {/* TAB 2: WATER & SLEEP */}
          {activeTab === "water_sleep" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Log Water */}
              <HealthCard title="Hydration Logger" accentColor="blue" subtitle="Keep track of your daily water intake goal.">
                <form onSubmit={waterForm.handleSubmit(onWaterSubmit)} className="space-y-4">
                  <div className="flex gap-2">
                    {[250, 500, 750].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => logWater(amt, selectedDate)}
                        className="flex-1 border border-border/40 hover:border-blue-500/40 bg-muted/10 hover:bg-blue-500/5 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                      >
                        +{amt}ml
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Custom amount (ml)"
                      {...waterForm.register("amount")}
                      className="flex-1 bg-muted/10 border-border/40 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Log
                    </button>
                  </div>
                  {waterForm.formState.errors.amount && (
                    <span className="text-[10px] text-red-500 font-medium">
                      {waterForm.formState.errors.amount.message}
                    </span>
                  )}
                </form>

                <div className="mt-6 flex-1 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">History</p>
                  <HistoryTable
                    headers={["Time", "Amount"]}
                    rows={(reportData?.water.history || []).slice(0, 3).map((w: any) => [
                      new Date(w.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                      `${w.amount} ml`,
                    ])}
                  />
                </div>
              </HealthCard>

              {/* Log Sleep */}
              <HealthCard title="Sleep Diary" accentColor="violet" subtitle="Log sleep segments to observe duration and trends.">
                <form onSubmit={sleepForm.handleSubmit(onSleepSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Bedtime</label>
                      <Input
                        type="datetime-local"
                        {...sleepForm.register("startTime")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Wake Time</label>
                      <Input
                        type="datetime-local"
                        {...sleepForm.register("endTime")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Quality Rating (1-5)</label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      {...sleepForm.register("quality")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Notes</label>
                    <Input
                      placeholder="Dreams, night wakeups, temperature notes..."
                      {...sleepForm.register("notes")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Sleep
                  </button>
                </form>

                {reportData?.sleep.history && reportData.sleep.history.length > 0 && (
                  <div className="mt-6 p-3 bg-muted/10 border border-border/40 rounded-xl text-[11px] select-none text-muted-foreground">
                    <p className="font-bold text-foreground">✦ Sleep Quality Insights</p>
                    <p className="mt-1 leading-relaxed">{sleepAnal.analyzeSleep(reportData.sleep.history)}</p>
                  </div>
                )}
              </HealthCard>
            </div>
          )}

          {/* TAB 3: FITNESS & WEIGHT */}
          {activeTab === "fitness" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workouts */}
              <HealthCard title="Workout Logger" accentColor="orange" subtitle="Record details of strength or cardio sessions.">
                <form onSubmit={workoutForm.handleSubmit(onWorkoutSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Title</label>
                      <Input
                        placeholder="Morning Run, Chest Day"
                        {...workoutForm.register("title")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Category</label>
                      <select
                        {...workoutForm.register("category")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 h-9"
                      >
                        <option>Strength</option>
                        <option>Cardio</option>
                        <option>Yoga</option>
                        <option>HIIT</option>
                        <option>Pilates</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Duration (min)</label>
                      <Input
                        type="number"
                        {...workoutForm.register("duration")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Calories (optional)</label>
                      <Input
                        type="number"
                        {...workoutForm.register("calories")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Notes</label>
                    <Input
                      placeholder="Reps, weights, treadmill speed..."
                      {...workoutForm.register("notes")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Workout
                  </button>
                </form>

                <div className="mt-6 flex-1 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">History</p>
                  <HistoryTable
                    headers={["Activity", "Duration", "Notes"]}
                    rows={(reportData?.workout.history || []).slice(0, 3).map((w: any) => [
                      w.title,
                      `${w.duration} min`,
                      w.notes || "—",
                    ])}
                  />
                </div>
              </HealthCard>

              {/* Weight & Body Measurements */}
              <HealthCard title="Weight & Measurements" accentColor="orange" subtitle="Observe weight fluctuations and chest/waist/hips.">
                <form onSubmit={weightForm.handleSubmit(onWeightSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Weight (kg)</label>
                      <Input
                        type="number"
                        step="0.1"
                        {...weightForm.register("weight")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Waist (cm)</label>
                      <Input
                        type="number"
                        {...weightForm.register("waist")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Chest (cm)</label>
                      <Input
                        type="number"
                        {...weightForm.register("chest")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Hips (cm)</label>
                      <Input
                        type="number"
                        {...weightForm.register("hips")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Weight
                  </button>
                </form>

                {reportData?.weight.history && reportData.weight.history.length > 0 && (
                  <div className="mt-6 flex-1 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Weight Trend</p>
                    <HealthChart
                      data={reportData.weight.history.map((w: any) => w.weight)}
                      labels={reportData.weight.history.map((w: any) =>
                        new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      )}
                      variant="orange"
                    />
                  </div>
                )}
              </HealthCard>
            </div>
          )}

          {/* TAB 4: MEDICATIONS & REMINDERS */}
          {activeTab === "meds" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medications List / Dose taker */}
              <HealthCard title="Today's Medications" accentColor="violet" subtitle="Mark your medication schedule as completed.">
                <div className="space-y-4">
                  {dashboardData.medicationStatus.list.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No active medications. Add one below!
                    </div>
                  ) : (
                    dashboardData.medicationStatus.list.map((med: any) => (
                      <div
                        key={med.id}
                        className="flex justify-between items-center bg-muted/20 border border-border/20 p-3 rounded-xl hover:border-violet-500/20 hover:bg-violet-500/[0.01] transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{med.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Dosage: {med.dosage} • Time: {med.schedule}
                          </p>
                        </div>
                        <button
                          disabled={med.takenToday}
                          onClick={() => takeMedication({ medicationId: med.id, status: "TAKEN" })}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all border ${
                            med.takenToday
                              ? "bg-violet-500/10 text-violet-500 border-violet-500/20 cursor-default"
                              : "bg-violet-500 hover:bg-violet-600 text-white border-transparent cursor-pointer"
                          }`}
                        >
                          {med.takenToday ? "Taken ✓" : "Mark Taken"}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {dashboardData.upcomingReminders.length > 0 && (
                  <div className="mt-6 border-t border-border/10 pt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-violet-500" /> Upcoming Reminders
                    </p>
                    <div className="space-y-2">
                      {dashboardData.upcomingReminders.map((rem: any) => (
                        <div key={rem.id} className="flex justify-between items-center text-[10px] bg-muted/10 p-2 rounded-lg border border-border/20">
                          <span className="font-bold">{rem.message}</span>
                          <span className="font-mono text-muted-foreground">{rem.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </HealthCard>

              {/* Add Medication */}
              <HealthCard title="Add Medication Schedule" accentColor="violet" subtitle="Create reminder and scheduling rules for medications.">
                <form onSubmit={medicationForm.handleSubmit(onMedicationSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Name</label>
                      <Input
                        placeholder="Thyroxine, Vitamin D3"
                        {...medicationForm.register("name")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Dosage</label>
                      <Input
                        placeholder="1 tablet, 5ml"
                        {...medicationForm.register("dosage")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Schedule Time</label>
                      <Input
                        type="time"
                        {...medicationForm.register("schedule")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Frequency</label>
                      <select
                        {...medicationForm.register("frequency")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 h-9"
                      >
                        <option>DAILY</option>
                        <option>WEEKLY</option>
                        <option>AS_NEEDED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Start Date</label>
                    <Input
                      type="date"
                      {...medicationForm.register("startDate")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Add Medication
                  </button>
                </form>
              </HealthCard>
            </div>
          )}

          {/* TAB 5: WOMEN'S HEALTH */}
          {activeTab === "womens" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cycle tracking */}
              <HealthCard title="Cycle Tracking Calendar" accentColor="pink" subtitle="Log period days, calculate cycle lengths.">
                <form onSubmit={cycleForm.handleSubmit(onCycleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Period Start</label>
                      <Input
                        type="date"
                        {...cycleForm.register("startDate")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Period End (optional)</label>
                      <Input
                        type="date"
                        {...cycleForm.register("endDate")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Notes</label>
                    <Input
                      placeholder="Symptoms, mood changes, notes..."
                      {...cycleForm.register("notes")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Period Dates
                  </button>
                </form>

                <div className="mt-6 flex-1 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Cycle History</p>
                  <HistoryTable
                    headers={["Start Date", "End Date", "Cycle Length"]}
                    rows={(reportData?.cycle.history || []).slice(0, 3).map((c: any) => [
                      new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                      c.endDate ? new Date(c.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Ongoing",
                      c.cycleLength ? `${c.cycleLength} days` : "—",
                    ])}
                  />
                </div>
              </HealthCard>

              {/* PCOS Tracker */}
              <HealthCard title="PCOS Tracker" accentColor="pink" subtitle="Observe PCOS indicators: acne, fatigue, weight changes, stress.">
                <div className="space-y-4">
                  <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                    <p className="text-xs font-bold text-foreground">✦ Cycle Summary & PCOS Logs</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                      Average cycle length is {reportData?.cycle.averageLength || 28} days. Symptom frequencies show
                      fatigue or cramping as primary stress factors.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        logPcos({
                          symptoms: ["Acne", "Fatigue"],
                          weight: dashboardData.currentWeight,
                          medicationTaken: true,
                          waterIntakeMl: dashboardData.todayWater,
                          exerciseMinutes: dashboardData.workoutProgress,
                          stressLevel: 3,
                          notes: "Logged via PCOS panel",
                        })
                      }
                      className="w-full border border-pink-500/20 hover:border-pink-500/40 bg-pink-500/5 hover:bg-pink-500/10 text-pink-500 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Save Daily PCOS Log (Standard)
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">PCOS History</p>
                    <Timeline
                      items={(reportData?.pcos.history || []).map((p: any) => ({
                        id: p.id,
                        title: `PCOS indicators logged`,
                        subtitle: `Stress: ${p.stressLevel}/5 • Weight: ${p.weight || "—"}kg`,
                        time: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        details: `Symptoms: ${p.symptoms.join(", ") || "None"} • Notes: ${p.notes || "—"}`,
                      }))}
                    />
                  </div>
                </div>
              </HealthCard>
            </div>
          )}

          {/* TAB 6: SKIN & HAIR CARE */}
          {activeTab === "beauty" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hair Care */}
              <HealthCard title="Hair Care routines" accentColor="emerald" subtitle="Log wash days, oil applications, and mask treatments.">
                <div className="space-y-4 select-none">
                  <div className="flex justify-between items-center p-3 bg-muted/20 border border-border/20 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-foreground">Standard Hair wash Routine</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        Active. Products: Shampoo, Conditioner, Coconut Oil.
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Today&apos;s Checklist
                    </p>
                    <RoutineChecklist
                      items={[
                        { id: "wash", label: "Wash Day (Shampoo + Cond)", done: dashboardData.hairRoutineStatus.washDone },
                        { id: "oil", label: "Oil Application (Coconut Oil)", done: dashboardData.hairRoutineStatus.oilDone },
                        { id: "mask", label: "Mask Treatment", done: dashboardData.hairRoutineStatus.maskDone },
                      ]}
                      onToggle={async (id) => {
                        const logs = dashboardData.hairRoutineStatus
                        await logHairActivity({
                          routineId: "hr-1",
                          washDone: id === "wash" ? !logs.washDone : logs.washDone,
                          oilDone: id === "oil" ? !logs.oilDone : logs.oilDone,
                          maskDone: id === "mask" ? !logs.maskDone : logs.maskDone,
                          hairFallCount: 15,
                          notes: "Toggled from dashboard",
                        })
                      }}
                      variant="emerald"
                    />
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Activity History</p>
                    <HistoryTable
                      headers={["Date", "Wash", "Oil", "Mask"]}
                      rows={(reportData?.hair.history || []).slice(0, 3).map((hl: any) => [
                        new Date(hl.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        hl.washDone ? "Yes ✓" : "—",
                        hl.oilDone ? "Yes ✓" : "—",
                        hl.maskDone ? "Yes ✓" : "—",
                      ])}
                    />
                  </div>
                </div>
              </HealthCard>

              {/* Skin Care */}
              <HealthCard title="Skincare Tracker" accentColor="emerald" subtitle="Mark off morning and night routines to observe skin progress.">
                <div className="space-y-4 select-none">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Today&apos;s Routines
                    </p>
                    <RoutineChecklist
                      items={[
                        { id: "morning", label: "Morning Routine (Cleanser + Vit C + SPF)", done: dashboardData.skinRoutineStatus.morningDone },
                        { id: "night", label: "Night Routine (Cleanser + Retinol + Cream)", done: dashboardData.skinRoutineStatus.nightDone },
                      ]}
                      onToggle={async (id) => {
                        const logs = dashboardData.skinRoutineStatus
                        await logSkinActivity({
                          routineId: id === "morning" ? "sr-1" : "sr-2",
                          completed: id === "morning" ? !logs.morningDone : !logs.nightDone,
                          acneSeverity: "None",
                          notes: "Completed routine",
                        })
                      }}
                      variant="emerald"
                    />
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Activity History</p>
                    <HistoryTable
                      headers={["Date", "Morning Completed", "Night Completed"]}
                      rows={(reportData?.skin.history || []).slice(0, 3).map((sl: any) => [
                        new Date(sl.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        sl.routineId === "sr-1" && sl.completed ? "Yes ✓" : "—",
                        sl.routineId === "sr-2" && sl.completed ? "Yes ✓" : "—",
                      ])}
                    />
                  </div>
                </div>
              </HealthCard>
            </div>
          )}

          {/* TAB 7: MOOD */}
          {activeTab === "mood" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Logger */}
              <HealthCard title="Mood & Energy Diary" accentColor="emerald" subtitle="Track moods, energy levels and stress factors.">
                <form onSubmit={moodForm.handleSubmit(onMoodSubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-2">Select Mood</label>
                    <div className="flex gap-2">
                      {["Happy", "Neutral", "Anxious", "Calm", "Tired"].map((moodName) => {
                        const isSelected = moodForm.watch("mood") === moodName
                        return (
                          <button
                            key={moodName}
                            type="button"
                            onClick={() => moodForm.setValue("mood", moodName)}
                            className={`flex-1 border text-xs font-bold py-2 rounded-xl transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/15"
                                : "border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {moodName}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Energy Level (1-5)</label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...moodForm.register("energyLevel")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Stress Level (1-5)</label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...moodForm.register("stressLevel")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Notes</label>
                    <Input
                      placeholder="Journal entry notes, triggers, feelings..."
                      {...moodForm.register("notes")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Mood
                  </button>
                </form>
              </HealthCard>

              {/* Mood History Trends */}
              <HealthCard title="Mood Trends" accentColor="emerald" subtitle="Visualizing weekly energy and stress.">
                {reportData?.mood.history && reportData.mood.history.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Energy level</p>
                      <HealthChart
                        data={reportData.mood.history.map((m: any) => m.energyLevel)}
                        labels={reportData.mood.history.map((m: any) =>
                          new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        )}
                        variant="emerald"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Stress level</p>
                      <HealthChart
                        data={reportData.mood.history.map((m: any) => m.stressLevel)}
                        labels={reportData.mood.history.map((m: any) =>
                          new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        )}
                        variant="rose"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    Log mood history to view trends.
                  </div>
                )}
              </HealthCard>
            </div>
          )}

          {/* TAB 8: REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6 select-none">
              <div className="flex justify-between items-center border-b border-border/40 dark:border-border/10 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Generated Reports Summary</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Aggregated analytics for hydration, sleep quality, training volume, weight metrics and cycle schedules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Report Export Placeholder: File download trigger.")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" /> Export PDF (Mockup)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Water Report card */}
                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Water Report</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-foreground leading-none">
                      {reportData?.water.total} ml
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Average Daily: {reportData?.water.average} ml
                    </p>
                  </div>
                  <ProgressBar value={reportData?.water.average || 0} target={dashboardData.waterGoal} variant="blue" />
                </div>

                {/* Sleep Report card */}
                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Sleep Report</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-foreground leading-none">
                      {reportData?.sleep.averageDuration} hrs
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Average Quality: {reportData?.sleep.averageQuality} / 5
                    </p>
                  </div>
                  <ProgressBar value={reportData?.sleep.averageDuration || 0} target={dashboardData.sleepGoal} variant="violet" />
                </div>

                {/* Workout Report card */}
                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Workout Report</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-foreground leading-none">
                      {reportData?.workout.totalWorkouts} sessions
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Total Time: {reportData?.workout.totalDuration} min
                    </p>
                  </div>
                  <ProgressBar value={reportData?.workout.totalDuration || 0} target={dashboardData.workoutGoal} variant="orange" />
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
