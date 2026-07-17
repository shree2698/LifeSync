"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useAuthStore, useThemeStore } from "@lifesync/hooks"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state: any) => state.checkSession)
  const setTheme = useThemeStore((state: any) => state.setTheme)

  React.useEffect(() => {
    // Check session on app load
    checkSession()

    // Sync theme on mount
    const savedTheme = localStorage.getItem("lifesync-theme") as any
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme("dark")
    }
  }, [checkSession, setTheme])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
