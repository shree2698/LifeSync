"use client"

import * as React from "react"
import { ErrorState } from "@/components/error-state"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log error details if needed
    console.error("Layout/Page level error caught:", error)
  }, [error])

  return (
    <div className="flex h-screen w-screen items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <ErrorState
          title="Something went wrong"
          description="LifeSync encountered an issue building this page. Please try refreshing or clearing cached workspace assets."
          retryLabel="Reset & Retry"
          onRetry={reset}
        />
      </div>
    </div>
  )
}
