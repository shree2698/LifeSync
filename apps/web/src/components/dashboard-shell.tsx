"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  LayoutDashboard,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  Check,
  Trash2,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  CheckSquare,
  Flame,
  Target,
  Clipboard,
  Calendar as CalendarIcon,
  Layers,
} from "lucide-react"
import { useAuthStore, useNotificationStore, useThemeStore } from "@lifesync/hooks"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, isAuthenticated, isLoading, logout } = useAuthStore()
  const { theme } = useThemeStore()

  // Notification state
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = React.useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false)

  // Route protection
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch notifications on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [isAuthenticated, fetchNotifications])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 animate-bounce">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
            Configuring LifeSync OS...
          </p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Workspace", href: "/ai", icon: Sparkles },
    { label: "Automations", href: "/automations", icon: Zap },
    { label: "Integrations", href: "/integrations", icon: Layers },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Habits", href: "/habits", icon: Flame },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Notes", href: "/notes", icon: Clipboard },
    { label: "Calendar", href: "/calendar", icon: CalendarIcon },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background">
      {/* SIDEBAR - Desktop */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r border-border/60 bg-card/60 backdrop-blur-lg dark:border-border/10 p-5 space-y-8 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow shadow-indigo-500/20">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            LifeSync
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-muted-foreground"}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-border/40 dark:border-border/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 dark:bg-muted/10">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar || ""} />
                <AvatarFallback>
                  {profile?.fullName?.substring(0, 2).toUpperCase() || "LS"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                  {profile?.fullName || "LifeSync User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                  {user?.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition p-1.5 rounded-lg hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP BAR */}
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background/50 backdrop-blur-md dark:border-border/10 px-4 md:px-6 select-none">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground transition p-1.5 rounded-xl hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Quick search... (⌘K)"
                className="h-9 w-60 rounded-xl bg-muted/40 pl-9 pr-4 text-xs transition border border-transparent focus:border-border focus:bg-background outline-none text-foreground dark:bg-muted/10 dark:focus:bg-zinc-900"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationPanelOpen(true)}
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 dark:hover:bg-muted/20 transition-all duration-200"
              aria-label="Notification center"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
              )}
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-1 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all duration-200"
              >
                <Avatar className="h-8.5 w-8.5">
                  <AvatarImage src={profile?.avatar || ""} />
                  <AvatarFallback>
                    {profile?.fullName?.substring(0, 2).toUpperCase() || "LS"}
                  </AvatarFallback>
                </Avatar>
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 z-20 origin-top-right rounded-2xl border border-border/60 bg-card p-2.5 shadow-xl outline-none dark:border-border/10"
                    >
                      <div className="px-2.5 py-2 border-b border-border/40 dark:border-border/10 text-xs">
                        <p className="font-semibold text-foreground truncate">{profile?.fullName}</p>
                        <p className="text-muted-foreground truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-1.5 space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>View Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
                        >
                          <Settings className="h-3.5 w-3.5" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center space-x-2 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card p-6 flex flex-col space-y-6 md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-indigo-600 shadow shadow-indigo-600/20">
                    <Sparkles className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    LifeSync
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-xl hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="pt-4 border-t border-border/40 dark:border-border/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 dark:bg-muted/10">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar || ""} />
                      <AvatarFallback>
                        {profile?.fullName?.substring(0, 2).toUpperCase() || "LS"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                        {profile?.fullName}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="text-muted-foreground hover:text-destructive transition p-1.5 rounded-lg hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* NOTIFICATION SLIDE-OUT PANEL */}
      <AnimatePresence>
        {isNotificationPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationPanelOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-card border-l border-border/60 dark:border-border/10 p-6 flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/40 dark:border-border/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4.5 w-4.5 text-indigo-500" />
                  <h3 className="text-base font-bold text-foreground">Notification Center</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-2xs font-bold text-rose-500">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsNotificationPanelOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition p-1.5 rounded-xl hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {notifications.length > 0 && (
                <div className="flex justify-end pt-3 text-xs">
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Mark all read
                  </button>
                </div>
              )}

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto mt-4 space-y-3.5 pr-1">
                {notifications.length === 0 ? (
                  <div className="flex h-72 flex-col items-center justify-center text-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      No new notifications right now. We will update you here.
                    </p>
                  </div>
                ) : (
                  notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`relative flex flex-col p-4 rounded-2xl border transition-all ${
                        notification.read
                          ? "border-border/40 bg-muted/10 text-muted-foreground"
                          : "border-indigo-500/10 bg-indigo-500/5 text-foreground ring-1 ring-indigo-500/5"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold text-foreground">{notification.title}</p>
                        <div className="flex items-center space-x-1.5">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-indigo-500 hover:text-indigo-600 p-0.5 rounded transition"
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-muted-foreground hover:text-destructive p-0.5 rounded transition"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {notification.body}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-2.5 font-mono">
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
