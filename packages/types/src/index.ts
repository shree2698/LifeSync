export type ThemeMode = "light" | "dark" | "amoled";

export interface User {
  id: string;
  email: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string | null;
  avatar: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  timezone: string;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  theme: ThemeMode;
  marketingEmails: boolean;
  securityAlerts: boolean;
  pushNotifications: boolean;
  currency: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// ==========================================
// PRODUCTIVITY MODULE TYPES
// ==========================================

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
export type GoalStatus = "ACTIVE" | "PAUSED" | "COMPLETED";
export type HabitFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
export type TaskViewMode = "list" | "kanban" | "table" | "calendar" | "timeline";

export interface Label {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  startDate: string | null;
  time: string | null;
  estimatedDuration: number | null;
  color: string | null;
  icon: string | null;
  pinned: boolean;
  favorite: boolean;
  recurringExpr: string | null;
  goalId: string | null;
  dependsOnId: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
  labels?: Label[];
  dependencies?: Task[];
}

export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  frequency: HabitFrequency;
  customFreq: string | null;
  reminderTime: string | null;
  streak: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  logs?: HabitLog[];
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: string;
  progress: number;
  target: number;
  deadline: string | null;
  status: GoalStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[];
  tasks?: Task[];
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  pinned: boolean;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
  folder?: Folder | null;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  start: string;
  end: string;
  allDay: boolean;
  recurringRule: string | null;
  createdAt: string;
  updatedAt: string;
}

// Filter, Sort and Query Configurations
export interface TaskFilters {
  search: string;
  status: TaskStatus[] | null;
  priority: Priority[] | null;
  labelIds: string[] | null;
  goalId: string | null;
  dueDateStart: string | null;
  dueDateEnd: string | null;
  pinnedOnly: boolean;
  favoriteOnly: boolean;
}

export type TaskSortOption =
  | "NEWEST"
  | "OLDEST"
  | "PRIORITY_DESC"
  | "PRIORITY_ASC"
  | "DUE_DATE_ASC"
  | "DUE_DATE_DESC"
  | "ALPHABETICAL_ASC"
  | "ALPHABETICAL_DESC"
  | "UPDATED";

// Dashboard Data
export interface DashboardData {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  finance: {
    income: number;
    expenses: number;
    balance: number;
  };
  health: {
    waterIntakeMl: number;
    waterGoalMl: number;
    sleepHours: number;
    workoutMinutes: number;
  };
  shopping: Array<{ id: string; name: string; completed: boolean }>;
  aiAssistant: {
    summary: string;
    suggestion: string;
  };
  calendar: CalendarEvent[];
  notes: Note[];
}

// ==========================================
// HEALTH MODULE TYPES
// ==========================================

export interface HealthProfile {
  id: string;
  userId: string;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  waterGoal: number;
  sleepGoal: number;
  workoutGoal: number;
  cycleGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  quality: number;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  category: string;
  duration: number;
  calories: number | null;
  notes: string | null;
  date: string;
  exercises?: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  bmi: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  schedule: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  remindersEnabled: boolean;
  refillReminder: boolean;
  active: boolean;
  logs?: MedicationLog[];
  createdAt: string;
  updatedAt: string;
}

export interface CycleSymptom {
  id: string;
  cycleId: string;
  name: string;
  severity: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate: string | null;
  cycleLength: number | null;
  symptoms?: CycleSymptom[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PCOSLog {
  id: string;
  userId: string;
  symptoms: string[];
  weight: number | null;
  medicationTaken: boolean;
  waterIntakeMl: number | null;
  exerciseMinutes: number | null;
  stressLevel: number | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface HairLog {
  id: string;
  userId: string;
  routineId: string | null;
  washDone: boolean;
  oilDone: boolean;
  maskDone: boolean;
  hairFallCount: number | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface HairRoutine {
  id: string;
  userId: string;
  name: string;
  washDays: string[];
  oilDays: string[];
  maskDays: string[];
  products: string[];
  active: boolean;
  logs?: HairLog[];
  createdAt: string;
  updatedAt: string;
}

export interface SkinLog {
  id: string;
  userId: string;
  routineId: string | null;
  completed: boolean;
  acneSeverity: string | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkinRoutine {
  id: string;
  userId: string;
  name: string;
  products: string[];
  concerns: string[];
  active: boolean;
  logs?: SkinLog[];
  createdAt: string;
  updatedAt: string;
}

export interface MoodLog {
  id: string;
  userId: string;
  mood: string;
  energyLevel: number;
  stressLevel: number;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthGoal {
  id: string;
  userId: string;
  type: string; // WATER, SLEEP, WORKOUT, WEIGHT
  target: number;
  current: number;
  startDate: string;
  endDate: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthReminder {
  id: string;
  userId: string;
  type: string; // WATER, SLEEP, WORKOUT, MEDICATION, GENERAL
  time: string;
  days: string[];
  enabled: boolean;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthDashboardData {
  profile: HealthProfile | null;
  todayWater: number;
  waterGoal: number;
  todaySleep: SleepLog | null;
  sleepGoal: number;
  todayWorkouts: Workout[];
  workoutProgress: number;
  workoutGoal: number;
  currentWeight: number | null;
  targetWeight: number | null;
  medicationStatus: {
    taken: number;
    total: number;
    list: Array<Medication & { takenToday: boolean }>;
  };
  cycleStatus: {
    currentDay: number | null;
    phase: string | null;
    isPeriodToday: boolean;
    daysUntilPeriod: number | null;
  };
  todayMood: MoodLog | null;
  hairRoutineStatus: {
    washDay: boolean;
    oilDay: boolean;
    maskDay: boolean;
    washDone: boolean;
    oilDone: boolean;
    maskDone: boolean;
  };
  skinRoutineStatus: {
    morningDone: boolean;
    nightDone: boolean;
  };
  upcomingReminders: HealthReminder[];
  weeklySummary: {
    waterIntake: number[];
    sleepDuration: number[];
    workoutMinutes: number[];
  };
}

export interface HealthReportData {
  water: {
    total: number;
    average: number;
    history: WaterLog[];
  };
  sleep: {
    averageDuration: number;
    averageQuality: number;
    history: SleepLog[];
  };
  workout: {
    totalWorkouts: number;
    totalDuration: number;
    history: Workout[];
  };
  weight: {
    initial: number | null;
    current: number | null;
    change: number | null;
    history: WeightLog[];
  };
  medication: {
    adherenceRate: number;
    history: MedicationLog[];
  };
  cycle: {
    averageLength: number;
    history: Cycle[];
  };
  pcos: {
    symptomFrequency: Record<string, number>;
    averageStress: number;
    history: PCOSLog[];
  };
  mood: {
    averageEnergy: number;
    averageStress: number;
    moodCounts: Record<string, number>;
    history: MoodLog[];
  };
  hair: {
    washDoneCount: number;
    hairFallTrend: number[];
    history: HairLog[];
  };
  skin: {
    completionRate: number;
    history: SkinLog[];
  };
}
