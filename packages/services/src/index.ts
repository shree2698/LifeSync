import {
  ApiResponse,
  User,
  Profile,
  Settings,
  DashboardData,
  Notification,
  Task,
  Subtask,
  Label,
  Habit,
  HabitLog,
  Goal,
  Milestone,
  Folder,
  Tag,
  Note,
  CalendarEvent,
  TaskFilters,
  TaskSortOption
} from "@lifesync/types";

// ==========================================
// IN-MEMORY DATABASE STORES (PERSISTED LOCAL SESSION)
// ==========================================

let mockUser: User | null = {
  id: "u-1",
  email: "john.doe@souree.com",
  authProvider: "EMAIL",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let mockProfile: Profile = {
  id: "p-1",
  userId: "u-1",
  fullName: "John Doe",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  dateOfBirth: "1995-05-15T00:00:00.000Z",
  gender: "Male",
  timezone: "UTC",
  country: "United States",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let mockSettings: Settings = {
  id: "s-1",
  userId: "u-1",
  theme: "dark",
  marketingEmails: false,
  securityAlerts: true,
  pushNotifications: true,
  currency: "USD",
  language: "en",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let mockNotifications: Notification[] = [
  {
    id: "n-1",
    userId: "u-1",
    title: "Welcome to LifeSync",
    body: "Start designing your ideal day with widgets.",
    read: false,
    type: "SYSTEM",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
];

// Seed initial task labels
let mockLabels: Label[] = [
  { id: "l-1", userId: "u-1", name: "Work", color: "#5B7FFF", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "l-2", userId: "u-1", name: "Personal", color: "#7C5CFF", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "l-3", userId: "u-1", name: "Study", color: "#F59E0B", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "l-4", userId: "u-1", name: "Health", color: "#16C784", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Seed initial subtasks
let mockSubtasks: Subtask[] = [
  { id: "st-1", taskId: "t-1", title: "Analyze target audience", completed: true, order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "st-2", taskId: "t-1", title: "Draft budget outline", completed: false, order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Seed initial tasks
let mockTasks: Task[] = [
  {
    id: "t-1",
    userId: "u-1",
    title: "Review Q3 product roadmap",
    description: "Prepare details regarding Phase 2 productivity layout specifications.",
    status: "TODO",
    priority: "HIGH",
    dueDate: new Date().toISOString(),
    startDate: new Date().toISOString(),
    time: "10:30",
    estimatedDuration: 45,
    color: "#5B7FFF",
    icon: "ClipboardList",
    pinned: true,
    favorite: false,
    recurringExpr: null,
    goalId: "g-1",
    dependsOnId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t-2",
    userId: "u-1",
    title: "Weekly design alignment",
    description: "Align core branding with Apple/Linear minimal guidelines.",
    status: "COMPLETED",
    priority: "MEDIUM",
    dueDate: new Date().toISOString(),
    startDate: new Date().toISOString(),
    time: "14:00",
    estimatedDuration: 30,
    color: "#7C5CFF",
    icon: "Palette",
    pinned: false,
    favorite: true,
    recurringExpr: "every week",
    goalId: "g-1",
    dependsOnId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Seed initial habits
let mockHabits: Habit[] = [
  { id: "h-1", userId: "u-1", title: "Read 10 pages", frequency: "DAILY", customFreq: null, reminderTime: "21:00", streak: 5, category: "Personal", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "h-2", userId: "u-1", title: "Drink 3L water", frequency: "DAILY", customFreq: null, reminderTime: "08:00", streak: 12, category: "Health", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockHabitLogs: HabitLog[] = [
  { id: "hl-1", habitId: "h-1", completedAt: new Date().toISOString().split("T")[0] },
];

// Seed initial goals
let mockGoals: Goal[] = [
  { id: "g-1", userId: "u-1", title: "Launch LifeSync Phase 2", category: "Work", progress: 65, target: 100, deadline: new Date(Date.now() + 15 * 86400000).toISOString(), status: "ACTIVE", priority: "URGENT", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "g-2", userId: "u-1", title: "Read 24 books this year", category: "Personal", progress: 12, target: 24, deadline: new Date("2026-12-31").toISOString(), status: "ACTIVE", priority: "MEDIUM", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockMilestones: Milestone[] = [
  { id: "m-1", goalId: "g-1", title: "Create Prisma schema", completed: true, order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "m-2", goalId: "g-1", title: "Establish REST controllers", completed: true, order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "m-3", goalId: "g-1", title: "Hook widgets on dashboard", completed: false, order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Seed initial folders, tags, and notes
let mockFolders: Folder[] = [
  { id: "fld-1", userId: "u-1", name: "Work Notes", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockTags: Tag[] = [
  { id: "tg-1", userId: "u-1", name: "Roadmap", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockNotes: Note[] = [
  {
    id: "n-1",
    userId: "u-1",
    title: "Phase 2 specifications draft",
    content: "## Core Features\n- Subtasks nesting\n- Habit logs integration\n- Drag and drop calendars\n\n### Checklist\n- [x] Prisma structure\n- [ ] React forms\n",
    pinned: true,
    folderId: "fld-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Seed initial calendar events
let mockEvents: CalendarEvent[] = [
  {
    id: "e-1",
    userId: "u-1",
    title: "Sprint Planning meeting",
    description: "Discuss Phase 2 scope limits",
    start: new Date(Date.now() + 2 * 3600000).toISOString(), // in 2 hours
    end: new Date(Date.now() + 3.5 * 3600000).toISOString(),
    allDay: false,
    recurringRule: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to resolve dependencies
function getTaskWithRelations(task: Task): Task {
  return {
    ...task,
    subtasks: mockSubtasks.filter((s) => s.taskId === task.id),
    labels: mockLabels.filter((l) => mockTasks.find((t) => t.id === task.id)?.id === task.id), // placeholder link
  };
}

// Helper to resolve goal relations
function getGoalWithRelations(goal: Goal): Goal {
  return {
    ...goal,
    milestones: mockMilestones.filter((m) => m.goalId === goal.id),
    tasks: mockTasks.filter((t) => t.goalId === goal.id),
  };
}

// ==========================================
// CORE SERVICES
// ==========================================

export const AuthService = {
  async register(email: string, fullName: string): Promise<ApiResponse<{ user: User; profile: Profile }>> {
    mockUser = {
      id: "u-1",
      email,
      authProvider: "EMAIL",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProfile = {
      id: "p-1",
      userId: mockUser.id,
      fullName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      dateOfBirth: null,
      gender: null,
      timezone: "UTC",
      country: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      message: "Registration successful",
      data: { user: mockUser, profile: mockProfile },
    };
  },

  async login(email: string): Promise<ApiResponse<{ user: User; profile: Profile }>> {
    if (!mockUser || mockUser.email !== email) {
      mockUser = {
        id: "u-1",
        email,
        authProvider: "EMAIL",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockProfile = {
        id: "p-1",
        userId: mockUser.id,
        fullName: email.split("@")[0],
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        dateOfBirth: null,
        gender: null,
        timezone: "UTC",
        country: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return {
      success: true,
      message: "Login successful",
      data: { user: mockUser, profile: mockProfile },
    };
  },

  async logout(): Promise<ApiResponse> {
    mockUser = null;
    return {
      success: true,
      message: "Logout successful",
    };
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User; profile: Profile } | null>> {
    if (!mockUser) {
      return { success: false, message: "Not authenticated", data: null };
    }
    return {
      success: true,
      message: "User fetched",
      data: { user: mockUser, profile: mockProfile },
    };
  },
};

export const UserService = {
  async getProfile(): Promise<ApiResponse<Profile>> {
    return {
      success: true,
      message: "Profile fetched successfully",
      data: mockProfile,
    };
  },

  async updateProfile(updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
    mockProfile = { ...mockProfile, ...updates, updatedAt: new Date().toISOString() };
    return {
      success: true,
      message: "Profile updated successfully",
      data: mockProfile,
    };
  },
};

export const SettingsService = {
  async getSettings(): Promise<ApiResponse<Settings>> {
    return {
      success: true,
      message: "Settings fetched successfully",
      data: mockSettings,
    };
  },

  async updateSettings(updates: Partial<Settings>): Promise<ApiResponse<Settings>> {
    mockSettings = { ...mockSettings, ...updates, updatedAt: new Date().toISOString() };
    return {
      success: true,
      message: "Settings updated successfully",
      data: mockSettings,
    };
  },
};

// ==========================================
// PRODUCTIVITY SERVICES
// ==========================================

export const TaskService = {
  async getTasks(filters?: Partial<TaskFilters>, sort?: TaskSortOption): Promise<ApiResponse<Task[]>> {
    let result = [...mockTasks];

    // Filter logic
    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
        );
      }
      if (filters.status && filters.status.length > 0) {
        result = result.filter((t) => filters.status!.includes(t.status));
      }
      if (filters.priority && filters.priority.length > 0) {
        result = result.filter((t) => filters.priority!.includes(t.priority));
      }
      if (filters.goalId) {
        result = result.filter((t) => t.goalId === filters.goalId);
      }
      if (filters.pinnedOnly) {
        result = result.filter((t) => t.pinned);
      }
      if (filters.favoriteOnly) {
        result = result.filter((t) => t.favorite);
      }
    }

    // Sorting logic
    if (sort) {
      switch (sort) {
        case "NEWEST":
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "OLDEST":
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case "DUE_DATE_ASC":
          result.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
          break;
        case "DUE_DATE_DESC":
          result.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
          });
          break;
        case "ALPHABETICAL_ASC":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "ALPHABETICAL_DESC":
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "PRIORITY_DESC":
          const priorityWeight = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
          break;
        case "PRIORITY_ASC":
          const priorityWeightAsc = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          result.sort((a, b) => priorityWeightAsc[a.priority] - priorityWeightAsc[b.priority]);
          break;
        default:
          break;
      }
    }

    const tasksWithRelations = result.map(getTaskWithRelations);
    return { success: true, message: "Tasks loaded", data: tasksWithRelations };
  },

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const task = mockTasks.find((t) => t.id === id);
    if (!task) return { success: false, message: "Task not found" };
    return { success: true, message: "Task found", data: getTaskWithRelations(task) };
  },

  async createTask(taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">): Promise<ApiResponse<Task>> {
    const newTask: Task = {
      ...taskData,
      id: "t-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return { success: true, message: "Task created successfully", data: getTaskWithRelations(newTask) };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    mockTasks = mockTasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    const updated = mockTasks.find((t) => t.id === id);
    if (!updated) return { success: false, message: "Task not found" };
    return { success: true, message: "Task updated", data: getTaskWithRelations(updated) };
  },

  async deleteTask(id: string): Promise<ApiResponse> {
    mockTasks = mockTasks.filter((t) => t.id !== id);
    mockSubtasks = mockSubtasks.filter((s) => s.taskId !== id);
    return { success: true, message: "Task deleted successfully" };
  },

  // Subtasks CRUD
  async getSubtasks(taskId: string): Promise<ApiResponse<Subtask[]>> {
    return { success: true, message: "Subtasks loaded", data: mockSubtasks.filter((s) => s.taskId === taskId) };
  },

  async createSubtask(taskId: string, title: string): Promise<ApiResponse<Subtask>> {
    const newSub: Subtask = {
      id: "st-" + Math.floor(Math.random() * 1000),
      taskId,
      title,
      completed: false,
      order: mockSubtasks.filter((s) => s.taskId === taskId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSubtasks.push(newSub);
    return { success: true, message: "Subtask created", data: newSub };
  },

  async updateSubtask(id: string, updates: Partial<Subtask>): Promise<ApiResponse<Subtask>> {
    mockSubtasks = mockSubtasks.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
    const updated = mockSubtasks.find((s) => s.id === id);
    if (!updated) return { success: false, message: "Subtask not found" };
    return { success: true, message: "Subtask updated", data: updated };
  },

  async deleteSubtask(id: string): Promise<ApiResponse> {
    mockSubtasks = mockSubtasks.filter((s) => s.id !== id);
    return { success: true, message: "Subtask deleted" };
  },

  // Labels CRUD
  async getLabels(): Promise<ApiResponse<Label[]>> {
    return { success: true, message: "Labels loaded", data: mockLabels };
  },

  async createLabel(name: string, color: string): Promise<ApiResponse<Label>> {
    const newLabel: Label = {
      id: "l-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      name,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLabels.push(newLabel);
    return { success: true, message: "Label created", data: newLabel };
  },
};

export const HabitService = {
  async getHabits(): Promise<ApiResponse<Habit[]>> {
    const habitsWithLogs = mockHabits.map((h) => ({
      ...h,
      logs: mockHabitLogs.filter((l) => l.habitId === h.id),
    }));
    return { success: true, message: "Habits loaded", data: habitsWithLogs };
  },

  async createHabit(habitData: Omit<Habit, "id" | "userId" | "streak" | "createdAt" | "updatedAt">): Promise<ApiResponse<Habit>> {
    const newHabit: Habit = {
      ...habitData,
      id: "h-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      streak: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockHabits.push(newHabit);
    return { success: true, message: "Habit created successfully", data: newHabit };
  },

  async updateHabit(id: string, updates: Partial<Habit>): Promise<ApiResponse<Habit>> {
    mockHabits = mockHabits.map((h) =>
      h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
    );
    const updated = mockHabits.find((h) => h.id === id);
    if (!updated) return { success: false, message: "Habit not found" };
    return { success: true, message: "Habit updated", data: updated };
  },

  async deleteHabit(id: string): Promise<ApiResponse> {
    mockHabits = mockHabits.filter((h) => h.id !== id);
    mockHabitLogs = mockHabitLogs.filter((l) => l.habitId !== id);
    return { success: true, message: "Habit deleted" };
  },

  async toggleHabitCompletion(id: string, dateStr: string): Promise<ApiResponse<Habit>> {
    const habit = mockHabits.find((h) => h.id === id);
    if (!habit) return { success: false, message: "Habit not found" };

    const existingLogIndex = mockHabitLogs.findIndex(
      (l) => l.habitId === id && l.completedAt === dateStr
    );

    if (existingLogIndex >= 0) {
      // Remove completion log
      mockHabitLogs.splice(existingLogIndex, 1);
      // Recalculate streak
      habit.streak = Math.max(0, habit.streak - 1);
    } else {
      // Log completion
      mockHabitLogs.push({
        id: "hl-" + Math.floor(Math.random() * 1000),
        habitId: id,
        completedAt: dateStr,
      });
      // Increment streak
      habit.streak += 1;
    }

    return { success: true, message: "Habit toggled", data: habit };
  },
};

export const GoalService = {
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    const goalsWithRelations = mockGoals.map(getGoalWithRelations);
    return { success: true, message: "Goals loaded", data: goalsWithRelations };
  },

  async createGoal(goalData: Omit<Goal, "id" | "userId" | "progress" | "createdAt" | "updatedAt">): Promise<ApiResponse<Goal>> {
    const newGoal: Goal = {
      ...goalData,
      id: "g-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockGoals.push(newGoal);
    return { success: true, message: "Goal created", data: getGoalWithRelations(newGoal) };
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<ApiResponse<Goal>> {
    mockGoals = mockGoals.map((g) =>
      g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
    );
    const updated = mockGoals.find((g) => g.id === id);
    if (!updated) return { success: false, message: "Goal not found" };
    return { success: true, message: "Goal updated", data: getGoalWithRelations(updated) };
  },

  async deleteGoal(id: string): Promise<ApiResponse> {
    mockGoals = mockGoals.filter((g) => g.id !== id);
    mockMilestones = mockMilestones.filter((m) => m.goalId !== id);
    return { success: true, message: "Goal deleted successfully" };
  },

  // Milestones CRUD
  async createMilestone(goalId: string, title: string): Promise<ApiResponse<Milestone>> {
    const newM: Milestone = {
      id: "m-" + Math.floor(Math.random() * 1000),
      goalId,
      title,
      completed: false,
      order: mockMilestones.filter((m) => m.goalId === goalId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMilestones.push(newM);

    // Update goal completion percentage
    this.recalculateGoalProgress(goalId);

    return { success: true, message: "Milestone created", data: newM };
  },

  async toggleMilestone(id: string): Promise<ApiResponse<Milestone>> {
    mockMilestones = mockMilestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed, updatedAt: new Date().toISOString() } : m
    );
    const updated = mockMilestones.find((m) => m.id === id);
    if (!updated) return { success: false, message: "Milestone not found" };

    this.recalculateGoalProgress(updated.goalId);

    return { success: true, message: "Milestone toggled", data: updated };
  },

  async deleteMilestone(id: string): Promise<ApiResponse> {
    const m = mockMilestones.find((x) => x.id === id);
    mockMilestones = mockMilestones.filter((x) => x.id !== id);
    if (m) {
      this.recalculateGoalProgress(m.goalId);
    }
    return { success: true, message: "Milestone deleted" };
  },

  recalculateGoalProgress(goalId: string) {
    const total = mockMilestones.filter((m) => m.goalId === goalId);
    const completed = total.filter((m) => m.completed);
    const percentage = total.length > 0 ? Math.round((completed.length / total.length) * 100) : 0;
    mockGoals = mockGoals.map((g) => (g.id === goalId ? { ...g, progress: percentage } : g));
  },
};

export const NoteService = {
  async getNotes(): Promise<ApiResponse<Note[]>> {
    const notesWithFolders = mockNotes.map((n) => ({
      ...n,
      folder: mockFolders.find((f) => f.id === n.folderId) || null,
      tags: mockTags,
    }));
    return { success: true, message: "Notes loaded", data: notesWithFolders };
  },

  async createNote(noteData: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">): Promise<ApiResponse<Note>> {
    const newNote: Note = {
      ...noteData,
      id: "n-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockNotes.push(newNote);
    return { success: true, message: "Note created successfully", data: newNote };
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<ApiResponse<Note>> {
    mockNotes = mockNotes.map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    );
    const updated = mockNotes.find((n) => n.id === id);
    if (!updated) return { success: false, message: "Note not found" };
    return { success: true, message: "Note updated", data: updated };
  },

  async deleteNote(id: string): Promise<ApiResponse> {
    mockNotes = mockNotes.filter((n) => n.id !== id);
    return { success: true, message: "Note deleted" };
  },

  // Folders CRUD
  async getFolders(): Promise<ApiResponse<Folder[]>> {
    return { success: true, message: "Folders loaded", data: mockFolders };
  },

  async createFolder(name: string): Promise<ApiResponse<Folder>> {
    const newFolder: Folder = {
      id: "fld-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFolders.push(newFolder);
    return { success: true, message: "Folder created", data: newFolder };
  },
};

export const CalendarService = {
  async getEvents(): Promise<ApiResponse<CalendarEvent[]>> {
    return { success: true, message: "Events loaded", data: mockEvents };
  },

  async createEvent(eventData: Omit<CalendarEvent, "id" | "userId" | "createdAt" | "updatedAt">): Promise<ApiResponse<CalendarEvent>> {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: "e-" + Math.floor(Math.random() * 1000),
      userId: "u-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockEvents.push(newEvent);
    return { success: true, message: "Calendar event created", data: newEvent };
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    mockEvents = mockEvents.map((e) =>
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    );
    const updated = mockEvents.find((e) => e.id === id);
    if (!updated) return { success: false, message: "Event not found" };
    return { success: true, message: "Calendar event updated", data: updated };
  },

  async deleteEvent(id: string): Promise<ApiResponse> {
    mockEvents = mockEvents.filter((e) => e.id !== id);
    return { success: true, message: "Event deleted successfully" };
  },
};

export const DashboardService = {
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const dashboardData: DashboardData = {
      tasks: mockTasks.map(getTaskWithRelations),
      habits: mockHabits.map((h) => ({ ...h, logs: mockHabitLogs.filter((l) => l.habitId === h.id) })),
      goals: mockGoals.map(getGoalWithRelations),
      finance: {
        income: 8200,
        expenses: 3450,
        balance: 4750,
      },
      health: {
        waterIntakeMl: 1500,
        waterGoalMl: 3000,
        sleepHours: 7.5,
        workoutMinutes: 45,
      },
      shopping: [
        { id: "s-1", name: "Organic apples", completed: false },
        { id: "s-2", name: "Almond milk", completed: true },
        { id: "s-3", name: "Greek yogurt", completed: false },
      ],
      aiAssistant: {
        summary: "You have 2 pending high-priority tasks and 1 goal milestone to review today. Keep going!",
        suggestion: "Your focus peaks between 9 AM and 11 AM. Use that block to review the Q3 product roadmap.",
      },
      calendar: mockEvents,
      notes: mockNotes,
    };

    return {
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    };
  },
};

export const NotificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return {
      success: true,
      message: "Notifications fetched successfully",
      data: mockNotifications,
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    mockNotifications = mockNotifications.map((n) =>
      n.id === id ? { ...n, read: true, updatedAt: new Date().toISOString() } : n
    );
    const updated = mockNotifications.find((n) => n.id === id);
    return {
      success: true,
      message: "Notification marked as read",
      data: updated,
    };
  },

  async markAllAsRead(): Promise<ApiResponse<Notification[]>> {
    mockNotifications = mockNotifications.map((n) => ({
      ...n,
      read: true,
      updatedAt: new Date().toISOString(),
    }));
    return {
      success: true,
      message: "All notifications marked as read",
      data: mockNotifications,
    };
  },

  async deleteNotification(id: string): Promise<ApiResponse> {
    mockNotifications = mockNotifications.filter((n) => n.id !== id);
    return {
      success: true,
      message: "Notification deleted",
    };
  },
};
