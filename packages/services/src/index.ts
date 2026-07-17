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
  TaskSortOption,
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

// ==========================================
// HEALTH MODULE IN-MEMORY DATABASE STORES
// ==========================================

export let mockHealthProfile: HealthProfile = {
  id: "hp-1",
  userId: "u-1",
  height: 175,
  weight: 70,
  targetWeight: 65,
  waterGoal: 2000,
  sleepGoal: 8.0,
  workoutGoal: 150,
  cycleGoal: 28,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export let mockWaterLogs: WaterLog[] = [
  { id: "w-1", userId: "u-1", amount: 250, date: new Date(Date.now() - 3600000 * 4).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "w-2", userId: "u-1", amount: 500, date: new Date(Date.now() - 3600000 * 2).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockSleepLogs: SleepLog[] = [
  { id: "sl-1", userId: "u-1", startTime: new Date(Date.now() - 12 * 3600000).toISOString(), endTime: new Date(Date.now() - 4 * 3600000).toISOString(), duration: 8.0, quality: 4, notes: "Felt refreshed", date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockWorkouts: Workout[] = [
  { id: "wk-1", userId: "u-1", title: "Morning Run", category: "Cardio", duration: 30, calories: 300, notes: "Great pace", date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockWorkoutExercises: WorkoutExercise[] = [
  { id: "we-1", workoutId: "wk-1", name: "Warm-up stretches", sets: 1, reps: null, weight: null, duration: 300, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockWeightLogs: WeightLog[] = [
  { id: "wt-1", userId: "u-1", weight: 70.5, bmi: 23.0, chest: 95, waist: 80, hips: 98, date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockMedications: Medication[] = [
  { id: "m-1", userId: "u-1", name: "Multivitamin", dosage: "1 tablet", schedule: "Morning", frequency: "DAILY", startDate: new Date().toISOString(), endDate: null, remindersEnabled: true, refillReminder: false, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockMedicationLogs: MedicationLog[] = [
  { id: "ml-1", medicationId: "m-1", takenAt: new Date().toISOString(), status: "TAKEN", notes: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockCycles: Cycle[] = [
  { id: "c-1", userId: "u-1", startDate: new Date(Date.now() - 14 * 86400000).toISOString(), endDate: new Date(Date.now() - 10 * 86400000).toISOString(), cycleLength: 28, notes: "Normal cycle", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockCycleSymptoms: CycleSymptom[] = [
  { id: "cs-1", cycleId: "c-1", name: "Cramps", severity: "Mild", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockPcosLogs: PCOSLog[] = [
  { id: "pcos-1", userId: "u-1", symptoms: ["Acne", "Fatigue"], weight: 70.5, medicationTaken: true, waterIntakeMl: 2000, exerciseMinutes: 30, stressLevel: 3, notes: "Feeling stable", date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockHairRoutines: HairRoutine[] = [
  { id: "hr-1", userId: "u-1", name: "Wash & Oil Routine", washDays: ["Monday", "Thursday"], oilDays: ["Wednesday"], maskDays: ["Sunday"], products: ["Shampoo", "Conditioner", "Coconut Oil"], active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockHairLogs: HairLog[] = [
  { id: "hl-1", userId: "u-1", routineId: "hr-1", washDone: true, oilDone: false, maskDone: false, hairFallCount: 15, notes: "Normal wash", date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockSkinRoutines: SkinRoutine[] = [
  { id: "sr-1", userId: "u-1", name: "Morning Glow", products: ["Cleanser", "Vitamin C", "Sunscreen"], concerns: ["Dryness"], active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "sr-2", userId: "u-1", name: "Night Repair", products: ["Cleanser", "Retinol", "Moisturizer"], concerns: ["Dryness"], active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockSkinLogs: SkinLog[] = [
  { id: "skl-1", userId: "u-1", routineId: "sr-1", completed: true, acneSeverity: "None", notes: "Skin feels hydrated", date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockMoodLogs: MoodLog[] = [
  { id: "md-1", userId: "u-1", mood: "Happy", energyLevel: 4, stressLevel: 2, notes: "Productive day", date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockHealthGoals: HealthGoal[] = [
  { id: "hg-1", userId: "u-1", type: "WATER", target: 2000, current: 750, startDate: new Date().toISOString(), endDate: null, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export let mockHealthReminders: HealthReminder[] = [
  { id: "hrm-1", userId: "u-1", type: "MEDICATION", time: "09:00", days: ["DAILY"], enabled: true, message: "Take Multivitamin", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "hrm-2", userId: "u-1", type: "WATER", time: "12:00", days: ["DAILY"], enabled: true, message: "Drink water", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ==========================================
// HEALTH SERVICES
// ==========================================

export const HealthProfileService = {
  async getProfile(): Promise<ApiResponse<HealthProfile>> {
    return { success: true, message: "Health profile fetched", data: mockHealthProfile };
  },
  async updateProfile(updates: Partial<HealthProfile>): Promise<ApiResponse<HealthProfile>> {
    mockHealthProfile = { ...mockHealthProfile, ...updates, updatedAt: new Date().toISOString() };
    return { success: true, message: "Health profile updated", data: mockHealthProfile };
  },
};

export const WaterService = {
  async getLogs(): Promise<ApiResponse<WaterLog[]>> {
    return { success: true, message: "Water logs loaded", data: mockWaterLogs };
  },
  async addLog(amount: number, date?: string): Promise<ApiResponse<WaterLog>> {
    const newLog: WaterLog = {
      id: "w-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      amount,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWaterLogs.push(newLog);
    // Update goal
    const goal = mockHealthGoals.find(g => g.type === "WATER" && g.active);
    if (goal) {
      goal.current += amount;
    }
    return { success: true, message: "Water intake logged", data: newLog };
  },
  async deleteLog(id: string): Promise<ApiResponse> {
    const log = mockWaterLogs.find(w => w.id === id);
    if (log) {
      const goal = mockHealthGoals.find(g => g.type === "WATER" && g.active);
      if (goal) {
        goal.current = Math.max(0, goal.current - log.amount);
      }
    }
    mockWaterLogs = mockWaterLogs.filter(w => w.id !== id);
    return { success: true, message: "Water log deleted" };
  },
  async getStreak(): Promise<ApiResponse<{ streak: number }>> {
    return { success: true, message: "Streak calculated", data: { streak: 5 } };
  }
};

export const SleepService = {
  async getLogs(): Promise<ApiResponse<SleepLog[]>> {
    return { success: true, message: "Sleep logs loaded", data: mockSleepLogs };
  },
  async addLog(logData: { startTime: string; endTime: string; quality: number; notes?: string | null; date?: string }): Promise<ApiResponse<SleepLog>> {
    const start = new Date(logData.startTime);
    const end = new Date(logData.endTime);
    const duration = Math.max(0, (end.getTime() - start.getTime()) / 3600000);
    const newLog: SleepLog = {
      id: "sl-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      startTime: logData.startTime,
      endTime: logData.endTime,
      duration,
      quality: logData.quality,
      notes: logData.notes || null,
      date: logData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSleepLogs.push(newLog);
    return { success: true, message: "Sleep logged", data: newLog };
  },
  async deleteLog(id: string): Promise<ApiResponse> {
    mockSleepLogs = mockSleepLogs.filter(s => s.id !== id);
    return { success: true, message: "Sleep log deleted" };
  },
};

export const WorkoutService = {
  async getWorkouts(): Promise<ApiResponse<Workout[]>> {
    const result = mockWorkouts.map(w => ({
      ...w,
      exercises: mockWorkoutExercises.filter(e => e.workoutId === w.id),
    }));
    return { success: true, message: "Workouts loaded", data: result };
  },
  async addWorkout(workoutData: { title: string; category: string; duration: number; calories?: number | null; notes?: string | null; date?: string; exercises?: Array<{ name: string; sets?: number | null; reps?: number | null; weight?: number | null; duration?: number | null }> }): Promise<ApiResponse<Workout>> {
    const workoutId = "wk-" + Math.floor(Math.random() * 10000);
    const newWorkout: Workout = {
      id: workoutId,
      userId: "u-1",
      title: workoutData.title,
      category: workoutData.category,
      duration: workoutData.duration,
      calories: workoutData.calories || null,
      notes: workoutData.notes || null,
      date: workoutData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWorkouts.push(newWorkout);

    const createdExercises: WorkoutExercise[] = [];
    if (workoutData.exercises) {
      workoutData.exercises.forEach(ex => {
        const newEx: WorkoutExercise = {
          id: "we-" + Math.floor(Math.random() * 10000),
          workoutId,
          name: ex.name,
          sets: ex.sets || null,
          reps: ex.reps || null,
          weight: ex.weight || null,
          duration: ex.duration || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockWorkoutExercises.push(newEx);
        createdExercises.push(newEx);
      });
    }

    return {
      success: true,
      message: "Workout logged successfully",
      data: { ...newWorkout, exercises: createdExercises }
    };
  },
  async deleteWorkout(id: string): Promise<ApiResponse> {
    mockWorkouts = mockWorkouts.filter(w => w.id !== id);
    mockWorkoutExercises = mockWorkoutExercises.filter(e => e.workoutId !== id);
    return { success: true, message: "Workout deleted successfully" };
  },
};

export const WeightService = {
  async getLogs(): Promise<ApiResponse<WeightLog[]>> {
    return { success: true, message: "Weight logs loaded", data: mockWeightLogs };
  },
  async addLog(weightData: { weight: number; chest?: number | null; waist?: number | null; hips?: number | null; date?: string }): Promise<ApiResponse<WeightLog>> {
    let bmi = null;
    if (mockHealthProfile.height) {
      const heightM = mockHealthProfile.height / 100;
      bmi = parseFloat((weightData.weight / (heightM * heightM)).toFixed(1));
    }
    const newLog: WeightLog = {
      id: "wt-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      weight: weightData.weight,
      bmi,
      chest: weightData.chest || null,
      waist: weightData.waist || null,
      hips: weightData.hips || null,
      date: weightData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWeightLogs.push(newLog);
    mockHealthProfile.weight = weightData.weight;
    return { success: true, message: "Weight logged successfully", data: newLog };
  },
  async deleteLog(id: string): Promise<ApiResponse> {
    mockWeightLogs = mockWeightLogs.filter(w => w.id !== id);
    return { success: true, message: "Weight log deleted" };
  },
};

export const MedicationService = {
  async getMedications(): Promise<ApiResponse<Medication[]>> {
    const result = mockMedications.map(m => ({
      ...m,
      logs: mockMedicationLogs.filter(l => l.medicationId === m.id),
    }));
    return { success: true, message: "Medications loaded", data: result };
  },
  async addMedication(medData: { name: string; dosage: string; schedule: string; frequency: string; startDate: string; endDate?: string | null; remindersEnabled?: boolean; refillReminder?: boolean }): Promise<ApiResponse<Medication>> {
    const newMed: Medication = {
      id: "m-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      name: medData.name,
      dosage: medData.dosage,
      schedule: medData.schedule,
      frequency: medData.frequency,
      startDate: medData.startDate,
      endDate: medData.endDate || null,
      remindersEnabled: medData.remindersEnabled !== false,
      refillReminder: medData.refillReminder === true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMedications.push(newMed);
    return { success: true, message: "Medication added successfully", data: newMed };
  },
  async updateMedication(id: string, updates: Partial<Medication>): Promise<ApiResponse<Medication>> {
    mockMedications = mockMedications.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
    const updated = mockMedications.find(m => m.id === id);
    if (!updated) return { success: false, message: "Medication not found" };
    return { success: true, message: "Medication updated", data: updated };
  },
  async deleteMedication(id: string): Promise<ApiResponse> {
    mockMedications = mockMedications.filter(m => m.id !== id);
    mockMedicationLogs = mockMedicationLogs.filter(l => l.medicationId !== id);
    return { success: true, message: "Medication deleted successfully" };
  },
  async logMedication(logData: { medicationId: string; status?: string; notes?: string | null; takenAt?: string }): Promise<ApiResponse<MedicationLog>> {
    const newLog: MedicationLog = {
      id: "ml-" + Math.floor(Math.random() * 10000),
      medicationId: logData.medicationId,
      takenAt: logData.takenAt || new Date().toISOString(),
      status: logData.status || "TAKEN",
      notes: logData.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMedicationLogs.push(newLog);
    return { success: true, message: "Medication intake logged", data: newLog };
  },
  async getMedicationLogs(medicationId?: string): Promise<ApiResponse<MedicationLog[]>> {
    const logs = medicationId ? mockMedicationLogs.filter(l => l.medicationId === medicationId) : mockMedicationLogs;
    return { success: true, message: "Medication logs fetched", data: logs };
  }
};

export const WomenHealthService = {
  async getCycles(): Promise<ApiResponse<Cycle[]>> {
    const result = mockCycles.map(c => ({
      ...c,
      symptoms: mockCycleSymptoms.filter(s => s.cycleId === c.id),
    }));
    return { success: true, message: "Cycles loaded", data: result };
  },
  async addCycle(cycleData: { startDate: string; endDate?: string | null; notes?: string | null; symptoms?: Array<{ name: string; severity?: string | null }> }): Promise<ApiResponse<Cycle>> {
    const cycleId = "c-" + Math.floor(Math.random() * 10000);
    let cycleLength = null;
    if (cycleData.endDate) {
      const start = new Date(cycleData.startDate);
      const end = new Date(cycleData.endDate);
      cycleLength = Math.round((end.getTime() - start.getTime()) / 86400000);
    }
    const newCycle: Cycle = {
      id: cycleId,
      userId: "u-1",
      startDate: cycleData.startDate,
      endDate: cycleData.endDate || null,
      cycleLength,
      notes: cycleData.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCycles.push(newCycle);

    const createdSymptoms: CycleSymptom[] = [];
    if (cycleData.symptoms) {
      cycleData.symptoms.forEach(sym => {
        const newSym: CycleSymptom = {
          id: "cs-" + Math.floor(Math.random() * 10000),
          cycleId,
          name: sym.name,
          severity: sym.severity || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockCycleSymptoms.push(newSym);
        createdSymptoms.push(newSym);
      });
    }

    return {
      success: true,
      message: "Cycle logged successfully",
      data: { ...newCycle, symptoms: createdSymptoms }
    };
  },
  async updateCycle(id: string, updates: Partial<Cycle>): Promise<ApiResponse<Cycle>> {
    mockCycles = mockCycles.map(c => {
      if (c.id === id) {
        const newC = { ...c, ...updates, updatedAt: new Date().toISOString() };
        if (newC.startDate && newC.endDate) {
          const start = new Date(newC.startDate);
          const end = new Date(newC.endDate);
          newC.cycleLength = Math.round((end.getTime() - start.getTime()) / 86400000);
        }
        return newC;
      }
      return c;
    });
    const updated = mockCycles.find(c => c.id === id);
    if (!updated) return { success: false, message: "Cycle not found" };
    return { success: true, message: "Cycle updated", data: updated };
  },
  async deleteCycle(id: string): Promise<ApiResponse> {
    mockCycles = mockCycles.filter(c => c.id !== id);
    mockCycleSymptoms = mockCycleSymptoms.filter(s => s.cycleId !== id);
    return { success: true, message: "Cycle deleted" };
  },
  async addSymptom(cycleId: string, name: string, severity?: string | null): Promise<ApiResponse<CycleSymptom>> {
    const newSym: CycleSymptom = {
      id: "cs-" + Math.floor(Math.random() * 10000),
      cycleId,
      name,
      severity: severity || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCycleSymptoms.push(newSym);
    return { success: true, message: "Symptom logged", data: newSym };
  }
};

export const PcosService = {
  async getLogs(): Promise<ApiResponse<PCOSLog[]>> {
    return { success: true, message: "PCOS logs loaded", data: mockPcosLogs };
  },
  async addLog(logData: { symptoms: string[]; weight?: number | null; medicationTaken?: boolean; waterIntakeMl?: number | null; exerciseMinutes?: number | null; stressLevel?: number | null; notes?: string | null; date?: string }): Promise<ApiResponse<PCOSLog>> {
    const newLog: PCOSLog = {
      id: "pcos-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      symptoms: logData.symptoms,
      weight: logData.weight || null,
      medicationTaken: logData.medicationTaken === true,
      waterIntakeMl: logData.waterIntakeMl || null,
      exerciseMinutes: logData.exerciseMinutes || null,
      stressLevel: logData.stressLevel || null,
      notes: logData.notes || null,
      date: logData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPcosLogs.push(newLog);
    return { success: true, message: "PCOS daily log saved", data: newLog };
  },
  async deleteLog(id: string): Promise<ApiResponse> {
    mockPcosLogs = mockPcosLogs.filter(p => p.id !== id);
    return { success: true, message: "PCOS log deleted" };
  },
};

export const HairCareService = {
  async getRoutines(): Promise<ApiResponse<HairRoutine[]>> {
    const result = mockHairRoutines.map(r => ({
      ...r,
      logs: mockHairLogs.filter(l => l.routineId === r.id),
    }));
    return { success: true, message: "Hair routines loaded", data: result };
  },
  async addRoutine(routineData: { name: string; washDays: string[]; oilDays: string[]; maskDays: string[]; products: string[] }): Promise<ApiResponse<HairRoutine>> {
    const newRoutine: HairRoutine = {
      id: "hr-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      name: routineData.name,
      washDays: routineData.washDays,
      oilDays: routineData.oilDays,
      maskDays: routineData.maskDays,
      products: routineData.products,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockHairRoutines.push(newRoutine);
    return { success: true, message: "Hair routine created", data: newRoutine };
  },
  async logHairActivity(logData: { routineId?: string | null; washDone: boolean; oilDone: boolean; maskDone: boolean; hairFallCount?: number | null; notes?: string | null; date?: string }): Promise<ApiResponse<HairLog>> {
    const newLog: HairLog = {
      id: "hl-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      routineId: logData.routineId || null,
      washDone: logData.washDone,
      oilDone: logData.oilDone,
      maskDone: logData.maskDone,
      hairFallCount: logData.hairFallCount || null,
      notes: logData.notes || null,
      date: logData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockHairLogs.push(newLog);
    return { success: true, message: "Hair care logged", data: newLog };
  },
  async getLogs(): Promise<ApiResponse<HairLog[]>> {
    return { success: true, message: "Hair logs loaded", data: mockHairLogs };
  },
};

export const SkinCareService = {
  async getRoutines(): Promise<ApiResponse<SkinRoutine[]>> {
    const result = mockSkinRoutines.map(r => ({
      ...r,
      logs: mockSkinLogs.filter(l => l.routineId === r.id),
    }));
    return { success: true, message: "Skin routines loaded", data: result };
  },
  async addRoutine(routineData: { name: string; products: string[]; concerns: string[] }): Promise<ApiResponse<SkinRoutine>> {
    const newRoutine: SkinRoutine = {
      id: "sr-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      name: routineData.name,
      products: routineData.products,
      concerns: routineData.concerns,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSkinRoutines.push(newRoutine);
    return { success: true, message: "Skin routine created", data: newRoutine };
  },
  async logSkinActivity(logData: { routineId?: string | null; completed: boolean; acneSeverity?: string | null; notes?: string | null; date?: string }): Promise<ApiResponse<SkinLog>> {
    const newLog: SkinLog = {
      id: "skl-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      routineId: logData.routineId || null,
      completed: logData.completed,
      acneSeverity: logData.acneSeverity || null,
      notes: logData.notes || null,
      date: logData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSkinLogs.push(newLog);
    return { success: true, message: "Skin care logged", data: newLog };
  },
  async getLogs(): Promise<ApiResponse<SkinLog[]>> {
    return { success: true, message: "Skin logs loaded", data: mockSkinLogs };
  },
};

export const MoodService = {
  async getLogs(): Promise<ApiResponse<MoodLog[]>> {
    return { success: true, message: "Mood logs loaded", data: mockMoodLogs };
  },
  async addLog(logData: { mood: string; energyLevel: number; stressLevel: number; notes?: string | null; date?: string }): Promise<ApiResponse<MoodLog>> {
    const newLog: MoodLog = {
      id: "md-" + Math.floor(Math.random() * 10000),
      userId: "u-1",
      mood: logData.mood,
      energyLevel: logData.energyLevel,
      stressLevel: logData.stressLevel,
      notes: logData.notes || null,
      date: logData.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMoodLogs.push(newLog);
    return { success: true, message: "Mood logged successfully", data: newLog };
  },
  async deleteLog(id: string): Promise<ApiResponse> {
    mockMoodLogs = mockMoodLogs.filter(m => m.id !== id);
    return { success: true, message: "Mood log deleted" };
  },
};

export const HealthService = {
  async getHealthDashboard(): Promise<ApiResponse<HealthDashboardData>> {
    const todayStr = new Date().toISOString().split("T")[0];
    
    const todayWaterLogs = mockWaterLogs.filter(w => w.date.startsWith(todayStr));
    const todayWater = todayWaterLogs.reduce((sum, log) => sum + log.amount, 0);

    const todaySleep = mockSleepLogs.find(s => s.date.startsWith(todayStr)) || null;

    const todayWorkouts = mockWorkouts.filter(w => w.date.startsWith(todayStr));
    const workoutProgress = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);

    const currentWeight = mockWeightLogs.length > 0 ? mockWeightLogs[mockWeightLogs.length - 1].weight : mockHealthProfile.weight;
    const targetWeight = mockHealthProfile.targetWeight;

    const todayMedLogs = mockMedicationLogs.filter(l => l.takenAt.startsWith(todayStr) && l.status === "TAKEN");
    const totalMeds = mockMedications.filter(m => m.active).length;
    const medList = mockMedications.filter(m => m.active).map(m => ({
      ...m,
      takenToday: todayMedLogs.some(l => l.medicationId === m.id),
    }));

    const todayMood = mockMoodLogs.find(m => m.date.startsWith(todayStr)) || null;

    // Women's health cycle phase calc
    let currentDay = null;
    let phase = null;
    let isPeriodToday = false;
    let daysUntilPeriod = null;
    if (mockCycles.length > 0) {
      const lastCycle = mockCycles[mockCycles.length - 1];
      const startDate = new Date(lastCycle.startDate);
      const diffTime = Math.abs(Date.now() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      currentDay = (diffDays % (mockHealthProfile.cycleGoal || 28)) + 1;
      
      if (currentDay <= 5) {
        phase = "Menstruation";
        isPeriodToday = true;
      } else if (currentDay <= 11) {
        phase = "Follicular";
      } else if (currentDay <= 15) {
        phase = "Ovulation";
      } else {
        phase = "Luteal";
      }
      daysUntilPeriod = Math.max(0, (mockHealthProfile.cycleGoal || 28) - currentDay);
    }

    // Hair Routine status today
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDayName = daysOfWeek[new Date().getDay()];
    const activeHairRoutine = mockHairRoutines.find(r => r.active) || null;
    const todayHairLog = mockHairLogs.find(l => l.date.startsWith(todayStr)) || null;

    const washDay = activeHairRoutine ? activeHairRoutine.washDays.includes(todayDayName) : false;
    const oilDay = activeHairRoutine ? activeHairRoutine.oilDays.includes(todayDayName) : false;
    const maskDay = activeHairRoutine ? activeHairRoutine.maskDays.includes(todayDayName) : false;

    const hairRoutineStatus = {
      washDay,
      oilDay,
      maskDay,
      washDone: todayHairLog ? todayHairLog.washDone : false,
      oilDone: todayHairLog ? todayHairLog.oilDone : false,
      maskDone: todayHairLog ? todayHairLog.maskDone : false,
    };

    // Skin Routine status today
    const morningRoutine = mockSkinRoutines.find(r => r.name.toLowerCase().includes("morning") && r.active);
    const nightRoutine = mockSkinRoutines.find(r => r.name.toLowerCase().includes("night") && r.active);
    
    const morningLog = mockSkinLogs.find(l => l.date.startsWith(todayStr) && l.routineId === (morningRoutine?.id || "sr-1"));
    const nightLog = mockSkinLogs.find(l => l.date.startsWith(todayStr) && l.routineId === (nightRoutine?.id || "sr-2"));

    const skinRoutineStatus = {
      morningDone: morningLog ? morningLog.completed : false,
      nightDone: nightLog ? nightLog.completed : false,
    };

    const waterIntake = [1800, 2100, 1500, 2200, 1900, 2000, todayWater];
    const sleepDuration = [7.0, 8.2, 6.5, 7.5, 8.0, 7.8, todaySleep ? todaySleep.duration : 0];
    const workoutMinutes = [45, 0, 30, 60, 45, 0, workoutProgress];

    const upcomingReminders = mockHealthReminders.filter(r => r.enabled);

    const data: HealthDashboardData = {
      profile: mockHealthProfile,
      todayWater,
      waterGoal: mockHealthProfile.waterGoal || 2000,
      todaySleep,
      sleepGoal: mockHealthProfile.sleepGoal || 8.0,
      todayWorkouts,
      workoutProgress,
      workoutGoal: mockHealthProfile.workoutGoal || 150,
      currentWeight: currentWeight || null,
      targetWeight: targetWeight || null,
      medicationStatus: {
        taken: todayMedLogs.length,
        total: totalMeds,
        list: medList,
      },
      cycleStatus: {
        currentDay,
        phase,
        isPeriodToday,
        daysUntilPeriod,
      },
      todayMood,
      hairRoutineStatus,
      skinRoutineStatus,
      upcomingReminders,
      weeklySummary: {
        waterIntake,
        sleepDuration,
        workoutMinutes,
      },
    };

    return {
      success: true,
      message: "Health dashboard loaded successfully",
      data,
    };
  },

  async generateHealthReport(filters?: { startDate?: string; endDate?: string }): Promise<ApiResponse<HealthReportData>> {
    const totalWater = mockWaterLogs.reduce((sum, w) => sum + w.amount, 0);
    const avgWater = mockWaterLogs.length > 0 ? totalWater / mockWaterLogs.length : 0;

    const totalSleep = mockSleepLogs.reduce((sum, s) => sum + s.duration, 0);
    const avgSleep = mockSleepLogs.length > 0 ? totalSleep / mockSleepLogs.length : 0;
    const avgQuality = mockSleepLogs.length > 0 ? mockSleepLogs.reduce((sum, s) => sum + s.quality, 0) / mockSleepLogs.length : 0;

    const totalWorkouts = mockWorkouts.length;
    const totalWorkoutDuration = mockWorkouts.reduce((sum, w) => sum + w.duration, 0);

    const initialWeight = mockWeightLogs.length > 0 ? mockWeightLogs[0].weight : null;
    const currentWeight = mockWeightLogs.length > 0 ? mockWeightLogs[mockWeightLogs.length - 1].weight : null;
    const weightChange = (initialWeight && currentWeight) ? currentWeight - initialWeight : null;

    const totalMedLogs = mockMedicationLogs.length;
    const takenMedLogs = mockMedicationLogs.filter(l => l.status === "TAKEN").length;
    const adherenceRate = totalMedLogs > 0 ? Math.round((takenMedLogs / totalMedLogs) * 100) : 100;

    const cycleLengthSum = mockCycles.filter(c => c.cycleLength !== null).reduce((sum, c) => sum + c.cycleLength!, 0);
    const cyclesWithLength = mockCycles.filter(c => c.cycleLength !== null).length;
    const averageCycleLength = cyclesWithLength > 0 ? cycleLengthSum / cyclesWithLength : 28;

    const symptomFrequency: Record<string, number> = {};
    mockPcosLogs.forEach(log => {
      log.symptoms.forEach(sym => {
        symptomFrequency[sym] = (symptomFrequency[sym] || 0) + 1;
      });
    });
    const averageStressPcos = mockPcosLogs.length > 0 ? mockPcosLogs.reduce((sum, l) => sum + (l.stressLevel || 0), 0) / mockPcosLogs.length : 0;

    const totalMoodLogs = mockMoodLogs.length;
    const averageMoodEnergy = totalMoodLogs > 0 ? mockMoodLogs.reduce((sum, l) => sum + l.energyLevel, 0) / totalMoodLogs : 0;
    const averageMoodStress = totalMoodLogs > 0 ? mockMoodLogs.reduce((sum, l) => sum + l.stressLevel, 0) / totalMoodLogs : 0;
    
    const moodCounts: Record<string, number> = {};
    mockMoodLogs.forEach(l => {
      moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
    });

    const washDoneCount = mockHairLogs.filter(l => l.washDone).length;
    const hairFallTrend = mockHairLogs.filter(l => l.hairFallCount !== null).map(l => l.hairFallCount!);

    const skinCompletionLogs = mockSkinLogs.filter(l => l.completed).length;
    const skinCompletionRate = mockSkinLogs.length > 0 ? Math.round((skinCompletionLogs / mockSkinLogs.length) * 100) : 100;

    const data: HealthReportData = {
      water: {
        total: totalWater,
        average: parseFloat(avgWater.toFixed(0)),
        history: mockWaterLogs,
      },
      sleep: {
        averageDuration: parseFloat(avgSleep.toFixed(1)),
        averageQuality: parseFloat(avgQuality.toFixed(1)),
        history: mockSleepLogs,
      },
      workout: {
        totalWorkouts,
        totalDuration: totalWorkoutDuration,
        history: mockWorkouts,
      },
      weight: {
        initial: initialWeight,
        current: currentWeight,
        change: weightChange ? parseFloat(weightChange.toFixed(1)) : null,
        history: mockWeightLogs,
      },
      medication: {
        adherenceRate,
        history: mockMedicationLogs,
      },
      cycle: {
        averageLength: parseFloat(averageCycleLength.toFixed(1)),
        history: mockCycles,
      },
      pcos: {
        symptomFrequency,
        averageStress: parseFloat(averageStressPcos.toFixed(1)),
        history: mockPcosLogs,
      },
      mood: {
        averageEnergy: parseFloat(averageMoodEnergy.toFixed(1)),
        averageStress: parseFloat(averageMoodStress.toFixed(1)),
        moodCounts,
        history: mockMoodLogs,
      },
      hair: {
        washDoneCount,
        hairFallTrend,
        history: mockHairLogs,
      },
      skin: {
        completionRate: skinCompletionRate,
        history: mockSkinLogs,
      },
    };

    return {
      success: true,
      message: "Health report generated successfully",
      data,
    };
  }
};

