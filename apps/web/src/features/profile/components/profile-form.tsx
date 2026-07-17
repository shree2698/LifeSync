"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Sparkles, User, Globe, Calendar, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@lifesync/hooks"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  avatar: z.string().url("Must be a valid image URL").or(z.literal("")),
  timezone: z.string().min(1, "Timezone is required"),
  country: z.string().min(1, "Country is required"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { profile, updateProfile } = useAuthStore()
  const [saveSuccess, setSaveSuccess] = React.useState(false)
  const [saveError, setSaveError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      avatar: profile?.avatar || "",
      timezone: profile?.timezone || "UTC",
      country: profile?.country || "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    setSaveSuccess(false)
    setSaveError(false)

    const success = await updateProfile({
      fullName: data.fullName,
      avatar: data.avatar || null,
      timezone: data.timezone,
      country: data.country || null,
    })

    setIsSubmitting(false)
    if (success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } else {
      setSaveError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="fullName">
            Full Name
          </label>
          <Input
            id="fullName"
            placeholder="John Doe"
            disabled={isSubmitting}
            error={!!errors.fullName}
            icon={<User className="h-4 w-4" />}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Avatar URL */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="avatar">
            Avatar Image URL
          </label>
          <Input
            id="avatar"
            placeholder="https://images.unsplash.com/..."
            disabled={isSubmitting}
            error={!!errors.avatar}
            icon={<Globe className="h-4 w-4" />}
            {...register("avatar")}
          />
          {errors.avatar && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.avatar.message}</p>
          )}
        </div>

        {/* Timezone */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="timezone">
            Timezone
          </label>
          <Input
            id="timezone"
            placeholder="America/New_York"
            disabled={isSubmitting}
            error={!!errors.timezone}
            icon={<Globe className="h-4 w-4" />}
            {...register("timezone")}
          />
          {errors.timezone && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.timezone.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1" htmlFor="country">
            Country
          </label>
          <Input
            id="country"
            placeholder="United States"
            disabled={isSubmitting}
            error={!!errors.country}
            icon={<Globe className="h-4 w-4" />}
            {...register("country")}
          />
          {errors.country && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-3">
        <Button type="submit" disabled={isSubmitting} className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-md shadow-indigo-600/10">
          {isSubmitting ? "Saving Changes..." : "Save Profile"}
        </Button>

        {saveSuccess && (
          <div className="flex items-center space-x-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl animate-fade-in">
            <Check className="h-4 w-4" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="flex items-center space-x-1 text-xs text-destructive font-semibold bg-destructive/10 px-3 py-1.5 rounded-xl animate-fade-in">
            <AlertTriangle className="h-4 w-4" />
            <span>Failed to save changes.</span>
          </div>
        )}
      </div>
    </form>
  )
}
