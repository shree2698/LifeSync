"use client"

import * as React from "react"
import { useAuthStore } from "@lifesync/hooks"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileForm } from "@/features/profile/components/profile-form"

export default function ProfilePage() {
  const { profile, user } = useAuthStore()

  return (
    <DashboardShell>
      <PageContainer>
        <div className="border-b border-border/40 pb-5 dark:border-border/10">
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal credentials, public identity, and details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Avatar / Overview Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center flex flex-col items-center">
              <Avatar className="h-20 w-20 ring-4 ring-indigo-500/10">
                <AvatarImage src={profile?.avatar || ""} />
                <AvatarFallback className="text-lg">
                  {profile?.fullName?.substring(0, 2).toUpperCase() || "LS"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-base font-bold mt-4">
                {profile?.fullName || "LifeSync User"}
              </CardTitle>
              <CardDescription className="text-xs truncate max-w-full">
                {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-border/40 dark:border-border/10 pt-4 space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-[10px] text-foreground font-semibold">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="text-foreground font-semibold uppercase">{user?.authProvider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone</span>
                <span className="text-foreground font-semibold">{profile?.timezone || "UTC"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span className="text-foreground font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Profile Settings</CardTitle>
              <CardDescription className="text-xs">
                Update your account information. These details synchronize with your mobile app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
