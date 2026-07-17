"use client"

import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 border border-indigo-500/10">
        <Sparkles className="h-6 w-6" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        404 - Page Not Found
      </h1>
      <p className="mt-3 text-sm text-slate-400 text-center max-w-sm leading-relaxed">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/10 border-0 h-10 px-6 font-semibold flex items-center gap-1.5 cursor-pointer"
          )}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Safety
        </Link>
      </div>
    </div>
  )
}
