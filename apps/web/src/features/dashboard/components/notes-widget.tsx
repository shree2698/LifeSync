"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { FileText, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardService } from "@lifesync/services"
import Link from "next/link"

export function NotesWidget() {
  const { data: apiRes, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => DashboardService.getDashboardData(),
  })

  const notes = apiRes?.data?.notes || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-indigo-500" />
            Notes Preview
          </CardTitle>
          <Link href="/notes" className="text-2xs font-semibold text-indigo-500 hover:underline">
            View All
          </Link>
        </div>
        <CardDescription className="text-xs">
          Your recently drafted documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {notes.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center text-center space-y-1.5">
            <FileText className="h-8 w-8 text-indigo-500/70" />
            <p className="text-xs font-semibold text-foreground">No notes found</p>
            <p className="text-2xs text-muted-foreground">Draft notes to record checklists.</p>
          </div>
        ) : (
          notes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-xl border border-border/40 bg-muted/10 dark:border-border/10 transition-all hover:border-indigo-500/20"
            >
              <span className="text-xs font-semibold text-foreground truncate block leading-tight">
                {note.title || "Untitled"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate block mt-1.5 leading-none">
                {note.content || "Empty note content..."}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
