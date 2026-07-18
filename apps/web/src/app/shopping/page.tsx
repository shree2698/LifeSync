"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Trash2,
  Bookmark,
  TrendingUp,
  RefreshCw,
  Clock,
  Sparkles,
  ClipboardList,
  Eye,
  Heart,
  Archive,
  ArrowRight,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useShoppingStore,
  useShoppingAssistant,
  usePantrySuggestions,
  useMonthlyPlanner,
  useMealPlanner
} from "@lifesync/hooks"
import {
  ShoppingCard,
  StatisticCard,
  ProgressCard,
  ShoppingItemCard,
  PantryCard,
  WishlistCard,
  EssentialItem,
  PriceDisplay,
  CategoryBadge,
  CostTrendChart
} from "@/components/shopping-ui"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Input } from "@/components/ui/input"

// Forms Validation Schemas
const listFormSchema = z.object({
  name: z.string().min(1, "List name is required"),
  color: z.string().optional(),
})

const itemFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().default("pcs"),
  price: z.coerce.number().default(0),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
})

const essentialFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  targetQuantity: z.coerce.number().positive(),
  unit: z.string().default("pcs"),
  estimatedPrice: z.coerce.number().default(0),
  categoryId: z.string().optional(),
})

const pantryFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  currentQuantity: z.coerce.number().default(0),
  minimumQuantity: z.coerce.number().default(0),
  expiryDate: z.string().optional(),
  categoryId: z.string().optional(),
})

const wishlistFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  desiredPrice: z.coerce.number().default(0),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  notes: z.string().optional(),
  categoryId: z.string().optional(),
})

const checkoutFormSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  totalAmount: z.coerce.number().default(0),
  itemsCount: z.coerce.number().default(0),
})

type TabName = "overview" | "lists" | "essentials" | "pantry" | "wishlist" | "history" | "reports"

