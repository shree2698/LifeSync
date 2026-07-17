"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/features/settings/components/settings-form"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <PageContainer>
        <div className="border-b border-border/40 pb-5 dark:border-border/10">
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure default preferences, regional options, theme layouts, and active notifications.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Preferences & Theme</CardTitle>
            <CardDescription className="text-xs">
              Customize theme schemes and alert frequencies. Changes are synchronized across your devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
