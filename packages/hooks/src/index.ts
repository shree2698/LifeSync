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
  TaskViewMode
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
  CalendarService
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
      // Return predefined milestone recommendations based on title keywords
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
