"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  CreditCard,
  DollarSign,
  PiggyBank,
  Plus,
  Trash2,
  Calendar,
  FileText,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Bookmark
} from "lucide-react"
import {
  useFinanceStore,
  useBudgetAdvisor,
  useSpendingInsights,
  useSavingsPlanner,
  useExpensePrediction
} from "@lifesync/hooks"
import {
  FinanceCard,
  StatisticsCard,
  TransactionCard,
  BudgetCard,
  SavingsCard,
  BillCard,
  SubscriptionCard,
  AmountDisplay,
  CategoryBadge,
  CashFlowChart
} from "@/components/finance-ui"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Input } from "@/components/ui/input"

// Forms Validation Schemas
const accountFormSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["CASH", "BANK", "WALLET", "CREDIT_CARD", "UPI", "INVESTMENT"]),
  balance: z.coerce.number(),
})

const transactionFormSchema = z.object({
  accountId: z.string().min(1, "Account selection required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  toAccountId: z.string().optional(),
  date: z.string().optional(),
})

const budgetFormSchema = z.object({
  name: z.string().min(1, "Budget name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
})

const savingsFormSchema = z.object({
  name: z.string().min(1, "Savings goal name required"),
  targetAmount: z.coerce.number().positive("Target must be positive"),
  currentAmount: z.coerce.number().default(0),
  deadline: z.string().optional(),
})

const billFormSchema = z.object({
  name: z.string().min(1, "Bill name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  dueDate: z.string().min(1, "Due date required"),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.string().optional(),
})

const subscriptionFormSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  billingCycle: z.string().default("MONTHLY"),
  renewalDate: z.string().min(1, "Renewal date required"),
  categoryId: z.string().optional(),
})

type TabName = "overview" | "accounts" | "transactions" | "budgets" | "savings" | "bills_subs" | "reports"

export default function FinancePage() {
  const [activeTab, setActiveTab] = React.useState<TabName>("overview")
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString())

  const {
    dashboardData,
    reportData,
    accounts,
    categories,
    tags,
    offlineQueue,
    isLoading,
    fetchDashboard,
    fetchReport,
    fetchAccounts,
    fetchCategories,
    fetchTags,
    addAccount,
    deleteAccount,
    addTransaction,
    deleteTransaction,
    addBudget,
    addSavingsGoal,
    addContribution,
    addBill,
    payBill,
    addSubscription,
    syncOfflineQueue
  } = useFinanceStore()

  // AI Hook Analysis
  const budgetAdv = useBudgetAdvisor()
  const spendingIns = useSpendingInsights()
  const savingsPln = useSavingsPlanner()
  const expPred = useExpensePrediction()

  const [aiAdvice, setAiAdvice] = React.useState("Loading AI financial insights...")
  const [predictions, setPredictions] = React.useState<any[]>([])

  React.useEffect(() => {
    fetchDashboard()
    fetchReport()
    fetchAccounts()
    fetchCategories()
    fetchTags()
    budgetAdv.getAdvice().then(setAiAdvice)
    expPred.predictNextMonthExpenses().then(setPredictions)
  }, [fetchDashboard, fetchReport, fetchAccounts, fetchCategories, fetchTags])

  // Forms Hooks
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema) as any,
    defaultValues: { name: "", type: "BANK", balance: 0 },
  })

  const transactionForm = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      accountId: "",
      amount: 10,
      type: "EXPENSE",
      categoryId: "",
      description: "",
      toAccountId: "",
    },
  })

  const budgetForm = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema) as any,
    defaultValues: {
      name: "",
      amount: 1000,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0],
    },
  })

  const savingsForm = useForm<z.infer<typeof savingsFormSchema>>({
    resolver: zodResolver(savingsFormSchema) as any,
    defaultValues: { name: "", targetAmount: 1000, currentAmount: 0, deadline: "" },
  })

  const billForm = useForm<z.infer<typeof billFormSchema>>({
    resolver: zodResolver(billFormSchema) as any,
    defaultValues: {
      name: "",
      amount: 50,
      dueDate: new Date(Date.now() + 7 * 24 * 3600000).toISOString().split("T")[0],
      isRecurring: false,
    },
  })

  const subscriptionForm = useForm<z.infer<typeof subscriptionFormSchema>>({
    resolver: zodResolver(subscriptionFormSchema) as any,
    defaultValues: {
      name: "",
      amount: 14.99,
      billingCycle: "MONTHLY",
      renewalDate: new Date(Date.now() + 15 * 24 * 3600000).toISOString().split("T")[0],
      categoryId: "",
    },
  })

  // Submit Handlers
  const onAccountSubmit = async (data: z.infer<typeof accountFormSchema>) => {
    await addAccount(data.name, data.type, data.balance)
    accountForm.reset()
    fetchAccounts()
  }

  const onTransactionSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await addTransaction({
      accountId: data.accountId,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId || null,
      description: data.description || null,
      toAccountId: data.toAccountId || null,
      date: selectedDate,
    })
    transactionForm.reset()
  }

  const onBudgetSubmit = async (data: z.infer<typeof budgetFormSchema>) => {
    await addBudget(data)
    budgetForm.reset()
  }

  const onSavingsSubmit = async (data: z.infer<typeof savingsFormSchema>) => {
    await addSavingsGoal(data)
    savingsForm.reset()
  }

  const onBillSubmit = async (data: z.infer<typeof billFormSchema>) => {
    await addBill(data)
    billForm.reset()
  }

  const onSubscriptionSubmit = async (data: z.infer<typeof subscriptionFormSchema>) => {
    await addSubscription({
      name: data.name,
      amount: data.amount,
      billingCycle: data.billingCycle,
      renewalDate: data.renewalDate,
      categoryId: data.categoryId || null,
    })
    subscriptionForm.reset()
  }

  if (isLoading || !dashboardData) {
    return (
      <DashboardShell>
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-[500px]">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Initializing financial ledger...</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Personal Finance</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-account wealth aggregator, category budgeting, savings vaults, bills, and subscriptions tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {offlineQueue.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-yellow-500 font-bold font-mono">
                  {offlineQueue.length} Offline Actions Pending
                </span>
                <button
                  onClick={() => syncOfflineQueue()}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all"
                >
                  Sync Now
                </button>
              </div>
            )}
            
            <button
              onClick={() => setSelectedDate(new Date().toISOString())}
              className="bg-muted hover:bg-muted/80 text-foreground border border-border/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
            >
              Today: {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </button>
          </div>
        </div>

        {/* Modular Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 border-b border-border/40 dark:border-border/10 my-6 scrollbar-thin select-none">
          {[
            { id: "overview", label: "Dashboard", icon: <CreditCard className="h-3.5 w-3.5" /> },
            { id: "accounts", label: "Accounts", icon: <DollarSign className="h-3.5 w-3.5" /> },
            { id: "transactions", label: "Ledger Logs", icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
            { id: "budgets", label: "Budgets", icon: <Bookmark className="h-3.5 w-3.5" /> },
            { id: "savings", label: "Savings Goals", icon: <PiggyBank className="h-3.5 w-3.5" /> },
            { id: "bills_subs", label: "Bills & Subs", icon: <Clock className="h-3.5 w-3.5" /> },
            { id: "reports", label: "Reports & Analytics", icon: <FileText className="h-3.5 w-3.5" /> },
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
                <StatisticsCard
                  title="Net wealth balance"
                  value={dashboardData.currentBalance}
                  icon={<CreditCard className="h-4 w-4 text-blue-500" />}
                  trend={{ value: 4.8, label: "from last week" }}
                  variant="blue"
                />
                <StatisticsCard
                  title="Monthly cash income"
                  value={dashboardData.monthlyIncome}
                  icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                  variant="emerald"
                />
                <StatisticsCard
                  title="Monthly expenses"
                  value={dashboardData.monthlyExpenses}
                  icon={<TrendingDown className="h-4 w-4 text-rose-500" />}
                  variant="rose"
                />
              </div>

              {/* AI Coaching & Reminders */}
              <div className="space-y-6">
                <FinanceCard title="✦ AI Financial Advisor" accentColor="violet">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-xs text-foreground font-sans leading-relaxed">{aiAdvice}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Predicted Expenses (Next Month)
                    </p>
                    <div className="space-y-2">
                      {predictions.map((p, i) => (
                        <div key={i} className="flex justify-between items-center bg-muted/20 border border-border/20 p-2 rounded-lg text-[10px]">
                          <span className="font-semibold">{p.category}</span>
                          <span className="font-mono text-muted-foreground">${p.predictedAmount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FinanceCard>
              </div>

              {/* Other parameters cards */}
              <div className="md:col-span-2 space-y-6">
                <FinanceCard title="Recent Transactions" subtitle="Track ledger deposits, spendings, and transfers.">
                  <div className="space-y-3">
                    {dashboardData.recentTransactions.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground">No recent transactions.</div>
                    ) : (
                      dashboardData.recentTransactions.map((tx) => (
                        <TransactionCard
                          key={tx.id}
                          description={tx.description || "Transaction log"}
                          accountName={tx.account?.name || "Account"}
                          categoryName={tx.category?.name || "Other"}
                          categoryColor={tx.category?.color}
                          amount={tx.amount}
                          type={tx.type}
                          date={tx.date}
                          onDelete={() => deleteTransaction(tx.id)}
                        />
                      ))
                    )}
                  </div>
                </FinanceCard>
              </div>

              <div className="space-y-6">
                <FinanceCard title="Monthly Spending Budget" accentColor="rose">
                  <BudgetCard
                    name="July Target Budget Cap"
                    limitAmount={dashboardData.monthlyExpenses + dashboardData.remainingBudget}
                    spentAmount={dashboardData.monthlyExpenses}
                  />
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Top Categories breakdown
                    </p>
                    <div className="space-y-2">
                      {dashboardData.topCategories.slice(0, 3).map((c, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px] bg-muted/10 p-2 rounded-lg border border-border/20">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                            <span className="font-bold">{c.name}</span>
                          </div>
                          <span className="font-mono text-muted-foreground">${c.amount.toFixed(0)} ({c.percentage.toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FinanceCard>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNTS */}
          {activeTab === "accounts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Creator */}
              <FinanceCard title="Add Wallet or Bank Account" accentColor="blue" subtitle="Input your cash values, credit card limits, or bank ledger balances.">
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Account Name</label>
                    <Input
                      placeholder="Chase Savings, Cash Wallet"
                      {...accountForm.register("name")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Account Type</label>
                      <select
                        {...accountForm.register("type")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 h-9"
                      >
                        <option>BANK</option>
                        <option>CASH</option>
                        <option>WALLET</option>
                        <option>CREDIT_CARD</option>
                        <option>UPI</option>
                        <option>INVESTMENT</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Starting Balance</label>
                      <Input
                        type="number"
                        {...accountForm.register("balance")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Add Account
                  </button>
                </form>
              </FinanceCard>

              {/* Accounts List */}
              <FinanceCard title="Active Accounts Summary" accentColor="blue">
                <div className="space-y-4">
                  {accounts.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">No accounts registered yet.</div>
                  ) : (
                    accounts.map((a) => (
                      <div
                        key={a.id}
                        className="flex justify-between items-center bg-muted/20 border border-border/20 p-3 rounded-xl hover:border-blue-500/20 hover:bg-blue-500/[0.01] transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-foreground">{a.name}</p>
                            {a.isDefault && <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1.5 py-0.2 rounded font-bold">DEFAULT</span>}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Type: {a.type} • Currency: {a.currency}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold">${a.balance.toFixed(2)}</span>
                          <button
                            onClick={() => deleteAccount(a.id)}
                            className="text-muted-foreground hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </FinanceCard>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS / LEDGER */}
          {activeTab === "transactions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Logger Form */}
              <FinanceCard title="Log Financial Transaction" accentColor="emerald" subtitle="Log cash deposits, expense swipes, or transfers between wallets.">
                <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {["EXPENSE", "INCOME", "TRANSFER"].map((txType) => {
                      const isSelected = transactionForm.watch("type") === txType
                      return (
                        <button
                          key={txType}
                          type="button"
                          onClick={() => transactionForm.setValue("type", txType as any)}
                          className={`border text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/15"
                              : "border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {txType}
                        </button>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Source Account</label>
                      <select
                        {...transactionForm.register("accountId")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 h-9"
                      >
                        <option value="">Select Account</option>
                        {accounts.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    {transactionForm.watch("type") === "TRANSFER" ? (
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Destination Account</label>
                        <select
                          {...transactionForm.register("toAccountId")}
                          className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 h-9"
                        >
                          <option value="">Select Account</option>
                          {accounts.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Category</label>
                        <select
                          {...transactionForm.register("categoryId")}
                          className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 h-9"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Amount ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        {...transactionForm.register("amount")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Description</label>
                      <Input
                        placeholder="Whole Foods groceries, Freelance gig..."
                        {...transactionForm.register("description")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Transaction
                  </button>
                </form>
              </FinanceCard>

              {/* Transactions List */}
              <FinanceCard title="Transaction History Ledger" accentColor="emerald">
                <div className="space-y-3">
                  {dashboardData.recentTransactions.map((tx) => (
                    <TransactionCard
                      key={tx.id}
                      description={tx.description || "Transaction log"}
                      accountName={tx.account?.name || "Account"}
                      categoryName={tx.category?.name || "Other"}
                      categoryColor={tx.category?.color}
                      amount={tx.amount}
                      type={tx.type}
                      date={tx.date}
                      onDelete={() => deleteTransaction(tx.id)}
                    />
                  ))}
                </div>
              </FinanceCard>
            </div>
          )}

          {/* TAB 4: BUDGETS */}
          {activeTab === "budgets" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Set Budgets */}
              <FinanceCard title="Configure Monthly Budget Ceiling" accentColor="rose" subtitle="Define financial budget ceilings to warn you on overspendings.">
                <form onSubmit={budgetForm.handleSubmit(onBudgetSubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Budget Title</label>
                    <Input
                      placeholder="Monthly General Budget"
                      {...budgetForm.register("name")}
                      className="bg-muted/10 border-border/40"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Limit Amount</label>
                      <Input
                        type="number"
                        {...budgetForm.register("amount")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Start Date</label>
                      <Input
                        type="date"
                        {...budgetForm.register("startDate")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">End Date</label>
                      <Input
                        type="date"
                        {...budgetForm.register("endDate")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Set Budget
                  </button>
                </form>
              </FinanceCard>

              {/* Budgets Tracker progress */}
              <FinanceCard title="Budget Threshold Progress" accentColor="rose">
                {reportData?.budgetReport && reportData.budgetReport.length > 0 ? (
                  <div className="space-y-4">
                    {reportData.budgetReport.map((b: any) => (
                      <BudgetCard
                        key={b.budgetId}
                        name={b.budgetName}
                        limitAmount={b.limit}
                        spentAmount={b.spent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground">No active budgets. Configure one.</div>
                )}
              </FinanceCard>
            </div>
          )}

          {/* TAB 5: SAVINGS GOALS */}
          {activeTab === "savings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Goal */}
              <FinanceCard title="Define Savings Goal Fund" accentColor="blue" subtitle="Set target deadlines and monetary limits for your future purchases.">
                <form onSubmit={savingsForm.handleSubmit(onSavingsSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Goal Name</label>
                      <Input
                        placeholder="Emergency Fund, Tesla Roadster"
                        {...savingsForm.register("name")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Target Amount ($)</label>
                      <Input
                        type="number"
                        {...savingsForm.register("targetAmount")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Starting Amount</label>
                      <Input
                        type="number"
                        {...savingsForm.register("currentAmount")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Deadline Date</label>
                      <Input
                        type="date"
                        {...savingsForm.register("deadline")}
                        className="bg-muted/10 border-border/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Add Savings Goal
                  </button>
                </form>
              </FinanceCard>

              {/* Goals meters */}
              <FinanceCard title="Savings Vault Progress" accentColor="blue">
                {reportData?.savingsReport && reportData.savingsReport.length > 0 ? (
                  <div className="space-y-4">
                    {reportData.savingsReport.map((g: any) => (
                      <SavingsCard
                        key={g.goalId}
                        name={g.goalName}
                        targetAmount={g.target}
                        currentAmount={g.current}
                        onContribute={async (amt) => {
                          await addContribution(g.goalId, amt)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground">No active savings goals found.</div>
                )}
              </FinanceCard>
            </div>
          )}

          {/* TAB 6: BILLS & SUBSCRIPTIONS */}
          {activeTab === "bills_subs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bills List / pay */}
              <FinanceCard title="Scheduled Bills Check" accentColor="orange" subtitle="Mark unpaid utility bills or credit payouts as PAID.">
                <div className="space-y-3">
                  {dashboardData.upcomingBills.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">No upcoming bills. Add one below!</div>
                  ) : (
                    dashboardData.upcomingBills.map((bill) => (
                      <BillCard
                        key={bill.id}
                        name={bill.name}
                        amount={bill.amount}
                        dueDate={bill.dueDate}
                        status={bill.status}
                        onPay={async () => {
                          await payBill(bill.id)
                        }}
                      />
                    ))
                  )}
                </div>

                {/* Subscriptions */}
                <div className="mt-6 border-t border-border/10 pt-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Active Subscriptions Renews
                  </p>
                  <div className="space-y-3">
                    {dashboardData.upcomingSubscriptions.length === 0 ? (
                      <div className="text-center py-4 text-xs text-muted-foreground">No subscriptions tracking.</div>
                    ) : (
                      dashboardData.upcomingSubscriptions.map((sub) => (
                        <SubscriptionCard
                          key={sub.id}
                          name={sub.name}
                          amount={sub.amount}
                          billingCycle={sub.billingCycle}
                          renewalDate={sub.renewalDate}
                        />
                      ))
                    )}
                  </div>
                </div>
              </FinanceCard>

              {/* Add Bill / Subscription scheduler */}
              <div className="space-y-6">
                <FinanceCard title="Schedule Upcoming Bill" accentColor="orange">
                  <form onSubmit={billForm.handleSubmit(onBillSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Bill Name</label>
                        <Input
                          placeholder="Electric, Water Bill"
                          {...billForm.register("name")}
                          className="bg-muted/10 border-border/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Amount ($)</label>
                        <Input
                          type="number"
                          {...billForm.register("amount")}
                          className="bg-muted/10 border-border/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Due Date</label>
                        <Input
                          type="date"
                          {...billForm.register("dueDate")}
                          className="bg-muted/10 border-border/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Interval</label>
                        <select
                          {...billForm.register("recurringInterval")}
                          className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 h-9"
                        >
                          <option>MONTHLY</option>
                          <option>YEARLY</option>
                          <option>WEEKLY</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Schedule Bill
                    </button>
                  </form>
                </FinanceCard>

                <FinanceCard title="Configure Subscription" accentColor="pink">
                  <form onSubmit={subscriptionForm.handleSubmit(onSubscriptionSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Service Name</label>
                        <Input
                          placeholder="Netflix, Spotify"
                          {...subscriptionForm.register("name")}
                          className="bg-muted/10 border-border/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Price ($)</label>
                        <Input
                          type="number"
                          step="0.01"
                          {...subscriptionForm.register("amount")}
                          className="bg-muted/10 border-border/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Renewal Date</label>
                        <Input
                          type="date"
                          {...subscriptionForm.register("renewalDate")}
                          className="bg-muted/10 border-border/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Billing cycle</label>
                        <select
                          {...subscriptionForm.register("billingCycle")}
                          className="w-full rounded-lg border border-border/40 bg-card/60 backdrop-blur-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 h-9"
                        >
                          <option>MONTHLY</option>
                          <option>YEARLY</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Add Subscription
                    </button>
                  </form>
                </FinanceCard>
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS & ANALYTICS */}
          {activeTab === "reports" && (
            <div className="space-y-6 select-none">
              <div className="flex justify-between items-center border-b border-border/40 dark:border-border/10 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Financial Cash Flow Analytics</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Consolidated cash flows, category allocations, savings targets, and budget comparisons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Report Export: File download trigger mockup.")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" /> Export PDF (Mockup)
                </button>
              </div>

              {/* Monthly totals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Monthly net savings</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-emerald-500 leading-none">
                      ${(reportData?.monthlyReport.savings || 0).toFixed(2)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Income: ${(reportData?.monthlyReport.income || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Annualized projections</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-foreground leading-none">
                      ${(reportData?.yearlyReport.income || 0).toFixed(2)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Savings projection: ${(reportData?.yearlyReport.savings || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Spending efficiency</span>
                  <div className="my-3">
                    <p className="text-sm font-bold text-foreground leading-relaxed">
                      {spendingIns.getMonthlyEfficiency()}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Top Merchant: {spendingIns.getTopMerchant()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash flow Trend Chart */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Cash Flow Trends</p>
                  {reportData?.incomeVsExpense && (
                    <CashFlowChart data={reportData.incomeVsExpense} />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Category distributions</p>
                  <div className="space-y-3 bg-card border border-border/30 p-4 rounded-xl">
                    {reportData?.categoryBreakdown.map((cb) => (
                      <div key={cb.categoryId} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-medium">
                          <span>{cb.categoryName}</span>
                          <span className="font-mono text-muted-foreground">${cb.amount.toFixed(0)} ({cb.percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${cb.percentage}%`, backgroundColor: cb.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
