import { create } from "zustand";
import {
  User,
  Profile,
  Settings,
  Notification,
  ThemeMode,
  AgentType,
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
  HealthReportData,
  Account,
  Transaction,
  Income,
  Expense,
  Budget,
  BudgetCategory,
  SavingsGoal,
  Bill,
  Subscription,
  TransactionCategory,
  TransactionTag,
  RecurringTransaction,
  FinancialReport,
  FinanceDashboardData,
  FinanceReportData,
  AccountType,
  TransactionType,
  RecurringFrequency,
  BillStatus,
  SubscriptionStatus,
  ReportType,
  Category,
  ShoppingList,
  ShoppingItem,
  MonthlyEssential,
  PantryItem,
  WishlistItem,
  PurchaseHistory,
  ShoppingReport,
  ShoppingTemplate,
  ShoppingDashboardData,
  ShoppingReportData,
  Integration,
  Provider as IntegrationProvider,
  Connection as ProviderConnection,
  OAuthToken,
  RefreshToken,
  Webhook,
  SyncJob,
  SyncLog,
  Permission,
  ProviderSetting,
  IntegrationAudit,
  IntegrationDashboardData,
  Conversation,
  Message,
  AgentInfo,
  MemoryItem
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
  HealthService,
  AccountService,
  TransactionService,
  BudgetService,
  SavingsService,
  BillService,
  SubscriptionService,
  FinanceService,
  ShoppingCategoryService,
  ShoppingListService,
  ShoppingItemService,
  MonthlyEssentialService,
  PantryService,
  WishlistService,
  PurchaseHistoryService,
  ShoppingReportService,
  IntegrationDashboardService,
  ConnectionService,
  SyncService,
  WebhookService,
  UploadService,
  ProviderService
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

// ==========================================
// PERSONAL FINANCE STORE & OFFLINE QUEUE
// ==========================================

export interface OfflineFinanceLog {
  id: string;
  type: "account" | "transaction" | "budget" | "goal" | "contribution" | "bill" | "subscription";
  payload: any;
  timestamp: string;
}

interface FinanceState {
  dashboardData: FinanceDashboardData | null;
  reportData: FinanceReportData | null;
  accounts: Account[];
  categories: TransactionCategory[];
  tags: TransactionTag[];
  offlineQueue: OfflineFinanceLog[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchReport: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;

  addAccount: (name: string, type: AccountType, balance: number, currency?: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  addTransaction: (txData: { accountId: string; amount: number; type: TransactionType; categoryId?: string | null; description?: string | null; toAccountId?: string | null; date?: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  addBudget: (budgetData: { name: string; amount: number; startDate: string; endDate: string; categories?: { categoryId: string; limitAmount: number }[] }) => Promise<void>;
  
  addSavingsGoal: (goalData: { name: string; targetAmount: number; currentAmount?: number; deadline?: string | null }) => Promise<void>;
  addContribution: (goalId: string, amount: number) => Promise<void>;

  addBill: (billData: { name: string; amount: number; dueDate: string; isRecurring?: boolean; recurringInterval?: string | null }) => Promise<void>;
  payBill: (id: string) => Promise<void>;

  addSubscription: (subData: { name: string; amount: number; billingCycle: string; renewalDate: string; categoryId?: string | null }) => Promise<void>;

  addOfflineLog: (type: OfflineFinanceLog["type"], payload: any) => void;
  syncOfflineQueue: () => Promise<void>;
  clearOfflineQueue: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  dashboardData: null,
  reportData: null,
  accounts: [],
  categories: [],
  tags: [],
  offlineQueue: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await FinanceService.getFinanceDashboard();
      if (res.success && res.data) {
        set({ dashboardData: res.data, isLoading: false });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load finance dashboard", isLoading: false });
    }
  },

  fetchReport: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await FinanceService.generateFinanceReport();
      if (res.success && res.data) {
        set({ reportData: res.data, isLoading: false });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load finance report", isLoading: false });
    }
  },

  fetchAccounts: async () => {
    try {
      const res = await AccountService.getAccounts();
      if (res.success && res.data) {
        set({ accounts: res.data });
      }
    } catch (err) {}
  },

  fetchCategories: async () => {
    try {
      const res = await TransactionService.getCategories();
      if (res.success && res.data) {
        set({ categories: res.data });
      }
    } catch (err) {}
  },

  fetchTags: async () => {
    try {
      const res = await TransactionService.getTags();
      if (res.success && res.data) {
        set({ tags: res.data });
      }
    } catch (err) {}
  },

  addAccount: async (name, type, balance, currency) => {
    // Optimistic Update
    const currentAccs = get().accounts;
    const tempAcc: Account = {
      id: "temp-" + Math.random(),
      userId: "u-1",
      name,
      type,
      balance,
      currency: currency || "USD",
      isDefault: currentAccs.length === 0,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ accounts: [...currentAccs, tempAcc] });

    try {
      const res = await AccountService.addAccount({ name, type, balance, currency });
      if (res.success) {
        get().fetchAccounts();
        get().fetchDashboard();
      }
    } catch (err) {
      get().fetchAccounts();
    }
  },

  deleteAccount: async (id) => {
    // Optimistic Update
    set({ accounts: get().accounts.filter(a => a.id !== id) });
    try {
      const res = await AccountService.deleteAccount(id);
      if (res.success) {
        get().fetchAccounts();
        get().fetchDashboard();
      }
    } catch (err) {
      get().fetchAccounts();
    }
  },

  addTransaction: async (txData) => {
    // Optimistic Update Dashboard Values
    const currentDash = get().dashboardData;
    if (currentDash) {
      const balanceDelta = txData.type === "INCOME" ? txData.amount : -txData.amount;
      const incomeDelta = txData.type === "INCOME" ? txData.amount : 0;
      const expenseDelta = txData.type === "EXPENSE" ? txData.amount : 0;

      set({
        dashboardData: {
          ...currentDash,
          currentBalance: currentDash.currentBalance + balanceDelta,
          monthlyIncome: currentDash.monthlyIncome + incomeDelta,
          monthlyExpenses: currentDash.monthlyExpenses + expenseDelta,
          remainingBudget: Math.max(0, currentDash.remainingBudget - expenseDelta),
        }
      });
    }

    try {
      const res = await TransactionService.addTransaction(txData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
        get().fetchAccounts();
      }
    } catch (err) {
      get().fetchDashboard();
    }
  },

  deleteTransaction: async (id) => {
    try {
      const res = await TransactionService.deleteTransaction(id);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
        get().fetchAccounts();
      }
    } catch (err) {}
  },

  addBudget: async (budgetData) => {
    try {
      const res = await BudgetService.addBudget(budgetData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  addSavingsGoal: async (goalData) => {
    try {
      const res = await SavingsService.addGoal(goalData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  addContribution: async (goalId, amount) => {
    // Optimistic Update goal progress
    const currentDash = get().dashboardData;
    if (currentDash) {
      // Delta to balance
      set({
        dashboardData: {
          ...currentDash,
          currentBalance: currentDash.currentBalance - amount,
        }
      });
    }

    try {
      const res = await SavingsService.addContribution(goalId, amount);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchDashboard();
    }
  },

  addBill: async (billData) => {
    try {
      const res = await BillService.addBill(billData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  payBill: async (id) => {
    try {
      const res = await BillService.payBill(id);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
        get().fetchAccounts();
      }
    } catch (err) {}
  },

  addSubscription: async (subData) => {
    try {
      const res = await SubscriptionService.addSubscription(subData);
      if (res.success) {
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  addOfflineLog: (type, payload) => {
    const newLog: OfflineFinanceLog = {
      id: "offline-f-" + Math.floor(Math.random() * 100000),
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    // Optimistically update values in Zustand
    const currentDash = get().dashboardData;
    if (currentDash && type === "transaction") {
      const balanceDelta = payload.type === "INCOME" ? payload.amount : -payload.amount;
      const incomeDelta = payload.type === "INCOME" ? payload.amount : 0;
      const expenseDelta = payload.type === "EXPENSE" ? payload.amount : 0;

      set({
        dashboardData: {
          ...currentDash,
          currentBalance: currentDash.currentBalance + balanceDelta,
          monthlyIncome: currentDash.monthlyIncome + incomeDelta,
          monthlyExpenses: currentDash.monthlyExpenses + expenseDelta,
          remainingBudget: Math.max(0, currentDash.remainingBudget - expenseDelta),
        }
      });
    }

    set({ offlineQueue: [...get().offlineQueue, newLog] });
  },

  syncOfflineQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;

    set({ isLoading: true });

    for (const item of queue) {
      try {
        if (item.type === "account") {
          await AccountService.addAccount(item.payload);
        } else if (item.type === "transaction") {
          await TransactionService.addTransaction(item.payload);
        } else if (item.type === "budget") {
          await BudgetService.addBudget(item.payload);
        } else if (item.type === "goal") {
          await SavingsService.addGoal(item.payload);
        } else if (item.type === "contribution") {
          await SavingsService.addContribution(item.payload.goalId, item.payload.amount);
        } else if (item.type === "bill") {
          await BillService.addBill(item.payload);
        } else if (item.type === "subscription") {
          await SubscriptionService.addSubscription(item.payload);
        }
      } catch (err) {
        console.error("Failed to sync offline finance entry:", item, err);
      }
    }

    set({ offlineQueue: [], isLoading: false });
    await get().fetchDashboard();
    await get().fetchReport();
    await get().fetchAccounts();
  },

  clearOfflineQueue: () => {
    set({ offlineQueue: [] });
  }
}));

// ==========================================
// AI PLACEHOLDERS HOOKS
// ==========================================

export function useBudgetAdvisor() {
  return {
    getAdvice: async () => {
      return "Based on your current July spending rate, you will exceed your grocery budget limit of $400 by 12%. Consider shifting $50 from leisure tags.";
    },
    isLoading: false,
  };
}

export function useSpendingInsights() {
  return {
    getTopMerchant: () => "Whole Foods Market ($120.00)",
    getMonthlyEfficiency: () => "You saved 64% of your total freelance/salary cash flow this month. Keep it up!",
  };
}

export function useSavingsPlanner() {
  return {
    planContribution: (target: number, current: number, daysLeft: number) => {
      const remaining = Math.max(0, target - current);
      const daily = remaining / (daysLeft || 1);
      return `To hit your goal on time, save at least $${(daily * 7).toFixed(2)} weekly.`;
    },
  };
}

export function useExpensePrediction() {
  return {
    predictNextMonthExpenses: async () => {
      return [
        { category: "Utilities", predictedAmount: 85.0 },
        { category: "Food", predictedAmount: 140.0 },
        { category: "Subscription renewals", predictedAmount: 36.98 },
      ];
    },
  };
}

// ==========================================
// SHOPPING STORE & OFFLINE QUEUE
// ==========================================

export interface OfflineShoppingLog {
  id: string;
  type: "list" | "item" | "essential" | "pantry" | "wishlist" | "history" | "item_check" | "pantry_quantity" | "essential_check" | "wishlist_check";
  payload: any;
  timestamp: string;
}

interface ShoppingState {
  shoppingDashboardData: ShoppingDashboardData | null;
  shoppingReportData: ShoppingReportData | null;
  shoppingLists: ShoppingList[];
  shoppingCategories: Category[];
  pantryItems: PantryItem[];
  wishlistItems: WishlistItem[];
  monthlyEssentials: MonthlyEssential[];
  purchaseHistory: PurchaseHistory[];
  offlineQueue: OfflineShoppingLog[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchReport: () => Promise<void>;
  fetchLists: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPantry: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  fetchEssentials: () => Promise<void>;
  fetchHistory: () => Promise<void>;

  addList: (name: string, color?: string | null, icon?: string | null) => Promise<void>;
  renameList: (id: string, name: string) => Promise<void>;
  archiveList: (id: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;

  addItem: (listId: string, name: string, quantity?: number, unit?: string, price?: number, categoryId?: string | null, notes?: string | null, isFavorite?: boolean) => Promise<void>;
  updateItem: (id: string, data: { name?: string; quantity?: number; unit?: string; price?: number; isCompleted?: boolean; isFavorite?: boolean; notes?: string | null; categoryId?: string | null }) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  addEssential: (name: string, targetQuantity: number, unit: string, estimatedPrice: number, categoryId?: string | null) => Promise<void>;
  checkEssential: (id: string, isCompleted: boolean) => Promise<void>;

  addPantryItem: (name: string, currentQuantity: number, minimumQuantity: number, expiryDate?: string | null, categoryId?: string | null) => Promise<void>;
  updatePantryQuantity: (id: string, currentQuantity: number) => Promise<void>;

  addWishlistItem: (name: string, desiredPrice: number, priority: string, notes?: string | null, categoryId?: string | null) => Promise<void>;
  markWishlistPurchased: (id: string, isPurchased: boolean) => Promise<void>;

  logPurchase: (storeName: string, totalAmount: number, itemsCount: number, purchaseDate?: string, details?: string | null) => Promise<void>;

  addOfflineLog: (type: OfflineShoppingLog["type"], payload: any) => void;
  syncOfflineQueue: () => Promise<void>;
  clearOfflineQueue: () => void;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  shoppingDashboardData: null,
  shoppingReportData: null,
  shoppingLists: [],
  shoppingCategories: [],
  pantryItems: [],
  wishlistItems: [],
  monthlyEssentials: [],
  purchaseHistory: [],
  offlineQueue: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await ShoppingReportService.getShoppingDashboard();
      if (res.success && res.data) {
        set({ shoppingDashboardData: res.data, isLoading: false });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load dashboard data", isLoading: false });
    }
  },

  fetchReport: async () => {
    try {
      const res = await ShoppingReportService.generateShoppingReport();
      if (res.success && res.data) {
        set({ shoppingReportData: res.data });
      }
    } catch (err) {}
  },

  fetchLists: async () => {
    try {
      const res = await ShoppingListService.getLists();
      if (res.success && res.data) {
        set({ shoppingLists: res.data });
      }
    } catch (err) {}
  },

  fetchCategories: async () => {
    try {
      const res = await ShoppingCategoryService.getCategories();
      if (res.success && res.data) {
        set({ shoppingCategories: res.data });
      }
    } catch (err) {}
  },

  fetchPantry: async () => {
    try {
      const res = await PantryService.getPantry();
      if (res.success && res.data) {
        set({ pantryItems: res.data });
      }
    } catch (err) {}
  },

  fetchWishlist: async () => {
    try {
      const res = await WishlistService.getWishlist();
      if (res.success && res.data) {
        set({ wishlistItems: res.data });
      }
    } catch (err) {}
  },

  fetchEssentials: async () => {
    try {
      const res = await MonthlyEssentialService.getEssentials();
      if (res.success && res.data) {
        set({ monthlyEssentials: res.data });
      }
    } catch (err) {}
  },

  fetchHistory: async () => {
    try {
      const res = await PurchaseHistoryService.getHistory();
      if (res.success && res.data) {
        set({ purchaseHistory: res.data });
      }
    } catch (err) {}
  },

  addList: async (name, color, icon) => {
    // Optimistic Update
    const currentLists = get().shoppingLists;
    const temp: ShoppingList = {
      id: "temp-list-" + Math.random(),
      userId: "u-1",
      name,
      color: color || "#6B7280",
      icon: icon || "shopping-cart",
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: []
    };
    set({ shoppingLists: [...currentLists, temp] });

    try {
      const res = await ShoppingListService.addList({ name, color, icon });
      if (res.success) {
        get().fetchLists();
      }
    } catch (err) {
      get().fetchLists();
    }
  },

  renameList: async (id, name) => {
    set({
      shoppingLists: get().shoppingLists.map(l => l.id === id ? { ...l, name } : l)
    });
    try {
      const res = await ShoppingListService.renameList(id, name);
      if (res.success) {
        get().fetchLists();
      }
    } catch (err) {
      get().fetchLists();
    }
  },

  archiveList: async (id) => {
    set({
      shoppingLists: get().shoppingLists.filter(l => l.id !== id)
    });
    try {
      const res = await ShoppingListService.archiveList(id);
      if (res.success) {
        get().fetchLists();
      }
    } catch (err) {
      get().fetchLists();
    }
  },

  deleteList: async (id) => {
    set({
      shoppingLists: get().shoppingLists.filter(l => l.id !== id)
    });
    try {
      const res = await ShoppingListService.deleteList(id);
      if (res.success) {
        get().fetchLists();
        get().fetchDashboard();
      }
    } catch (err) {
      get().fetchLists();
    }
  },

  addItem: async (listId, name, quantity, unit, price, categoryId, notes, isFavorite) => {
    try {
      const res = await ShoppingItemService.addItem({
        listId,
        name,
        quantity,
        unit,
        price,
        categoryId,
        notes,
        isFavorite
      });
      if (res.success) {
        get().fetchLists();
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  updateItem: async (id, data) => {
    // Optimistic item check toggle
    if (data.isCompleted !== undefined) {
      set({
        shoppingLists: get().shoppingLists.map(list => ({
          ...list,
          items: list.items?.map(i => i.id === id ? { ...i, isCompleted: data.isCompleted!, purchasedAt: data.isCompleted ? new Date().toISOString() : null } : i)
        }))
      });
    }

    try {
      const res = await ShoppingItemService.updateItem(id, data);
      if (res.success) {
        get().fetchLists();
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchLists();
    }
  },

  deleteItem: async (id) => {
    try {
      const res = await ShoppingItemService.deleteItem(id);
      if (res.success) {
        get().fetchLists();
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  addEssential: async (name, targetQuantity, unit, estimatedPrice, categoryId) => {
    try {
      const res = await MonthlyEssentialService.addEssential({
        name,
        targetQuantity,
        unit,
        estimatedPrice,
        categoryId
      });
      if (res.success) {
        get().fetchEssentials();
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  checkEssential: async (id, isCompleted) => {
    set({
      monthlyEssentials: get().monthlyEssentials.map(e => e.id === id ? { ...e, isCompleted } : e)
    });

    try {
      const res = await MonthlyEssentialService.checkEssential(id, isCompleted);
      if (res.success) {
        get().fetchEssentials();
        get().fetchDashboard();
      }
    } catch (err) {
      get().fetchEssentials();
    }
  },

  addPantryItem: async (name, currentQuantity, minimumQuantity, expiryDate, categoryId) => {
    try {
      const res = await PantryService.addPantryItem({
        name,
        currentQuantity,
        minimumQuantity,
        expiryDate,
        categoryId
      });
      if (res.success) {
        get().fetchPantry();
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  updatePantryQuantity: async (id, currentQuantity) => {
    set({
      pantryItems: get().pantryItems.map(p => p.id === id ? { ...p, currentQuantity } : p)
    });

    try {
      const res = await PantryService.updateQuantity(id, currentQuantity);
      if (res.success) {
        get().fetchPantry();
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchPantry();
    }
  },

  addWishlistItem: async (name, desiredPrice, priority, notes, categoryId) => {
    try {
      const res = await WishlistService.addWishlistItem({
        name,
        desiredPrice,
        priority,
        notes,
        categoryId
      });
      if (res.success) {
        get().fetchWishlist();
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  markWishlistPurchased: async (id, isPurchased) => {
    set({
      wishlistItems: get().wishlistItems.map(w => w.id === id ? { ...w, isPurchased } : w)
    });

    try {
      const res = await WishlistService.markPurchased(id, isPurchased);
      if (res.success) {
        get().fetchWishlist();
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {
      get().fetchWishlist();
    }
  },

  logPurchase: async (storeName, totalAmount, itemsCount, purchaseDate, details) => {
    try {
      const res = await PurchaseHistoryService.logPurchase({
        storeName,
        totalAmount,
        itemsCount,
        purchaseDate,
        details
      });
      if (res.success) {
        get().fetchHistory();
        get().fetchDashboard();
        get().fetchReport();
      }
    } catch (err) {}
  },

  addOfflineLog: (type, payload) => {
    const newLog: OfflineShoppingLog = {
      id: "offline-s-" + Math.floor(Math.random() * 100000),
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    // Optimistic checking
    if (type === "item_check") {
      const { id, isCompleted } = payload;
      set({
        shoppingLists: get().shoppingLists.map(list => ({
          ...list,
          items: list.items?.map(i => i.id === id ? { ...i, isCompleted } : i)
        }))
      });
    }

    set({ offlineQueue: [...get().offlineQueue, newLog] });
  },

  syncOfflineQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;

    set({ isLoading: true });

    for (const item of queue) {
      try {
        if (item.type === "list") {
          await ShoppingListService.addList(item.payload);
        } else if (item.type === "item") {
          await ShoppingItemService.addItem(item.payload);
        } else if (item.type === "item_check") {
          await ShoppingItemService.updateItem(item.payload.id, { isCompleted: item.payload.isCompleted });
        } else if (item.type === "essential") {
          await MonthlyEssentialService.addEssential(item.payload);
        } else if (item.type === "essential_check") {
          await MonthlyEssentialService.checkEssential(item.payload.id, item.payload.isCompleted);
        } else if (item.type === "pantry") {
          await PantryService.addPantryItem(item.payload);
        } else if (item.type === "pantry_quantity") {
          await PantryService.updateQuantity(item.payload.id, item.payload.currentQuantity);
        } else if (item.type === "wishlist") {
          await WishlistService.addWishlistItem(item.payload);
        } else if (item.type === "wishlist_check") {
          await WishlistService.markPurchased(item.payload.id, item.payload.isPurchased);
        } else if (item.type === "history") {
          await PurchaseHistoryService.logPurchase(item.payload);
        }
      } catch (err) {
        console.error("Failed to sync offline shopping entry:", item, err);
      }
    }

    set({ offlineQueue: [], isLoading: false });
    await get().fetchDashboard();
    await get().fetchReport();
    await get().fetchLists();
    await get().fetchPantry();
    await get().fetchWishlist();
    await get().fetchEssentials();
    await get().fetchHistory();
  },

  clearOfflineQueue: () => {
    set({ offlineQueue: [] });
  }
}));

// ==========================================
// AI PLACEHOLDERS LIFESTYLE HOOKS
// ==========================================

export function useShoppingAssistant() {
  return {
    getShoppingTips: async () => {
      return "You frequently buy Organic Whole Milk. Checking local price trends, buying the 2-pack at Costco will save you $1.50 per gallon.";
    },
    isLoading: false
  };
}

export function usePantrySuggestions() {
  return {
    getSuggestions: () => {
      return [
        { name: "Olive Oil Bottle", reason: "Current stock is 0.5. Suggested minimum is 1." },
        { name: "Almond Butter", reason: "Stock is 0.2. Expiring in 3 months." }
      ];
    }
  };
}

export function useMonthlyPlanner() {
  return {
    generateEssentialsChecklist: async () => {
      return "Based on last month's inventory, you will need 1 pack of Dishwasher Pods and 24 rolls of Toilet Paper before the 25th.";
    }
  };
}

export function useMealPlanner() {
  return {
    getPlannedMeals: async () => {
      return [
        { day: "Monday", meal: "Avocado Toast & Scrambled Eggs", ingredients: ["Fresh Avocados", "Whole Wheat Bread", "Eggs"] },
        { day: "Wednesday", meal: "Basmati Rice with Lentil Curry", ingredients: ["Basmati Rice", "Red Lentils", "Onions", "Coconuts"] }
      ];
    }
  };
}

// ==========================================
// INTEGRATIONS STORE
// ==========================================

interface IntegrationState {
  dashboardData: IntegrationDashboardData | null;
  connections: (ProviderConnection & { provider: IntegrationProvider })[];
  availableIntegrations: Integration[];
  syncHistory: (SyncJob & { connection: ProviderConnection & { provider: IntegrationProvider } })[];
  auditLogs: IntegrationAudit[];
  providerHealth: { providerName: string; status: string; lastChecked: string }[];
  isLoading: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  connectProvider: (providerId: string) => Promise<void>;
  disconnectProvider: (connectionId: string) => Promise<void>;
  triggerSync: (connectionId: string) => Promise<void>;
  registerWebhook: (connectionId: string, url: string, events: string[]) => Promise<void>;
  uploadFile: (fileName: string, mimeType: string, sizeBytes: number) => Promise<{ url: string; key: string } | null>;
}

export const useIntegrationStore = create<IntegrationState>((set, get) => ({
  dashboardData: null,
  connections: [],
  availableIntegrations: [],
  syncHistory: [],
  auditLogs: [],
  providerHealth: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await IntegrationDashboardService.getDashboard();
      if (res.success && res.data) {
        set({
          dashboardData: res.data,
          connections: res.data.connections as any,
          availableIntegrations: res.data.availableIntegrations,
          syncHistory: res.data.syncHistory as any,
          auditLogs: res.data.auditLogs,
          providerHealth: res.data.providerHealth,
          isLoading: false
        });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load dashboard data", isLoading: false });
    }
  },

  connectProvider: async (providerId) => {
    try {
      const res = await ConnectionService.addConnection(providerId);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  disconnectProvider: async (connectionId) => {
    // Optimistic Update
    set({
      connections: get().connections.filter(c => c.id !== connectionId)
    });

    try {
      const res = await ConnectionService.deleteConnection(connectionId);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {
      get().fetchDashboard();
    }
  },

  triggerSync: async (connectionId) => {
    try {
      const res = await SyncService.triggerSync(connectionId);
      if (res.success) {
        get().fetchDashboard();
      }
    } catch (err) {}
  },

  registerWebhook: async (connectionId, url, events) => {
    try {
      await WebhookService.registerWebhook(connectionId, url, events);
    } catch (err) {}
  },

  uploadFile: async (fileName, mimeType, sizeBytes) => {
    try {
      const res = await UploadService.handleUpload(fileName, mimeType, sizeBytes);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}));

// ==========================================
// AI TOOL PROVIDERS INTEGRATIONS HOOKS
// ==========================================

export function useIntegrationTools() {
  return {
    getTools: () => {
      return [
        {
          name: "google_calendar_tool",
          description: "Read, create, update, and delete events in Google Calendar.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["list", "create", "update", "delete"] },
              eventId: { type: "string" },
              summary: { type: "string" },
              startTime: { type: "string" },
              endTime: { type: "string" }
            }
          }
        },
        {
          name: "google_tasks_tool",
          description: "Read, create, complete, and delete tasks in Google Tasks.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["list", "create", "complete", "delete"] },
              taskId: { type: "string" },
              title: { type: "string" }
            }
          }
        },
        {
          name: "google_drive_tool",
          description: "Upload, download, list, or delete files in Google Drive.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["list", "upload", "delete"] },
              fileName: { type: "string" },
              fileId: { type: "string" }
            }
          }
        },
        {
          name: "google_maps_tool",
          description: "Search places, get travel times, static maps, or compute route distances.",
          parameters: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["search", "distance", "route"] },
              origin: { type: "string" },
              destination: { type: "string" }
            }
          }
        },
        {
          name: "gmail_context_tool",
          description: "Fetch email contexts, search mails, or preview inbox lists.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" }
            }
          }
        },
        {
          name: "cloudinary_storage_tool",
          description: "Optimize, upload, or delete avatars, documents, or video files.",
          parameters: {
            type: "object",
            properties: {
              fileName: { type: "string" },
              sizeBytes: { type: "number" }
            }
          }
        }
      ];
    }
  };
}

// ==========================================
// PHASE 6 — GLOBAL AI ZUSTAND STORE
// ==========================================

import { AIService } from "@lifesync/services";

interface AIState {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeAgentType: AgentType;
  isGenerating: boolean;
  isStreaming: boolean;
  searchQuery: string;
  memories: MemoryItem[];
  agents: AgentInfo[];
  tools: any[];
  observabilityStats: any | null;
  isLoading: boolean;
  error: string | null;

  fetchConversations: (includeArchived?: boolean) => Promise<void>;
  selectConversation: (id: string | null) => void;
  setActiveAgentType: (agentType: AgentType) => void;
  setSearchQuery: (query: string) => void;
  createConversation: (title?: string, agentType?: AgentType) => Promise<string>;
  sendMessage: (prompt: string, preferredAgent?: AgentType) => Promise<void>;
  togglePinConversation: (id: string) => Promise<void>;
  toggleArchiveConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;

  fetchMemories: (category?: any) => Promise<void>;
  storeMemory: (category: any, key: string, value: string) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  clearMemories: () => Promise<void>;
  exportMemories: () => Promise<any>;

  fetchAgents: () => Promise<void>;
  fetchObservability: () => Promise<void>;
}

export const useAIStore = create<AIState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  activeAgentType: "ORCHESTRATOR",
  isGenerating: false,
  isStreaming: false,
  searchQuery: "",
  memories: [],
  agents: [],
  tools: [],
  observabilityStats: null,
  isLoading: false,
  error: null,

  fetchConversations: async (includeArchived = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await AIService.getConversations(includeArchived);
      if (res.success && res.data) {
        set({
          conversations: res.data,
          activeConversationId: get().activeConversationId || (res.data.length > 0 ? res.data[0].id : null),
          isLoading: false,
        });
      } else {
        set({ error: res.message, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load conversations", isLoading: false });
    }
  },

  selectConversation: (id) => {
    const conv = get().conversations.find((c) => c.id === id);
    set({
      activeConversationId: id,
      activeAgentType: conv?.agentType || "ORCHESTRATOR",
    });
  },

  setActiveAgentType: (agentType) => {
    set({ activeAgentType: agentType });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  createConversation: async (title, agentType) => {
    const targetAgent = agentType || get().activeAgentType || "ORCHESTRATOR";
    const res = await AIService.createConversation(title, targetAgent);
    if (res.success && res.data) {
      const newConv = res.data;
      set({
        conversations: [newConv, ...get().conversations],
        activeConversationId: newConv.id,
        activeAgentType: newConv.agentType,
      });
      return newConv.id;
    }
    throw new Error("Failed to create conversation");
  },

  sendMessage: async (prompt, preferredAgent) => {
    if (!prompt.trim()) return;

    let convId = get().activeConversationId;

    // Create new conversation if none active
    if (!convId) {
      convId = await get().createConversation(prompt.slice(0, 30), preferredAgent || get().activeAgentType);
    }

    const agentToUse = preferredAgent || get().activeAgentType;

    // Optimistic User Message
    const userMsg: Message = {
      id: `temp_msg_${Date.now()}`,
      conversationId: convId,
      role: "USER",
      content: prompt,
      agentType: agentToUse,
      createdAt: new Date().toISOString(),
    };

    const updatedConvs = get().conversations.map((c) => {
      if (c.id === convId) {
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          messages: [...(c.messages || []), userMsg],
        };
      }
      return c;
    });

    set({
      conversations: updatedConvs,
      isGenerating: true,
      error: null,
    });

    try {
      const res = await AIService.chat({
        prompt,
        conversationId: convId,
        preferredAgent: agentToUse,
      });

      if (res.success && res.data) {
        const data = res.data;
        const assistantMsg: Message = {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          role: "ASSISTANT",
          content: data.response,
          agentType: data.agentType,
          toolCalls: data.toolsUsed.length > 0 ? JSON.stringify(data.toolsUsed) : undefined,
          createdAt: new Date().toISOString(),
        };

        const refreshedConvs = get().conversations.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              agentType: data.agentType,
              messages: [...(c.messages || []).filter((m) => m.id !== userMsg.id), userMsg, assistantMsg],
            };
          }
          return c;
        });

        set({
          conversations: refreshedConvs,
          activeAgentType: data.agentType,
          isGenerating: false,
        });
      } else {
        set({ error: res.message, isGenerating: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to process AI response", isGenerating: false });
    }
  },

  togglePinConversation: async (id) => {
    set({
      conversations: get().conversations.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)),
    });
    await AIService.togglePinConversation(id);
  },

  toggleArchiveConversation: async (id) => {
    set({
      conversations: get().conversations.filter((c) => c.id !== id),
      activeConversationId: get().activeConversationId === id ? null : get().activeConversationId,
    });
    await AIService.toggleArchiveConversation(id);
  },

  deleteConversation: async (id) => {
    set({
      conversations: get().conversations.filter((c) => c.id !== id),
      activeConversationId: get().activeConversationId === id ? null : get().activeConversationId,
    });
    await AIService.deleteConversation(id);
  },

  fetchMemories: async (category) => {
    try {
      const res = await AIService.getMemories(category);
      if (res.success && res.data) {
        set({ memories: res.data });
      }
    } catch (err) {}
  },

  storeMemory: async (category, key, value) => {
    try {
      const res = await AIService.storeMemory({ category, key, value });
      if (res.success) {
        get().fetchMemories();
      }
    } catch (err) {}
  },

  deleteMemory: async (id) => {
    set({ memories: get().memories.filter((m) => m.id !== id) });
    await AIService.deleteMemory(id);
  },

  clearMemories: async () => {
    set({ memories: [] });
    await AIService.clearMemories();
  },

  exportMemories: async () => {
    const res = await AIService.exportMemories();
    return res.data;
  },

  fetchAgents: async () => {
    try {
      const res = await AIService.getAgents();
      if (res.success && res.data) {
        set({ agents: res.data });
      }
    } catch (err) {}
  },

  fetchObservability: async () => {
    try {
      const res = await AIService.getObservabilityStats();
      if (res.success && res.data) {
        set({ observabilityStats: res.data });
      }
    } catch (err) {}
  },
}));

// ==========================================
// PHASE 8 — AUTOMATION & WORKFLOW STORE
// ==========================================

import {
  Workflow,
  WorkflowExecution,
  WorkflowTemplate,
} from "@lifesync/types";
import { WorkflowEngine, AIWorkflowGenerator, OfficialWorkflowTemplates } from "@lifesync/services";

interface AutomationState {
  workflows: Workflow[];
  executions: WorkflowExecution[];
  templates: WorkflowTemplate[];
  suggestions: any[];
  isLoading: boolean;
  isExecuting: boolean;

  fetchWorkflows: () => void;
  createWorkflow: (name: string, description: string, triggers: any[], actions: any[], isDestructive?: boolean) => Workflow;
  executeWorkflow: (workflowId: string, forceBypassConfirmation?: boolean) => Promise<WorkflowExecution>;
  generateAIWorkflow: (prompt: string) => Workflow;
  fetchTemplates: () => void;
  fetchSuggestions: () => Promise<void>;
  toggleWorkflowStatus: (id: string) => void;
  deleteWorkflow: (id: string) => void;
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
  workflows: [
    {
      id: "wf-1",
      userId: "u-1",
      name: "Daily Workday Morning Sync",
      description: "Syncs Google Calendar focus time, creates Google Tasks, and sends weather alert.",
      status: "ACTIVE",
      isAiGenerated: false,
      isDestructive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers: [{ id: "trig-1", workflowId: "wf-1", type: "CRON", config: "0 8 * * *", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      actions: [{ id: "act-1", workflowId: "wf-1", type: "CREATE_TASK", orderIndex: 0, config: "{}", isDestructive: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
    },
  ],
  executions: [],
  templates: OfficialWorkflowTemplates,
  suggestions: [],
  isLoading: false,
  isExecuting: false,

  fetchWorkflows: () => {
    const list = WorkflowEngine.listWorkflows("u-1");
    if (list.length > 0) {
      set({ workflows: list });
    }
  },

  createWorkflow: (name, description, triggers, actions, isDestructive = false) => {
    const newWf: Workflow = {
      id: `wf_${Date.now()}`,
      userId: "u-1",
      name,
      description,
      status: "ACTIVE",
      isAiGenerated: false,
      isDestructive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggers,
      actions,
    };
    WorkflowEngine.saveWorkflow(newWf);
    set({ workflows: [newWf, ...get().workflows] });
    return newWf;
  },

  executeWorkflow: async (workflowId, forceBypassConfirmation = false) => {
    set({ isExecuting: true });
    const res = await WorkflowEngine.executeWorkflow(workflowId, "u-1", "MANUAL", forceBypassConfirmation);
    set({
      isExecuting: false,
      executions: [res.execution, ...get().executions],
    });
    return res.execution;
  },

  generateAIWorkflow: (prompt) => {
    const wf = AIWorkflowGenerator.generateWorkflow(prompt, "u-1");
    WorkflowEngine.saveWorkflow(wf);
    set({ workflows: [wf, ...get().workflows] });
    return wf;
  },

  fetchTemplates: () => {
    set({ templates: OfficialWorkflowTemplates });
  },

  fetchSuggestions: async () => {
    const sugs = await AIWorkflowGenerator.suggestWorkflows("u-1");
    set({ suggestions: sugs });
  },

  toggleWorkflowStatus: (id) => {
    const currentWfs = get().workflows;
    const wf = currentWfs.find((w) => w.id === id);
    if (wf) {
      const newStatus = wf.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      WorkflowEngine.updateWorkflowStatus(id, newStatus);
      set({
        workflows: currentWfs.map((w) => {
          if (w.id === id) {
            return { ...w, status: newStatus };
          }
          return w;
        }),
      });
    }
  },

  deleteWorkflow: (id) => {
    WorkflowEngine.deleteWorkflow(id);
    set({ workflows: get().workflows.filter((w) => w.id !== id) });
  },
}));






