"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, LayoutDashboard } from "lucide-react"
import { LoginForm } from "@/features/auth/components/login-form"
import { useAuthStore } from "@lifesync/hooks"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Left Column: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="absolute top-6 left-6 flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow shadow-indigo-600/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              LifeSync
            </span>
          </Link>
        </div>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <LoginForm />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Premium Banner */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden bg-slate-950 p-12 text-slate-100 flex-col justify-between">
        {/* Decorative background grids */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold text-sm text-slate-400 tracking-wider uppercase">
            Souree Tech Products
          </span>
        </div>

        <div className="relative z-10 my-auto space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            A unified dashboard for your entire life.
          </h2>
          <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-md">
            Simplify daily planning. LifeSync brings together your calendar, water intake, financial ledgers, and habits in an elegant, responsive interface designed to keep you focused.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Aesthetics</p>
              <p className="text-sm font-semibold text-slate-300 mt-1">Apple Minimalist</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">AI Integration</p>
              <p className="text-sm font-semibold text-slate-300 mt-1">Tailored Insights</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-slate-500">
          <span>LifeSync OS v1.0</span>
          <span>&copy; {new Date().getFullYear()} Souree Tech</span>
        </div>
      </div>
    </div>
  )
}
