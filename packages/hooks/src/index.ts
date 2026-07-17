import { create } from "zustand";
import {
  User,
  Profile,
  Settings,
  Notification,
  ThemeMode,
  Task,
  Subtask,
  Label,
  Habit,
  Goal,
  Milestone,
  Folder,
  Tag,
  Note,
  CalendarEvent,
  TaskFilters,
  TaskSortOption,
  TaskViewMode,
  HealthProfile,
  WaterLog,
  SleepLog,
  Workout,
  WorkoutExercise,
  WeightLog,
  Medication,
  MedicationLog,
  Cycle,
  CycleSymptom,
  PCOSLog,
  HairRoutine,
  HairLog,
  SkinRoutine,
  SkinLog,
  MoodLog,
  HealthGoal,
  HealthReminder,
  HealthDashboardData,
  HealthReportData
} from "@lifesync/types";
import {
  AuthService,
  UserService,
  SettingsService,
  NotificationService,
  TaskService,
  HabitService,
  GoalService,
  NoteService,
  CalendarService,
  HealthProfileService,
  WaterService,
  SleepService,
  WorkoutService,
  WeightService,
  MedicationService,
  WomenHealthService,
  PcosService,
  HairCareService,
  SkinCareService,
  MoodService,
  HealthService
} from "@lifesync/services";