export default function ShoppingPage() {
  const [activeTab, setActiveTab] = React.useState<TabName>("overview")
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null)

  const {
    shoppingDashboardData,
    shoppingReportData,
    shoppingLists,
    shoppingCategories,
    pantryItems,
    wishlistItems,
    monthlyEssentials,
    purchaseHistory,
    offlineQueue,
    isLoading,
    fetchDashboard,
    fetchReport,
    fetchLists,
    fetchCategories,
    fetchPantry,
    fetchWishlist,
    fetchEssentials,
    fetchHistory,
    addList,
    renameList,
    archiveList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    addEssential,
    checkEssential,
    addPantryItem,
    updatePantryQuantity,
    addWishlistItem,
    markWishlistPurchased,
    logPurchase,
    syncOfflineQueue
  } = useShoppingStore()

  // AI Lifestyles Hook Analysis
  const assistant = useShoppingAssistant()
  const pantrySug = usePantrySuggestions()
  const planner = useMonthlyPlanner()
  const mealPlan = useMealPlanner()

  const [aiAdvice, setAiAdvice] = React.useState("Loading smart grocery advice...")
  const [suggestions, setSuggestions] = React.useState<any[]>([])
  const [essentialsPlannerText, setEssentialsPlannerText] = React.useState("Loading monthly planners...")
  const [meals, setMeals] = React.useState<any[]>([])

  React.useEffect(() => {
    fetchDashboard()
    fetchReport()
    fetchLists()
    fetchCategories()
    fetchPantry()
    fetchWishlist()
    fetchEssentials()
    fetchHistory()

    assistant.getShoppingTips().then(setAiAdvice)
    setSuggestions(pantrySug.getSuggestions())
    planner.generateEssentialsChecklist().then(setEssentialsPlannerText)
    mealPlan.getPlannedMeals().then(setMeals)
  }, [fetchDashboard, fetchReport, fetchLists, fetchCategories, fetchPantry, fetchWishlist, fetchEssentials, fetchHistory])

  // Select list automatically if none selected and lists exist
  React.useEffect(() => {
    if (!selectedListId && shoppingLists.length > 0) {
      setSelectedListId(shoppingLists[0].id)
    }
  }, [shoppingLists, selectedListId])

  // Form Hooks
  const listForm = useForm<z.infer<typeof listFormSchema>>({
    resolver: zodResolver(listFormSchema) as any,
    defaultValues: { name: "", color: "#10B981" },
  })

  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema) as any,
    defaultValues: { name: "", quantity: 1, unit: "pcs", price: 0, categoryId: "" },
  })

  const essentialForm = useForm<z.infer<typeof essentialFormSchema>>({
    resolver: zodResolver(essentialFormSchema) as any,
    defaultValues: { name: "", targetQuantity: 1, unit: "pcs", estimatedPrice: 0, categoryId: "" },
  })

  const pantryForm = useForm<z.infer<typeof pantryFormSchema>>({
    resolver: zodResolver(pantryFormSchema) as any,
    defaultValues: { name: "", currentQuantity: 1, minimumQuantity: 1, expiryDate: "" },
  })

  const wishlistForm = useForm<z.infer<typeof wishlistFormSchema>>({
    resolver: zodResolver(wishlistFormSchema) as any,
    defaultValues: { name: "", desiredPrice: 0, priority: "MEDIUM", notes: "" },
  })

  const checkoutForm = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema) as any,
    defaultValues: { storeName: "", totalAmount: 0, itemsCount: 0 },
  })

  // Submit Actions
  const onListSubmit = async (data: z.infer<typeof listFormSchema>) => {
    await addList(data.name, data.color)
    listForm.reset()
  }

  const onItemSubmit = async (data: z.infer<typeof itemFormSchema>) => {
    if (!selectedListId) return
    await addItem(
      selectedListId,
      data.name,
      data.quantity,
      data.unit,
      data.price,
      data.categoryId || null,
      data.notes || null
    )
    itemForm.reset()
  }

  const onEssentialSubmit = async (data: z.infer<typeof essentialFormSchema>) => {
    await addEssential(data.name, data.targetQuantity, data.unit, data.estimatedPrice, data.categoryId || null)
    essentialForm.reset()
  }

  const onPantrySubmit = async (data: z.infer<typeof pantryFormSchema>) => {
    await addPantryItem(
      data.name,
      data.currentQuantity,
      data.minimumQuantity,
      data.expiryDate || null,
      data.categoryId || null
    )
    pantryForm.reset()
  }

  const onWishlistSubmit = async (data: z.infer<typeof wishlistFormSchema>) => {
    await addWishlistItem(data.name, data.desiredPrice, data.priority, data.notes || null, data.categoryId || null)
    wishlistForm.reset()
  }

  const onCheckoutSubmit = async (data: z.infer<typeof checkoutFormSchema>) => {
    await logPurchase(data.storeName, data.totalAmount, data.itemsCount)
    checkoutForm.reset()
  }

  const selectedList = shoppingLists.find((l) => l.id === selectedListId)

  if (isLoading || !shoppingDashboardData) {
    return (
      <DashboardShell>
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-[500px]">
            <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Synchronizing lifestyle catalog...</p>
          </div>
        </PageContainer>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <PageContainer>
        {/* Header section with offline queue */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-5 select-none">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Shopping & Essentials</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Active lists tracking, pantry inventory stocks, recurring essentials, wishlists, and spending analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {offlineQueue.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-yellow-500 font-bold font-mono">
                  {offlineQueue.length} Offline Items Pending
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
              onClick={() => fetchDashboard()}
              className="bg-muted hover:bg-muted/80 text-foreground border border-border/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 border-b border-border/40 dark:border-border/10 my-6 scrollbar-thin select-none">
          {[
            { id: "overview", label: "Shopping Dashboard", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
            { id: "lists", label: "Shopping Lists", icon: <ShoppingCart className="h-3.5 w-3.5" /> },
            { id: "essentials", label: "Monthly Essentials", icon: <Bookmark className="h-3.5 w-3.5" /> },
            { id: "pantry", label: "Pantry Stocks", icon: <ClipboardList className="h-3.5 w-3.5" /> },
            { id: "wishlist", label: "Wishlist", icon: <Heart className="h-3.5 w-3.5" /> },
            { id: "history", label: "Shopping History", icon: <Clock className="h-3.5 w-3.5" /> },
            { id: "reports", label: "Reports & Analytics", icon: <TrendingUp className="h-3.5 w-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabName)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10"
                  : "border-border/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab views */}
        <div className="grid grid-cols-1 gap-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats blocks */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatisticCard
                  title="Estimated Shopping Cost"
                  value={`$${shoppingDashboardData.estimatedTotalCost.toFixed(2)}`}
                  subtitle={`${shoppingDashboardData.pendingItemsCount} items remaining`}
                  icon={<ShoppingCart className="h-4 w-4 text-emerald-500" />}
                  variant="emerald"
                />
                <StatisticCard
                  title="Low Stock Alarms"
                  value={`${shoppingDashboardData.lowStockItems.length} items`}
                  subtitle="pantry needs restocking"
                  icon={<ClipboardList className="h-4 w-4 text-orange-500" />}
                  variant="orange"
                />
                <StatisticCard
                  title="Monthly spent"
                  value={`$${shoppingDashboardData.shoppingStatistics.totalSpentThisMonth.toFixed(0)}`}
                  subtitle={`${shoppingDashboardData.shoppingStatistics.itemsBoughtThisMonth} items checked out`}
                  icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                  variant="blue"
                />
              </div>

              {/* AI Shopping Assistant */}
              <div className="space-y-6">
                <ShoppingCard title="✦ AI Smart Shopping Assistant" accentColor="violet">
                  <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl space-y-3">
                    <p className="text-xs text-foreground font-sans leading-relaxed">{aiAdvice}</p>
                    <p className="text-[11px] text-muted-foreground italic">"{essentialsPlannerText}"</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Weekly Meal Planning Placeholders
                    </p>
                    <div className="space-y-2">
                      {meals.map((m, i) => (
                        <div key={i} className="flex justify-between items-center bg-muted/20 border border-border/20 p-2.5 rounded-lg text-[10px]">
                          <span className="font-semibold">{m.day}: {m.meal}</span>
                          <span className="font-mono text-muted-foreground">{m.ingredients.length} items</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ShoppingCard>
              </div>

              {/* Today's Checklist */}
              <div className="md:col-span-2 space-y-6">
                <ShoppingCard title="Pending Shopping Items Checklist" subtitle="Complete shopping list items on the go.">
                  <div className="space-y-3">
                    {shoppingDashboardData.todayShopping.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground">All items cleared! No pending shopping.</div>
                    ) : (
                      shoppingDashboardData.todayShopping.map((item) => (
                        <ShoppingItemCard
                          key={item.id}
                          name={item.name}
                          quantity={item.quantity}
                          unit={item.unit}
                          price={item.price}
                          isCompleted={item.isCompleted}
                          isFavorite={item.isFavorite}
                          notes={item.notes}
                          categoryName={item.category?.name || "Groceries"}
                          categoryColor={item.category?.color}
                          onToggleComplete={() => updateItem(item.id, { isCompleted: !item.isCompleted })}
                          onToggleFavorite={() => updateItem(item.id, { isFavorite: !item.isFavorite })}
                          onDelete={() => deleteItem(item.id)}
                        />
                      ))
                    )}
                  </div>
                </ShoppingCard>
              </div>

              {/* Restock suggestions */}
              <div className="space-y-6">
                <ShoppingCard title="Pantry Restock Alerts" accentColor="orange">
                  <div className="space-y-3">
                    {suggestions.map((s, i) => (
                      <div key={i} className="flex justify-between items-start bg-muted/10 border border-border/20 p-2.5 rounded-xl text-[10px]">
                        <div>
                          <p className="font-bold text-foreground">{s.name}</p>
                          <p className="text-muted-foreground mt-0.5">{s.reason}</p>
                        </div>
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </ShoppingCard>
              </div>
            </div>
          )}

          {/* TAB 2: SHOPPING LISTS */}
          {activeTab === "lists" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lists Side bar Selector */}
              <div className="space-y-6">
                <ShoppingCard title="My Shopping Lists" accentColor="emerald">
                  <div className="space-y-2">
                    {shoppingLists.map((l) => {
                      const isSelected = l.id === selectedListId
                      return (
                        <div
                          key={l.id}
                          onClick={() => setSelectedListId(l.id)}
                          className={cn(
                            "flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer",
                            isSelected
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10"
                              : "border-border/40 bg-muted/10 hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="text-xs font-bold">{l.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono opacity-85">
                              {l.items?.length || 0} items
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteList(l.id)
                              }}
                              className="text-white hover:text-rose-200 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <form onSubmit={listForm.handleSubmit(onListSubmit)} className="mt-4 border-t border-border/10 pt-4 space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Create New List</p>
                    <Input
                      placeholder="e.g. Christmas Dinner, Costco Runs"
                      {...listForm.register("name")}
                      className="bg-muted/10 border-border/40 text-xs h-8"
                    />
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      Add List
                    </button>
                  </form>
                </ShoppingCard>
              </div>

              {/* Items checklist inside list */}
              <div className="md:col-span-2 space-y-6">
                {selectedList ? (
                  <ShoppingCard
                    title={`Items inside: ${selectedList.name}`}
                    subtitle="Manage catalog quantities, categories, and estimated costs."
                    action={
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => archiveList(selectedList.id)}
                          className="bg-muted hover:bg-muted/80 text-foreground border border-border/40 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Archive className="h-3 w-3" /> Archive
                        </button>
                      </div>
                    }
                  >
                    <div className="space-y-3 mb-6">
                      {selectedList.items?.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground">List is empty. Add items below.</div>
                      ) : (
                        selectedList.items?.map((item) => (
                          <ShoppingItemCard
                            key={item.id}
                            name={item.name}
                            quantity={item.quantity}
                            unit={item.unit}
                            price={item.price}
                            isCompleted={item.isCompleted}
                            isFavorite={item.isFavorite}
                            notes={item.notes}
                            categoryName={item.category?.name || "Groceries"}
                            categoryColor={item.category?.color}
                            onToggleComplete={() => updateItem(item.id, { isCompleted: !item.isCompleted })}
                            onToggleFavorite={() => updateItem(item.id, { isFavorite: !item.isFavorite })}
                            onDelete={() => deleteItem(item.id)}
                          />
                        ))
                      )}
                    </div>

                    <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="border-t border-border/10 pt-4 space-y-4">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quick Add Item</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Item Name</label>
                          <Input
                            placeholder="e.g. Milk, Avocados"
                            {...itemForm.register("name")}
                            className="bg-muted/10 border-border/40 h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Category</label>
                          <select
                            {...itemForm.register("categoryId")}
                            className="w-full rounded-lg border border-border/40 bg-card/60 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 h-9"
                          >
                            <option value="">Select Category</option>
                            {shoppingCategories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Qty</label>
                          <Input
                            type="number"
                            {...itemForm.register("quantity")}
                            className="bg-muted/10 border-border/40 h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Unit</label>
                          <Input
                            placeholder="pcs, bag, gallons"
                            {...itemForm.register("unit")}
                            className="bg-muted/10 border-border/40 h-9 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Est. Price ($)</label>
                          <Input
                            type="number"
                            step="0.01"
                            {...itemForm.register("price")}
                            className="bg-muted/10 border-border/40 h-9 text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Add Item
                      </button>
                    </form>
                  </ShoppingCard>
                ) : (
                  <div className="text-center py-12 text-xs text-muted-foreground">Select or create a shopping list first.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY ESSENTIALS */}
          {activeTab === "essentials" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Essential Form */}
              <ShoppingCard title="Add Recurring Essential Item" accentColor="orange">
                <form onSubmit={essentialForm.handleSubmit(onEssentialSubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Essential Name</label>
                    <Input
                      placeholder="e.g. Dishwasher Pods, Rice"
                      {...essentialForm.register("name")}
                      className="bg-muted/10 border-border/40 text-xs h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Category</label>
                      <select
                        {...essentialForm.register("categoryId")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 p-2 text-xs focus:outline-none h-9"
                      >
                        <option value="">Select Category</option>
                        {shoppingCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Qty</label>
                        <Input
                          type="number"
                          {...essentialForm.register("targetQuantity")}
                          className="bg-muted/10 border-border/40 text-xs h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Unit</label>
                        <Input
                          placeholder="pcs"
                          {...essentialForm.register("unit")}
                          className="bg-muted/10 border-border/40 text-xs h-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Estimated Monthly Cost ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...essentialForm.register("estimatedPrice")}
                      className="bg-muted/10 border-border/40 text-xs h-9"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Register Essential
                  </button>
                </form>
              </ShoppingCard>

              {/* Essentials Checklist */}
              <ShoppingCard title="Monthly Essentials Checklist" accentColor="orange">
                <div className="space-y-3">
                  {monthlyEssentials.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">No recurring essentials registered.</div>
                  ) : (
                    monthlyEssentials.map((e) => (
                      <EssentialItem
                        key={e.id}
                        name={e.name}
                        targetQuantity={e.targetQuantity}
                        unit={e.unit}
                        estimatedPrice={e.estimatedPrice}
                        isCompleted={e.isCompleted}
                        categoryName={e.category?.name || "Essentials"}
                        categoryColor={e.category?.color}
                        onToggle={() => checkEssential(e.id, !e.isCompleted)}
                      />
                    ))
                  )}
                </div>
              </ShoppingCard>
            </div>
          )}

          {/* TAB 4: PANTRY STOCKS */}
          {activeTab === "pantry" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Pantry Item */}
              <ShoppingCard title="Register Pantry Inventory Item" accentColor="blue">
                <form onSubmit={pantryForm.handleSubmit(onPantrySubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Item Name</label>
                    <Input
                      placeholder="e.g. Olive Oil, Garlic Pods"
                      {...pantryForm.register("name")}
                      className="bg-muted/10 border-border/40 text-xs h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Category</label>
                      <select
                        {...pantryForm.register("categoryId")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 p-2 text-xs focus:outline-none h-9"
                      >
                        <option value="">Select Category</option>
                        {shoppingCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Expiry Date</label>
                      <Input
                        type="date"
                        {...pantryForm.register("expiryDate")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Current Stock Quantity</label>
                      <Input
                        type="number"
                        step="0.1"
                        {...pantryForm.register("currentQuantity")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Minimum Alert Threshold</label>
                      <Input
                        type="number"
                        step="0.1"
                        {...pantryForm.register("minimumQuantity")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Add Pantry Stock
                  </button>
                </form>
              </ShoppingCard>

              {/* Pantry Stock Lists */}
              <ShoppingCard title="Pantry Stock Inventory" accentColor="blue">
                <div className="space-y-4">
                  {pantryItems.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">Pantry inventory is empty.</div>
                  ) : (
                    pantryItems.map((p) => (
                      <PantryCard
                        key={p.id}
                        name={p.name}
                        currentQuantity={p.currentQuantity}
                        minimumQuantity={p.minimumQuantity}
                        expiryDate={p.expiryDate}
                        categoryName={p.category?.name || "Pantry"}
                        categoryColor={p.category?.color}
                        onQuantityChange={(qty) => updatePantryQuantity(p.id, qty)}
                      />
                    ))
                  )}
                </div>
              </ShoppingCard>
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Wishlist Item */}
              <ShoppingCard title="Register Product Wish" accentColor="violet">
                <form onSubmit={wishlistForm.handleSubmit(onWishlistSubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Product Name</label>
                    <Input
                      placeholder="e.g. Mechanical Keyboard RGB, Run Shoes"
                      {...wishlistForm.register("name")}
                      className="bg-muted/10 border-border/40 text-xs h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Target desired price ($)</label>
                      <Input
                        type="number"
                        {...wishlistForm.register("desiredPrice")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Priority</label>
                      <select
                        {...wishlistForm.register("priority")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 p-2 text-xs focus:outline-none h-9"
                      >
                        <option>LOW</option>
                        <option>MEDIUM</option>
                        <option>HIGH</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Category</label>
                      <select
                        {...wishlistForm.register("categoryId")}
                        className="w-full rounded-lg border border-border/40 bg-card/60 p-2 text-xs focus:outline-none h-9"
                      >
                        <option value="">Select Category</option>
                        {shoppingCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Notes</label>
                      <Input
                        placeholder="e.g. Wait for Black Friday sale..."
                        {...wishlistForm.register("notes")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Add Product Wish
                  </button>
                </form>
              </ShoppingCard>

              {/* Wishlist item checks */}
              <ShoppingCard title="Future Desires Wishlist" accentColor="violet">
                <div className="space-y-3">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">Wishlist is empty.</div>
                  ) : (
                    wishlistItems.map((w) => (
                      <WishlistCard
                        key={w.id}
                        name={w.name}
                        desiredPrice={w.desiredPrice}
                        priority={w.priority}
                        notes={w.notes}
                        isPurchased={w.isPurchased}
                        categoryName={w.category?.name || "Wish"}
                        categoryColor={w.category?.color}
                        onTogglePurchased={() => markWishlistPurchased(w.id, !w.isPurchased)}
                      />
                    ))
                  )}
                </div>
              </ShoppingCard>
            </div>
          )}

          {/* TAB 6: SHOPPING HISTORY */}
          {activeTab === "history" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Log Checkout record */}
              <ShoppingCard title="Log Stores Purchase Record" accentColor="orange">
                <form onSubmit={checkoutForm.handleSubmit(onCheckoutSubmit)} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Store / Merchant Name</label>
                    <Input
                      placeholder="e.g. Costco Wholesale, Whole Foods"
                      {...checkoutForm.register("storeName")}
                      className="bg-muted/10 border-border/40 text-xs h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Checkout Amount ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        {...checkoutForm.register("totalAmount")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Items count</label>
                      <Input
                        type="number"
                        {...checkoutForm.register("itemsCount")}
                        className="bg-muted/10 border-border/40 text-xs h-9"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Log Purchase
                  </button>
                </form>
              </ShoppingCard>

              {/* History list */}
              <ShoppingCard title="Purchase History Logs" accentColor="orange">
                <div className="space-y-3">
                  {purchaseHistory.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">No purchase records registered yet.</div>
                  ) : (
                    purchaseHistory.map((ph) => (
                      <div
                        key={ph.id}
                        className="flex justify-between items-center bg-muted/20 border border-border/20 p-3 rounded-xl hover:border-orange-500/20 hover:bg-orange-500/[0.01] transition-all"
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{ph.storeName || "Manual Checkout"}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-1 font-mono">
                            <Clock className="h-2.5 w-2.5" /> Date: {new Date(ph.purchaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          {ph.details && (
                            <p className="text-[9px] text-muted-foreground mt-1 line-clamp-1 italic">
                              "{ph.details}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-foreground">${ph.totalAmount.toFixed(2)}</span>
                          <p className="text-[8px] text-muted-foreground font-mono mt-0.5">{ph.itemsCount} items</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ShoppingCard>
            </div>
          )}

          {/* TAB 7: REPORTS & ANALYTICS */}
          {activeTab === "reports" && (
            <div className="space-y-6 select-none">
              <div className="flex justify-between items-center border-b border-border/40 dark:border-border/10 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Shopping Spending & variance analysis</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Consolidated spent summaries, category breakdowns, and actual vs estimated variances.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Shopping Report Export: File download trigger mockup.")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  Export PDF (Mockup)
                </button>
              </div>

              {/* Monthly totals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Monthly shopping spent</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-emerald-500 leading-none">
                      ${(shoppingReportData?.monthlyShoppingSummary.spent || 0).toFixed(2)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Total items bought: {shoppingReportData?.monthlyShoppingSummary.itemsCount || 0} items
                    </p>
                  </div>
                </div>

                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Wishlist potential cost</span>
                  <div className="my-3">
                    <p className="text-xl font-bold font-mono text-foreground leading-none">
                      ${wishlistItems.filter(w => !w.isPurchased).reduce((sum, w) => sum + w.desiredPrice, 0).toFixed(2)}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Active wishes count: {wishlistItems.filter(w => !w.isPurchased).length} items
                    </p>
                  </div>
                </div>

                <div className="bg-muted/10 border border-border/40 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">Frequently purchased items</span>
                  <div className="my-2 space-y-1.5">
                    {shoppingReportData?.frequentlyPurchasedItems.map((f, i) => (
                      <div key={i} className="flex justify-between text-[10px] font-medium">
                        <span>{f.name}</span>
                        <span className="font-mono text-muted-foreground">{f.count} checkouts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SVGs cost variance charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Spent vs Estimated variance</p>
                  {shoppingReportData?.estimatedVsActualCost && (
                    <CostTrendChart data={shoppingReportData.estimatedVsActualCost} />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Category distribution</p>
                  <div className="space-y-3 bg-card border border-border/30 p-4 rounded-xl">
                    {shoppingReportData?.categoryBreakdown.map((cb) => (
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
