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