// ==========================================
// AUTH STORE
// ==========================================

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => Promise<boolean>;
  register: (email: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.login(email);
      if (res.success && res.data) {
        set({
          user: res.data.user,
          profile: res.data.profile,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      set({ error: res.message, isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
      return false;
    }
  },

  register: async (email: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AuthService.register(email, fullName);
      if (res.success && res.data) {
        set({
          user: res.data.user,
          profile: res.data.profile,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      set({ error: res.message, isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message || "Registration failed", isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    } catch (err) {
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const res = await AuthService.getCurrentUser();
      if (res.success && res.data) {
        set({
          user: res.data.user,
          profile: res.data.profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      const res = await UserService.updateProfile(updates);
      if (res.success && res.data) {
        set({ profile: res.data });
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
}));

// ==========================================
// THEME STORE
// ==========================================

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme: ThemeMode) => {
    set({ theme });
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (theme === "amoled") {
        root.classList.add("dark", "amoled");
      } else {
        root.classList.add(theme);
      }
      localStorage.setItem("lifesync-theme", theme);
    }
  },
}));

// ==========================================
// NOTIFICATIONS STORE
// ==========================================

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await NotificationService.getNotifications();
      if (res.success && res.data) {
        const unread = res.data.filter((n) => !n.read).length;
        set({ notifications: res.data, unreadCount: unread, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const res = await NotificationService.markAsRead(id);
      if (res.success && res.data) {
        const updatedNotifications = get().notifications.map((n) =>
          n.id === id ? res.data! : n
        );
        const unread = updatedNotifications.filter((n) => !n.read).length;
        set({ notifications: updatedNotifications, unreadCount: unread });
      }
    } catch (err) {}
  },

  markAllAsRead: async () => {
    try {
      const res = await NotificationService.markAllAsRead();
      if (res.success && res.data) {
        set({ notifications: res.data, unreadCount: 0 });
      }
    } catch (err) {}
  },

  deleteNotification: async (id: string) => {
    try {
      const res = await NotificationService.deleteNotification(id);
      if (res.success) {
        const updatedNotifications = get().notifications.filter((n) => n.id !== id);
        const unread = updatedNotifications.filter((n) => !n.read).length;
        set({ notifications: updatedNotifications, unreadCount: unread });
      }
    } catch (err) {}
  },
}));

// ==========================================
// PRODUCTIVITY: TASKS STORE
// ==========================================

interface TaskState {
  tasks: Task[];
  labels: Label[];
  filters: TaskFilters;
  sort: TaskSortOption;
  viewMode: TaskViewMode;
  isLoading: boolean;
  
  fetchTasks: () => Promise<void>;
  fetchLabels: () => Promise<void>;
  createTask: (data: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  
  // Subtasks actions
  createSubtask: (taskId: string, title: string) => Promise<boolean>;
  toggleSubtask: (id: string, completed: boolean) => Promise<boolean>;
  deleteSubtask: (id: string) => Promise<boolean>;
  
  // Labels actions
  createLabel: (name: string, color: string) => Promise<boolean>;
  
  // UI preferences
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSort: (sort: TaskSortOption) => void;
  setViewMode: (mode: TaskViewMode) => void;
  resetFilters: () => void;
}

const defaultFilters: TaskFilters = {
  search: "",
  status: null,
  priority: null,
  labelIds: null,
  goalId: null,
  dueDateStart: null,
  dueDateEnd: null,
  pinnedOnly: false,
  favoriteOnly: false,
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  labels: [],
  filters: defaultFilters,
  sort: "NEWEST",
  viewMode: "list",
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await TaskService.getTasks(get().filters, get().sort);
      if (res.success && res.data) {
        set({ tasks: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  fetchLabels: async () => {
    try {
      const res = await TaskService.getLabels();
      if (res.success && res.data) {
        set({ labels: res.data });
      }
    } catch (err) {}
  },

  createTask: async (data) => {
    try {
      const res = await TaskService.createTask(data);
      if (res.success) {
        await get().fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const res = await TaskService.updateTask(id, updates);
      if (res.success) {
        await get().fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteTask: async (id) => {
    try {
      const res = await TaskService.deleteTask(id);
      if (res.success) {
        await get().fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  createSubtask: async (taskId, title) => {
    try {
      const res = await TaskService.createSubtask(taskId, title);
      if (res.success) {
        await get().fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  toggleSubtask: async (id, completed) => {
    try {
      const res = await TaskService.updateSubtask(id, { completed });
      if (res.success) {
        await get().fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteSubtask: async (id) => {
    try {
      const res = await TaskService.deleteSubtask(id);
      if (res.success) {
        await get().fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  createLabel: async (name, color) => {
    try {
      const res = await TaskService.createLabel(name, color);
      if (res.success) {
        await get().fetchLabels();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
    get().fetchTasks();
  },

  setSort: (sort) => {
    set({ sort });
    get().fetchTasks();
  },

  setViewMode: (viewMode) => set({ viewMode }),

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchTasks();
  },
}));

// ==========================================
// PRODUCTIVITY: HABITS STORE
// ==========================================

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  
  fetchHabits: () => Promise<void>;
  createHabit: (data: Omit<Habit, "id" | "userId" | "streak" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<boolean>;
  deleteHabit: (id: string) => Promise<boolean>;
  toggleHabit: (id: string, dateStr: string) => Promise<boolean>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,

  fetchHabits: async () => {
    set({ isLoading: true });
    try {
      const res = await HabitService.getHabits();
      if (res.success && res.data) {
        set({ habits: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  createHabit: async (data) => {
    try {
      const res = await HabitService.createHabit(data);
      if (res.success) {
        await get().fetchHabits();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  updateHabit: async (id, updates) => {
    try {
      const res = await HabitService.updateHabit(id, updates);
      if (res.success) {
        await get().fetchHabits();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteHabit: async (id) => {
    try {
      const res = await HabitService.deleteHabit(id);
      if (res.success) {
        await get().fetchHabits();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  toggleHabit: async (id, dateStr) => {
    try {
      const res = await HabitService.toggleHabitCompletion(id, dateStr);
      if (res.success) {
        await get().fetchHabits();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
}));

// ==========================================
// PRODUCTIVITY: GOALS STORE
// ==========================================

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  
  fetchGoals: () => Promise<void>;
  createGoal: (data: Omit<Goal, "id" | "userId" | "progress" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  
  // Milestones
  createMilestone: (goalId: string, title: string) => Promise<boolean>;
  toggleMilestone: (id: string) => Promise<boolean>;
  deleteMilestone: (id: string) => Promise<boolean>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const res = await GoalService.getGoals();
      if (res.success && res.data) {
        set({ goals: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  createGoal: async (data) => {
    try {
      const res = await GoalService.createGoal(data);
      if (res.success) {
        await get().fetchGoals();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const res = await GoalService.updateGoal(id, updates);
      if (res.success) {
        await get().fetchGoals();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteGoal: async (id) => {
    try {
      const res = await GoalService.deleteGoal(id);
      if (res.success) {
        await get().fetchGoals();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  createMilestone: async (goalId, title) => {
    try {
      const res = await GoalService.createMilestone(goalId, title);
      if (res.success) {
        await get().fetchGoals();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  toggleMilestone: async (id) => {
    try {
      const res = await GoalService.toggleMilestone(id);
      if (res.success) {
        await get().fetchGoals();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteMilestone: async (id) => {
    try {
      const res = await GoalService.deleteMilestone(id);
      if (res.success) {
        await get().fetchGoals();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
}));

// ==========================================
// PRODUCTIVITY: NOTES STORE
// ==========================================

interface NoteState {
  notes: Note[];
  folders: Folder[];
  activeFolderId: string | null;
  isLoading: boolean;
  
  fetchNotes: () => Promise<void>;
  fetchFolders: () => Promise<void>;
  createNote: (data: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  
  createFolder: (name: string) => Promise<boolean>;
  setActiveFolderId: (folderId: string | null) => void;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  folders: [],
  activeFolderId: null,
  isLoading: false,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const res = await NoteService.getNotes();
      if (res.success && res.data) {
        set({ notes: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  fetchFolders: async () => {
    try {
      const res = await NoteService.getFolders();
      if (res.success && res.data) {
        set({ folders: res.data });
      }
    } catch (err) {}
  },

  createNote: async (data) => {
    try {
      const res = await NoteService.createNote(data);
      if (res.success) {
        await get().fetchNotes();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  updateNote: async (id, updates) => {
    try {
      const res = await NoteService.updateNote(id, updates);
      if (res.success) {
        await get().fetchNotes();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteNote: async (id) => {
    try {
      const res = await NoteService.deleteNote(id);
      if (res.success) {
        await get().fetchNotes();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  createFolder: async (name) => {
    try {
      const res = await NoteService.createFolder(name);
      if (res.success) {
        await get().fetchFolders();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  setActiveFolderId: (activeFolderId) => set({ activeFolderId }),
}));

// ==========================================
// PRODUCTIVITY: CALENDAR STORE
// ==========================================

interface CalendarState {
  events: CalendarEvent[];
  activeDate: string; // ISO date string
  calendarViewMode: "day" | "week" | "month" | "agenda";
  isLoading: boolean;
  
  fetchEvents: () => Promise<void>;
  createEvent: (data: Omit<CalendarEvent, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  
  setActiveDate: (dateStr: string) => void;
  setCalendarViewMode: (mode: "day" | "week" | "month" | "agenda") => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  activeDate: new Date().toISOString(),
  calendarViewMode: "month",
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const res = await CalendarService.getEvents();
      if (res.success && res.data) {
        set({ events: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  createEvent: async (data) => {
    try {
      const res = await CalendarService.createEvent(data);
      if (res.success) {
        await get().fetchEvents();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const res = await CalendarService.updateEvent(id, updates);
      if (res.success) {
        await get().fetchEvents();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  deleteEvent: async (id) => {
    try {
      const res = await CalendarService.deleteEvent(id);
      if (res.success) {
        await get().fetchEvents();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  setActiveDate: (activeDate) => set({ activeDate }),
  setCalendarViewMode: (calendarViewMode) => set({ calendarViewMode }),
}));

// ==========================================
// AI PLACEHOLDER HOOKS (DUMMY HOOKS PREP)
// ==========================================

export function useAIPlanner() {
  return {
    generateDailySchedule: async () => {
      // Simulate AI latency
      await new Promise((r) => setTimeout(r, 1200));
      return {
        summary: "Based on your circadian rhythm and 2 High priority work tasks, we suggest blocking 9:00 AM - 11:30 AM for deep creative work. Avoid scheduling meetings during this period.",
        timeBlocks: [
          { time: "09:00 - 10:30", label: "Q3 roadmap review & budgeting" },
          { time: "10:30 - 11:30", label: "Break & exercise checkin" },
        ],
      };
    },
    isLoading: false,
  };
}

export function useTaskSuggestions() {
  return {
    suggestPriorities: (tasks: Task[]) => {
      const todoTasks = tasks.filter((t) => t.status !== "COMPLETED");
      if (todoTasks.length === 0) return [];
      // AI suggests prioritizing tasks with dueDate or HIGH/URGENT levels
      return todoTasks
        .filter((t) => t.priority === "HIGH" || t.priority === "URGENT" || t.dueDate)
        .slice(0, 2);
    },
  };
}

export function useGoalSuggestions() {
  return {
    suggestMilestones: (goalTitle: string) => {
      const title = goalTitle.toLowerCase();
      if (title.includes("read") || title.includes("book")) {
        return ["Select a book list", "Read 10 pages daily", "Draft 1-page summaries"];
      }
      if (title.includes("code") || title.includes("launch") || title.includes("dev")) {
        return ["Establish repository structure", "Create feature components", "Write end-to-end tests"];
      }
      return ["Outline initial task checklist", "Define timeline deadlines", "Schedule weekly alignment reviews"];
    },
  };
}

// ==========================================
// HEALTH STORE & OFFLINE QUEUE
// ==========================================

export interface OfflineLog {
  id: string;
  type: "water" | "sleep" | "workout" | "weight" | "medication" | "medicationLog" | "cycle" | "pcos" | "hair" | "hairLog" | "skin" | "skinLog" | "mood";
  payload: any;
  timestamp: string;
}

interface HealthState {
  dashboardData: HealthDashboardData | null;
  reportData: HealthReportData | null;
  offlineQueue: OfflineLog[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchReport: () => Promise<void>;
  
  logWater: (amount: number, date?: string) => Promise<void>;
  logSleep: (logData: { startTime: string; endTime: string; quality: number; notes?: string | null; date?: string }) => Promise<void>;
  logWorkout: (workoutData: { title: string; category: string; duration: number; calories?: number | null; notes?: string | null; date?: string; exercises?: any[] }) => Promise<void>;
  logWeight: (weightData: { weight: number; chest?: number | null; waist?: number | null; hips?: number | null; date?: string }) => Promise<void>;
  logMedication: (medData: { name: string; dosage: string; schedule: string; frequency: string; startDate: string; endDate?: string | null; remindersEnabled?: boolean; refillReminder?: boolean }) => Promise<void>;
  takeMedication: (logData: { medicationId: string; status?: string; notes?: string | null; takenAt?: string }) => Promise<void>;
  logCycle: (cycleData: { startDate: string; endDate?: string | null; notes?: string | null; symptoms?: any[] }) => Promise<void>;
  logPcos: (logData: { symptoms: string[]; weight?: number | null; medicationTaken?: boolean; waterIntakeMl?: number | null; exerciseMinutes?: number | null; stressLevel?: number | null; notes?: string | null; date?: string }) => Promise<void>;
  logHairRoutine: (routineData: { name: string; washDays: string[]; oilDays: string[]; maskDays: string[]; products: string[] }) => Promise<void>;
  logHairActivity: (logData: { routineId?: string | null; washDone: boolean; oilDone: boolean; maskDone: boolean; hairFallCount?: number | null; notes?: string | null; date?: string }) => Promise<void>;
  logSkinRoutine: (routineData: { name: string; products: string[]; concerns: string[] }) => Promise<void>;
  logSkinActivity: (logData: { routineId?: string | null; completed: boolean; acneSeverity?: string | null; notes?: string | null; date?: string }) => Promise<void>;
  logMood: (logData: { mood: string; energyLevel: number; stressLevel: number; notes?: string | null; date?: string }) => Promise<void>;

  addOfflineLog: (type: OfflineLog["type"], payload: any) => void;
  syncOfflineQueue: () => Promise<void>;
  clearOfflineQueue: () => void;
  updateProfile: (updates: Partial<HealthProfile>) => Promise<void>;
}

export const useHealthStore = create<HealthState>((set, get) => ({
  dashboardData: null,
  reportData: null,
  offlineQueue: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await HealthService.getHealthDashboard();
      if (res.success && res.data) {
        set({ dashboardData: res.data, isLoading: false });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load health dashboard", isLoading: false });
    }
  },

  fetchReport: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await HealthService.generateHealthReport();
      if (res.success && res.data) {
        set({ reportData: res.data, isLoading: false });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to generate health report", isLoading: false });
    }
  },

  logWater: async (amount: number, date?: string) => {
    // Optimistic Update
    const currentDash = get().dashboardData;
    if (currentDash) {
      set({
        dashboardData: {
          ...currentDash,
          todayWater: currentDash.todayWater + amount,
        }
      });
    }

    try {
      const res = await WaterService.addLog(amount, date);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      // Rollback on error in a real app, here we just re-fetch
      get().fetchDashboard();
    }
  },

  logSleep: async (logData) => {
    try {
      const res = await SleepService.addLog(logData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  logWorkout: async (workoutData) => {
    try {
      const res = await WorkoutService.addWorkout(workoutData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  logWeight: async (weightData) => {
    // Optimistic Update
    const currentDash = get().dashboardData;
    if (currentDash) {
      set({
        dashboardData: {
          ...currentDash,
          currentWeight: weightData.weight,
        }
      });
    }

    try {
      const res = await WeightService.addLog(weightData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchDashboard();
    }
  },

  logMedication: async (medData) => {
    try {
      const res = await MedicationService.addMedication(medData);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  takeMedication: async (logData) => {
    // Optimistic Update
    const currentDash = get().dashboardData;
    if (currentDash) {
      const updatedList = currentDash.medicationStatus.list.map(m =>
        m.id === logData.medicationId ? { ...m, takenToday: true } : m
      );
      set({
        dashboardData: {
          ...currentDash,
          medicationStatus: {
            ...currentDash.medicationStatus,
            taken: currentDash.medicationStatus.taken + 1,
            list: updatedList,
          }
        }
      });
    }

    try {
      const res = await MedicationService.logMedication(logData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchDashboard();
    }
  },

  logCycle: async (cycleData) => {
    try {
      const res = await WomenHealthService.addCycle(cycleData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  logPcos: async (logData) => {
    try {
      const res = await PcosService.addLog(logData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  logHairRoutine: async (routineData) => {
    try {
      const res = await HairCareService.addRoutine(routineData);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  logHairActivity: async (logData) => {
    try {
      const res = await HairCareService.logHairActivity(logData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  logSkinRoutine: async (routineData) => {
    try {
      const res = await SkinCareService.addRoutine(routineData);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  logSkinActivity: async (logData) => {
    try {
      const res = await SkinCareService.logSkinActivity(logData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  logMood: async (logData) => {
    // Optimistic Update
    const currentDash = get().dashboardData;
    if (currentDash) {
      const tempMoodLog: MoodLog = {
        id: "temp-mood",
        userId: "u-1",
        mood: logData.mood,
        energyLevel: logData.energyLevel,
        stressLevel: logData.stressLevel,
        notes: logData.notes || null,
        date: logData.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({
        dashboardData: {
          ...currentDash,
          todayMood: tempMoodLog,
        }
      });
    }

    try {
      const res = await MoodService.addLog(logData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchDashboard();
    }
  },

  addOfflineLog: (type, payload) => {
    const newLog: OfflineLog = {
      id: "offline-" + Math.floor(Math.random() * 100000),
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    
    // Apply optimistic updates directly to Zustand local state
    const currentDash = get().dashboardData;
    if (currentDash) {
      if (type === "water") {
        set({
          dashboardData: {
            ...currentDash,
            todayWater: currentDash.todayWater + (payload.amount || payload),
          }
        });
      } else if (type === "weight") {
        set({
          dashboardData: {
            ...currentDash,
            currentWeight: payload.weight || payload,
          }
        });
      }
    }

    set({ offlineQueue: [...get().offlineQueue, newLog] });
  },

  syncOfflineQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;
    
    set({ isLoading: true });
    
    for (const item of queue) {
      try {
        if (item.type === "water") {
          await WaterService.addLog(item.payload.amount || item.payload, item.payload.date);
        } else if (item.type === "sleep") {
          await SleepService.addLog(item.payload);
        } else if (item.type === "workout") {
          await WorkoutService.addWorkout(item.payload);
        } else if (item.type === "weight") {
          await WeightService.addLog(item.payload);
        } else if (item.type === "medication") {
          await MedicationService.addMedication(item.payload);
        } else if (item.type === "medicationLog") {
          await MedicationService.logMedication(item.payload);
        } else if (item.type === "cycle") {
          await WomenHealthService.addCycle(item.payload);
        } else if (item.type === "pcos") {
          await PcosService.addLog(item.payload);
        } else if (item.type === "hairLog") {
          await HairCareService.logHairActivity(item.payload);
        } else if (item.type === "skinLog") {
          await SkinCareService.logSkinActivity(item.payload);
        } else if (item.type === "mood") {
          await MoodService.addLog(item.payload);
        }
      } catch (err) {
        console.error("Failed to sync offline log:", item, err);
      }
    }

    set({ offlineQueue: [], isLoading: false });
    await get().fetchDashboard();
    await get().fetchReport();
  },

  clearOfflineQueue: () => {
    set({ offlineQueue: [] });
  },

  updateProfile: async (updates) => {
    try {
      const res = await HealthProfileService.updateProfile(updates);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {}
  }
}));

// ==========================================
// AI PLACEHOLDERS HOOKS
// ==========================================

export function useHealthCoach() {
  return {
    getCoachAdvice: async () => {
      return "Keep hydrating! You're 500ml away from your water goal today. Your sleep quality has improved by 12% this week.";
    },
    isLoading: false,
  };
}

export function useWorkoutSuggestions() {
  return {
    getSuggestions: async (category?: string) => {
      const base = [
        { title: "Core Blast", duration: 15, difficulty: "Medium", category: "Strength" },
        { title: "HIIT Cardio Run", duration: 25, difficulty: "High", category: "Cardio" },
        { title: "Gentle Evening Flow", duration: 20, difficulty: "Easy", category: "Yoga" },
      ];
      if (category) {
        return base.filter(s => s.category.toLowerCase() === category.toLowerCase());
      }
      return base;
    },
    isLoading: false,
  };
}

export function useWaterReminder() {
  return {
    remindersEnabled: true,
    reminderIntervalMinutes: 120,
    message: "Time to drink a glass of water to maintain your streak!",
  };
}

export function useSleepAnalysis() {
  return {
    analyzeSleep: (sleepLogs: SleepLog[]) => {
      if (sleepLogs.length === 0) return "No sleep data logged yet.";
      const totalQuality = sleepLogs.reduce((sum, s) => sum + s.quality, 0);
      const avgQuality = totalQuality / sleepLogs.length;
      if (avgQuality >= 4) {
        return "Excellent consistency! Your sleep quality is high. Keep your wake-up time within a 30-minute window.";
      }
      return "Your sleep quality shows some variance. Avoid screens for 1 hour before bed to increase deep sleep.";
    },
  };
}

