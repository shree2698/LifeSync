"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Bell, Shield, DollarSign, Globe, Check, AlertTriangle, Moon, Sun, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@lifesync/hooks"
import { SettingsService } from "@lifesync/services"
import { ThemeMode } from "@lifesync/types"

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "amoled"]),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  pushNotifications: z.boolean(),
  currency: z.string().min(1, "Currency is required"),
  language: z.string().min(1, "Language is required"),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const { theme, setTheme } = useThemeStore()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)
  const [saveError, setSaveError] = React.useState(false)
  const [defaultValues, setDefaultValues] = React.useState<SettingsFormValues | null>(null)

  // Fetch settings on mount
  React.useEffect(() => {
    async function loadSettings() {
      const res = await SettingsService.getSettings()
      if (res.success && res.data) {
        setDefaultValues({
          theme: res.data.theme as ThemeMode,
          marketingEmails: res.data.marketingEmails,
          securityAlerts: res.data.securityAlerts,
          pushNotifications: res.data.pushNotifications,
          currency: res.data.currency,
          language: res.data.language,
        })
      }
    }
    loadSettings()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: defaultValues || {
      theme: "dark",
      marketingEmails: false,
      securityAlerts: true,
      pushNotifications: true,
      currency: "USD",
      language: "en",
    },
  })

  const watchedTheme = watch("theme")

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true)
    setSaveSuccess(false)
    setSaveError(false)

    // Save themes to local theme store
    setTheme(data.theme)

    const res = await SettingsService.updateSettings({
      theme: data.theme,
      marketingEmails: data.marketingEmails,
      securityAlerts: data.securityAlerts,
      pushNotifications: data.pushNotifications,
      currency: data.currency,
      language: data.language,
    })

    setIsSubmitting(false)
    if (res.success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      setSaveError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Theme Choice Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          System Theme Mode
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "light" as const, label: "Light Theme", icon: Sun, desc: "Classic light background" },
            { id: "dark" as const, label: "Dark Theme", icon: Moon, desc: "Muted dark blue shades" },
            { id: "amoled" as const, label: "AMOLED Dark", icon: Zap, desc: "Pure pitch black look" },
          ].map((mode) => {
            const Icon = mode.icon
            const isSelected = watchedTheme === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setValue("theme", mode.id)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-500/5 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10"
                    : "border-border/60 hover:border-border hover:bg-muted/30 dark:border-border/10"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-indigo-500/20 text-indigo-500" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold mt-4 text-foreground">{mode.label}</span>
                <span className="text-[10px] text-muted-foreground mt-1">{mode.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40 dark:border-border/10">
        {/* Localization & Preferences */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            General Preferences
          </h3>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="currency">
              <DollarSign className="h-3.5 w-3.5 text-indigo-500" /> Default Currency
            </label>
            <select
              id="currency"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring text-foreground"
              {...register("currency")}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5" htmlFor="language">
              <Globe className="h-3.5 w-3.5 text-indigo-500" /> Interface Language
            </label>
            <select
              id="language"
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring text-foreground"
              {...register("language")}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        {/* Notifications & Security */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Alerts & Notifications
          </h3>

          <div className="space-y-3.5">
            <label className="flex items-center space-x-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4.5 w-4.5 rounded-lg border-input bg-background text-indigo-600 focus:ring-ring"
                {...register("pushNotifications")}
              />
              <div>
                <p className="text-xs font-semibold text-foreground">Push Notifications</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Receive reminders on your phone & browser.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4.5 w-4.5 rounded-lg border-input bg-background text-indigo-600 focus:ring-ring"
                {...register("securityAlerts")}
              />
              <div>
                <p className="text-xs font-semibold text-foreground">Security Notifications</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Alert on password resets or changes.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4.5 w-4.5 rounded-lg border-input bg-background text-indigo-600 focus:ring-ring"
                {...register("marketingEmails")}
              />
              <div>
                <p className="text-xs font-semibold text-foreground">Marketing & Digest Emails</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Get weekly wellness and productivity digests.</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-3 border-t border-border/40 dark:border-border/10">
        <Button type="submit" disabled={isSubmitting} className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-md shadow-indigo-600/10">
          {isSubmitting ? "Saving Preferences..." : "Save Settings"}
        </Button>

        {saveSuccess && (
          <div className="flex items-center space-x-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl">
            <Check className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="flex items-center space-x-1 text-xs text-destructive font-semibold bg-destructive/10 px-3 py-1.5 rounded-xl">
            <AlertTriangle className="h-4 w-4" />
            <span>Failed to save preferences.</span>
          </div>
        )}
      </div>
    </form>
  )
}
