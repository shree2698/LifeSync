"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@lifesync/hooks"

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const { register: registerUser, isLoading, error: authError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    const success = await registerUser(data.email, data.fullName)
    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-violet-950/40">
          <Sparkles className="h-5 w-5 text-indigo-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to register and set up your LifeSync workspace
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="fullName">
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                disabled={isLoading}
                error={!!errors.fullName}
                icon={<User className="h-4 w-4" />}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                error={!!errors.email}
                icon={<Mail className="h-4 w-4" />}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                disabled={isLoading}
                error={!!errors.password}
                icon={<Lock className="h-4 w-4" />}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {authError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {authError}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow-md shadow-indigo-600/10">
              {isLoading ? "Creating account..." : "Sign Up"} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-semibold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            className="rounded-xl h-10 border-border/80 hover:bg-muted font-medium flex items-center justify-center gap-2 cursor-pointer"
            onClick={async () => {
              const success = await registerUser("demo.google@souree.com", "Google User")
              if (success) router.push("/dashboard")
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            className="rounded-xl h-10 border-border/80 hover:bg-muted font-medium flex items-center justify-center gap-2 cursor-pointer"
            onClick={async () => {
              const success = await registerUser("demo.apple@souree.com", "Apple User")
              if (success) router.push("/dashboard")
            }}
          >
            <span className="text-sm font-semibold"></span>
            Apple
          </Button>
        </div>
      </div>
    </div>
  )
}
