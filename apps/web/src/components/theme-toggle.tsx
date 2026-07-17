"use client"

import * as React from "react"
import { Sun, Moon, Zap } from "lucide-react"
import { useThemeStore } from "@lifesync/hooks"

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
    // Sync current theme with DOM on mount
    const savedTheme = localStorage.getItem("lifesync-theme") as any;
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme("dark")
    }
  }, [setTheme])

  if (!mounted) {
    return <div className="h-8 w-8 rounded-lg bg-muted/20 animate-pulse" />
  }

  return (
    <div className="flex items-center space-x-1.5 rounded-xl bg-muted/60 p-1 border border-border/40 dark:bg-muted/10 dark:border-border/10">
      <button
        onClick={() => setTheme("light")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          theme === "light"
            ? "bg-background text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Light theme"
        title="Light theme"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          theme === "dark"
            ? "bg-background text-primary shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("amoled")}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          theme === "amoled"
            ? "bg-background text-primary shadow-sm dark:bg-black dark:text-yellow-400"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="AMOLED theme"
        title="AMOLED theme"
      >
        <Zap className="h-4 w-4" />
      </button>
    </div>
  )
}
