"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Shield, Sparkles, Activity, Target, Landmark } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { useAuthStore } from "@lifesync/hooks"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // Redirect to dashboard if logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LifeSync
            </span>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#about" className="hover:text-white transition">Productivity</a>
            <a href="#pricing" className="hover:text-white transition">System</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition px-3 py-1.5">
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/10 border-0 flex items-center gap-1 h-9 px-4 cursor-pointer text-sm font-medium"
              )}
            >
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-xs text-indigo-400 mb-6">
          <Sparkles className="h-3.5 w-3.5" /> Introducing LifeSync OS v1.0
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-500 bg-clip-text text-transparent max-w-4xl leading-[1.15] sm:leading-[1.1]">
          The AI-Powered Life Operating System
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Unify your tasks, habits, goals, calendar, health, and finances inside a single, beautifully cohesive workspace. Powered by tailored AI insights.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-12 px-8 bg-white hover:bg-slate-100 text-slate-900 rounded-xl shadow-xl font-semibold flex items-center gap-1.5 text-base cursor-pointer"
            )}
          >
            Get Started for Free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#demo"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 px-8 rounded-xl border-white/10 hover:bg-white/5 hover:text-white bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-base cursor-pointer text-slate-200"
            )}
          >
            Watch Demo
          </a>
        </div>

        {/* Dashboard Preview Mockup */}
        <div id="demo" className="mt-20 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-md ring-1 ring-white/5 max-w-4xl relative">
          <div className="absolute top-[-5px] left-[50%] translate-x-[-50%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <div className="flex space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <div className="rounded bg-white/5 px-12 py-1 text-[10px] text-slate-400 font-mono tracking-wide">
              lifesync.app/dashboard
            </div>
            <div className="w-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Widget 1 */}
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between mb-3 text-indigo-400">
                <Target className="h-5 w-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Goals</span>
              </div>
              <h4 className="font-semibold text-slate-200">Launch Phase 1</h4>
              <p className="text-xs text-slate-400 mt-1">Develop web & mobile layouts</p>
              <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: "85%" }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
                <span>85% complete</span>
                <span>15% remaining</span>
              </div>
            </div>

            {/* Widget 2 */}
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between mb-3 text-violet-400">
                <Activity className="h-5 w-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Health Tracker</span>
              </div>
              <h4 className="font-semibold text-slate-200">Water & Sleep</h4>
              <p className="text-xs text-slate-400 mt-1">Hydration goal: 3L daily</p>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <span className="text-2xl font-bold font-mono text-slate-100">1,500</span>
                  <span className="text-xs text-slate-400 ml-1">/ 3,000 ml</span>
                </div>
                <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                  50% Done
                </div>
              </div>
            </div>

            {/* Widget 3 */}
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between mb-3 text-pink-400">
                <Landmark className="h-5 w-5" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Finance</span>
              </div>
              <h4 className="font-semibold text-slate-200">Cash Flow</h4>
              <p className="text-xs text-slate-400 mt-1">July Overview</p>
              <div className="flex justify-between items-center mt-5">
                <div>
                  <p className="text-[10px] text-slate-500">SAVINGS</p>
                  <p className="text-sm font-bold font-mono text-slate-200">$4,750</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">EXPENSES</p>
                  <p className="text-sm font-bold font-mono text-rose-400">-$3,450</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-slate-900/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              One Workspace. Endless Harmony.
            </h2>
            <p className="mt-4 text-slate-400">
              Stop context-switching between a dozen productivity apps. LifeSync connects the dots across every aspect of your life.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/30 hover:border-indigo-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-200">Task Management</h3>
              <p className="mt-2 text-sm text-slate-400">
                Organize daily agendas, subtasks, and priority labels in a unified dashboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/30 hover:border-indigo-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-200">Habit Tracking</h3>
              <p className="mt-2 text-sm text-slate-400">
                Create streaks, logs, and notifications to hold yourself accountable.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/30 hover:border-indigo-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-200">Financial Ledger</h3>
              <p className="mt-2 text-sm text-slate-400">
                Track income, manage monthly budgets, and optimize savings goals easily.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/30 hover:border-indigo-500/20 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-200">Biometric Sync</h3>
              <p className="mt-2 text-sm text-slate-400">
                Monitor sleep, hydration, workouts, and medication routines in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="font-bold text-slate-400">LifeSync</span>
            <span>by Souree Tech</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Souree Tech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
