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

// ==========================================
// PERSONAL FINANCE TYPES
// ==========================================

export type AccountType = "CASH" | "BANK" | "WALLET" | "CREDIT_CARD" | "UPI" | "INVESTMENT";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
export type BillStatus = "PAID" | "UNPAID" | "OVERDUE";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED";
export type ReportType = "MONTHLY" | "YEARLY";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isDefault: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  userId: string | null;
  name: string;
  type: TransactionType;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionTag {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  isRecurring: boolean;
  recurringTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
  category?: TransactionCategory | null;
  tags?: TransactionTag[];
}

export interface Income {
  id: string;
  userId: string;
  transactionId: string;
  source: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  transactionId: string;
  merchant: string | null;
  paymentMethod: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  budgetCategories?: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  limitAmount: number;
  createdAt: string;
  updatedAt: string;
  category?: TransactionCategory;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  recurringInterval: string | null;
  status: BillStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  billingCycle: string;
  renewalDate: string;
  categoryId: string | null;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  category?: TransactionCategory | null;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  frequency: RecurringFrequency;
  startDate: string;
  endDate: string | null;
  nextOccurrence: string | null;
  accountId: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialReport {
  id: string;
  userId: string;
  type: ReportType;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  details: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceDashboardData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  remainingBudget: number;
  savingsProgress: number;
  upcomingBills: Bill[];
  upcomingSubscriptions: Subscription[];
  recentTransactions: (Transaction & { category: TransactionCategory | null; account: Account })[];
  topCategories: { name: string; amount: number; percentage: number; color: string }[];
}

export interface FinanceReportData {
  monthlyReport: { income: number; expense: number; savings: number };
  yearlyReport: { income: number; expense: number; savings: number };
  categoryBreakdown: { categoryId: string; categoryName: string; amount: number; percentage: number; color: string }[];
  incomeVsExpense: { month: string; income: number; expense: number }[];
  savingsReport: { goalId: string; goalName: string; current: number; target: number; progress: number }[];
  budgetReport: { budgetId: string; budgetName: string; limit: number; spent: number; remaining: number }[];
}

// ==========================================
// SHOPPING MODULE TYPES
// ==========================================

export interface Category {
  id: string;
  userId: string | null;
  name: string;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  icon: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  items?: ShoppingItem[];
}

export interface ShoppingItem {
  id: string;
  listId: string;
  categoryId: string | null;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  isCompleted: boolean;
  isFavorite: boolean;
  notes: string | null;
  purchasedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface MonthlyEssential {
  id: string;
  userId: string;
  name: string;
  categoryId: string | null;
  targetQuantity: number;
  unit: string;
  estimatedPrice: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface PantryItem {
  id: string;
  userId: string;
  name: string;
  categoryId: string | null;
  currentQuantity: number;
  minimumQuantity: number;
  expiryDate: string | null;
  purchaseDate: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface WishlistItem {
  id: string;
  userId: string;
  name: string;
  categoryId: string | null;
  desiredPrice: number;
  priority: string;
  notes: string | null;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface PurchaseHistory {
  id: string;
  userId: string;
  storeName: string | null;
  totalAmount: number;
  itemsCount: number;
  purchaseDate: string;
  details: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingReport {
  id: string;
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  details: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingTemplate {
  id: string;
  userId: string;
  name: string;
  items: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingDashboardData {
  todayShopping: ShoppingItem[];
  pendingItemsCount: number;
  completedItemsCount: number;
  monthlyEssentialsCount: number;
  lowStockItems: PantryItem[];
  wishlistCount: number;
  estimatedTotalCost: number;
  recentPurchases: PurchaseHistory[];
  shoppingStatistics: { totalSpentThisMonth: number; itemsBoughtThisMonth: number };
}

export interface ShoppingReportData {
  monthlyShoppingSummary: { spent: number; itemsCount: number };
  categoryBreakdown: { categoryId: string; categoryName: string; amount: number; percentage: number; color: string }[];
  frequentlyPurchasedItems: { name: string; count: number }[];
  estimatedVsActualCost: { month: string; estimated: number; actual: number }[];
  wishlistReport: WishlistItem[];
  pantryReport: PantryItem[];
}
// ==========================================
// INTEGRATION PLATFORM TYPES
// ==========================================

export interface Integration {
  id: string;
  name: string;
  type: string; // e.g. GOOGLE, MICROSOFT, CLOUDINARY, FIREBASE
  description: string | null;
  isEnabled: boolean;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  providers?: Provider[];
}

export interface Provider {
  id: string;
  integrationId: string;
  name: string;
  type: string; // OAUTH, API_KEY
  isEnabled: boolean;
  config: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  userId: string;
  providerId: string;
  isEnabled: boolean;
  status: string; // CONNECTED, DISCONNECTED, ERROR
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  provider?: Provider;
  oauthTokens?: OAuthToken[];
  refreshTokens?: RefreshToken[];
}

export interface OAuthToken {
  id: string;
  connectionId: string;
  accessToken: string;
  expiresAt: string | null;
  scope: string | null;
  tokenType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshToken {
  id: string;
  connectionId: string;
  token: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Webhook {
  id: string;
  connectionId: string;
  url: string;
  secret: string | null;
  isEnabled: boolean;
  events: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncJob {
  id: string;
  connectionId: string;
  status: string; // PENDING, RUNNING, COMPLETED, FAILED
  scheduledTime: string | null;
  startedAt: string | null;
  endedAt: string | null;
  type: string; // MANUAL, SCHEDULED, AUTO
  createdAt: string;
  updatedAt: string;
}

export interface SyncLog {
  id: string;
  syncJobId: string;
  level: string; // INFO, WARNING, ERROR
  message: string;
  createdAt: string;
}

export interface Permission {
  id: string;
  connectionId: string;
  scope: string;
  isGranted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSetting {
  id: string;
  connectionId: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationAudit {
  id: string;
  userId: string;
  connectionId: string | null;
  action: string;
  details: string | null;
  timestamp: string;
}

export interface IntegrationDashboardData {
  connections: (Connection & { provider: Provider })[];
  availableIntegrations: Integration[];
  syncHistory: (SyncJob & { connection: Connection & { provider: Provider } })[];
  auditLogs: IntegrationAudit[];
  providerHealth: { providerName: string; status: string; lastChecked: string }[];
}

// ==========================================
// PHASE 6 — AI CORE & PLATFORM TYPES
// ==========================================

export type AgentType =
  | "PLANNER"
  | "PRODUCTIVITY"
  | "HEALTH"
  | "FINANCE"
  | "SHOPPING"
  | "CALENDAR"
  | "JOURNAL"
  | "NOTIFICATION"
  | "MEMORY"
  | "RESEARCH"
  | "AUTOMATION"
  | "CAREER_COACH"
  | "WELLNESS_COACH"
  | "ORCHESTRATOR";

export type MemoryCategory =
  | "PREFERENCE"
  | "GOAL"
  | "HABIT"
  | "HEALTH"
  | "FINANCE"
  | "SHOPPING"
  | "PERSONAL"
  | "SCHEDULE"
  | "WORK";

export type MemoryType = "SHORT_TERM" | "LONG_TERM" | "SEMANTIC";

export type AIProvider = "OPENAI" | "ANTHROPIC" | "GEMINI" | "OPENROUTER" | "LOCAL";

export type MessageRole = "SYSTEM" | "USER" | "ASSISTANT" | "TOOL";

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  isPinned: boolean;
  isArchived: boolean;
  summary?: string | null;
  agentType: AgentType;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  agentType?: AgentType | null;
  tokens?: number | null;
  metadata?: string | null;
  toolCalls?: string | null;
  createdAt: string;
}

export interface AgentInfo {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  capabilities: string[];
  isSystem: boolean;
  isEnabled: boolean;
}

export interface MemoryItem {
  id: string;
  userId: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number;
  source: string;
  memoryType: MemoryType;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  slug: string;
  version: number;
  category: string;
  template: string;
  systemPrompt?: string | null;
  description?: string | null;
  isDefault: boolean;
}

export interface ToolCallSpec {
  toolName: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status?: "SUCCESS" | "FAILED" | "PENDING";
}

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  data: any;
  error?: string;
  latencyMs: number;
}

export interface AIUsageStats {
  provider: AIProvider;
  model: string;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  costEstimate: number;
  latencyMs: number;
}

export interface AISettings {
  id: string;
  userId: string;
  defaultProvider: AIProvider;
  defaultModel: string;
  temperature: number;
  autoSummarize: boolean;
  memoryEnabled: boolean;
  webSearchEnabled: boolean;
}

export interface DashboardAISummary {
  todaysSummary: string;
  priorityTasks: { id: string; title: string; priority: string; dueDate?: string }[];
  healthInsights: string[];
  financeSummary: { totalIncome: number; totalExpenses: number; netSavings: number; summary: string };
  shoppingSuggestions: string[];
  upcomingEvents: { id: string; title: string; time: string }[];
  dailyFocus: string;
}

// ==========================================
// PHASE 8 — AUTOMATION & WORKFLOW ENGINE TYPES
// ==========================================

export type WorkflowStatus = "ACTIVE" | "INACTIVE" | "PAUSED" | "DRAFT";

export type WorkflowTriggerType = "CRON" | "EVENT" | "WEBHOOK" | "AI_SUGGESTION" | "MANUAL";

export type WorkflowActionType =
  | "CREATE_TASK"
  | "SCHEDULE_EVENT"
  | "SEND_NOTIFICATION"
  | "DISPATCH_EMAIL"
  | "UPLOAD_MEDIA"
  | "FETCH_WEATHER"
  | "RUN_AI_AGENT";

export type ExecutionStatus = "RUNNING" | "SUCCESS" | "FAILED" | "CANCELLED" | "PENDING_CONFIRMATION";

export interface WorkflowTrigger {
  id: string;
  workflowId: string;
  type: WorkflowTriggerType;
  config: string;
  providerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowAction {
  id: string;
  workflowId: string;
  type: WorkflowActionType;
  orderIndex: number;
  config: string;
  providerId?: string | null;
  isDestructive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionLog {
  id: string;
  executionId: string;
  level: string;
  message: string;
  stepIndex?: number | null;
  createdAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  status: ExecutionStatus;
  startedAt: string;
  endedAt?: string | null;
  durationMs?: number | null;
  error?: string | null;
  logs?: ExecutionLog[];
}

export interface WorkflowSchedule {
  id: string;
  workflowId: string;
  cronExpression: string;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCondition {
  id: string;
  workflowId: string;
  field: string;
  operator: "EQUALS" | "CONTAINS" | "GREATER_THAN" | "LESS_THAN" | "NOT_EQUALS";
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowVariable {
  id: string;
  workflowId: string;
  key: string;
  value: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  status: WorkflowStatus;
  isAiGenerated: boolean;
  isDestructive: boolean;
  createdAt: string;
  updatedAt: string;
  triggers?: WorkflowTrigger[];
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
  executions?: WorkflowExecution[];
  schedules?: WorkflowSchedule[];
  variables?: WorkflowVariable[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  isOfficial: boolean;
  config: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationSetting {
  id: string;
  userId: string;
  autoApproveSafeWorkflows: boolean;
  confirmDestructive: boolean;
  maxDailyExecutions: number;
  createdAt: string;
  updatedAt: string;
}


