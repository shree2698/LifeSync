import { WorkflowTemplate } from "@lifesync/types";

export const OfficialWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: "tmpl-1",
    name: "Daily Workday Prep & Weather Check",
    category: "PRODUCTIVITY",
    description: "Fetches local weather, generates top priority tasks in Google Tasks, and time-blocks your Google Calendar.",
    isOfficial: true,
    config: JSON.stringify({
      triggers: [{ type: "CRON", cron: "0 7 * * 1-5" }],
      actions: [
        { type: "FETCH_WEATHER", location: "Current" },
        { type: "CREATE_TASK", title: "Daily Workday Planning" },
        { type: "SCHEDULE_EVENT", title: "Focus Block" },
      ],
    }),
    usageCount: 1420,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tmpl-2",
    name: "PCOS & Health Habit Reminder",
    category: "HEALTH",
    description: "Sends push notifications for morning supplements, water intake checkpoints, and evening sleep routine.",
    isOfficial: true,
    config: JSON.stringify({
      triggers: [{ type: "CRON", cron: "0 8,14,21 * * *" }],
      actions: [{ type: "SEND_NOTIFICATION", title: "Health & Habit Check" }],
    }),
    usageCount: 980,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tmpl-3",
    name: "Cloudinary Photo & Document Auto-Backup",
    category: "STORAGE",
    description: "Optimizes and backs up new images and PDF files to Cloudinary Media Cloud automatically.",
    isOfficial: true,
    config: JSON.stringify({
      triggers: [{ type: "WEBHOOK", event: "file.uploaded" }],
      actions: [{ type: "UPLOAD_MEDIA", provider: "Cloudinary" }],
    }),
    usageCount: 615,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
