import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 animate-pulse">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
          Syncing workspace components...
        </p>
      </div>
    </div>
  )
}
