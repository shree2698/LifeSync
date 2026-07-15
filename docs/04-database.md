# 🗄️ LifeSync Database Design

Version: 1.0
Status: Draft
Database: PostgreSQL
ORM: Prisma

---

# Overview

LifeSync uses PostgreSQL with Prisma ORM.

Design goals:

- Modular
- Scalable
- Secure
- AI Ready
- Multi-device Sync
- Future Enterprise Support

---

# Database Architecture

```
Users
│
├── Profile
├── Preferences
├── Settings
├── Notifications
├── AI Memory
│
├── Productivity
│     ├── Tasks
│     ├── Habits
│     ├── Goals
│     ├── Notes
│     └── Calendar
│
├── Finance
│     ├── Income
│     ├── Expenses
│     ├── Budgets
│     └── Savings
│
├── Health
│     ├── Water
│     ├── Sleep
│     ├── Workout
│     ├── Weight
│     ├── PCOS
│     └── Medication
│
└── Shopping
      ├── Lists
      ├── Items
      └── Pantry
```

---

# Core Tables

## users

Stores user account information.

| Field | Type |
|--------|------|
| id | UUID |
| email | String |
| authProvider | String |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## profiles

| Field | Type |
|--------|------|
| id | UUID |
| userId | UUID |
| fullName | String |
| avatar | String |
| dateOfBirth | Date |
| gender | String |
| timezone | String |
| country | String |

Relationship:

User → One Profile

---

## preferences

Stores user preferences.

Examples

- Theme
- Language
- Time Format
- Currency
- AI Preferences

---

## settings

Stores application settings.

Examples

- Notification Settings
- Privacy
- Security
- Connected Accounts

---

# Productivity Module

## tasks

| Field | Type |
|--------|------|
| id | UUID |
| userId | UUID |
| title | String |
| description | Text |
| priority | Enum |
| status | Enum |
| dueDate | DateTime |
| completedAt | DateTime |
| createdAt | DateTime |

---

## task_labels

Stores task labels.

Examples

- Work
- Personal
- Study
- Health

---

## task_subtasks

Stores subtasks.

Relationship

Task → Many Subtasks

---

## habits

Fields

- id
- userId
- title
- frequency
- streak
- reminderTime
- createdAt

---

## habit_logs

Stores daily completion.

Relationship

Habit → Many Logs

---

## goals

Fields

- id
- title
- target
- progress
- deadline
- status

---

## milestones

Goal milestones.

---

## notes

Supports

- Rich Text
- Images
- AI Summary

---

## note_tags

Stores note tags.

---

## calendar_events

Fields

- title
- description
- start
- end
- allDay
- reminder

---

# Finance Module

## accounts

Examples

Cash

Bank

Wallet

Credit Card

---

## income

Tracks income.

---

## expenses

Tracks expenses.

Fields

- amount
- category
- account
- notes

---

## budgets

Monthly budgets.

---

## savings

Savings goals.

---

## subscriptions

Netflix

Spotify

Gym

Etc.

---

# Health Module

## water_logs

Tracks daily water intake.

---

## weight_logs

Tracks body weight.

---

## workouts

Workout history.

---

## sleep_logs

Sleep duration.

---

## medications

Medicine schedule.

---

## mood_logs

Daily mood.

---

## menstrual_cycles

Cycle tracking.

---

## pcos_logs

Symptoms

Medication

Weight

Notes

---

## skin_logs

Routine tracking.

---

## hair_logs

Hair care tracking.

---

# Shopping Module

## shopping_lists

Main list.

---

## shopping_items

Each item.

Fields

- name
- quantity
- category
- purchased

---

## pantry

Current inventory.

---

# AI Module

## ai_conversations

Stores chat history.

---

## ai_messages

Conversation messages.

---

## ai_memory

Stores long-term user context.

Examples

Favorite workout

Wake-up time

Goals

Preferences

---

## ai_suggestions

Stores generated recommendations.

---

# Notification Module

## notifications

Push notifications.

---

## reminders

Reminder schedule.

---

## notification_history

Tracks delivery.

---

# Files

## uploads

Stores uploaded files.

Examples

Images

Documents

Receipts

Voice Notes

---

# Analytics

## user_activity

Tracks usage.

---

## app_events

Tracks events.

Examples

Task Completed

Habit Completed

Goal Achieved

---

# Relationships

User

↓

Profile

↓

Tasks

↓

Subtasks

↓

Labels

---

User

↓

Habits

↓

Habit Logs

---

User

↓

Goals

↓

Milestones

---

User

↓

Expenses

↓

Budgets

↓

Savings

---

User

↓

Health

↓

Water

↓

Workout

↓

Sleep

↓

PCOS

---

# Common Fields

Almost every table contains:

- id
- userId
- createdAt
- updatedAt

Some tables also include:

- deletedAt
- archivedAt

---

# Enums

Task Priority

- Low
- Medium
- High
- Urgent

Task Status

- Todo
- In Progress
- Completed
- Archived

Goal Status

- Active
- Paused
- Completed

Expense Category

- Food
- Travel
- Shopping
- Bills
- Entertainment

Habit Frequency

- Daily
- Weekly
- Monthly

Theme

- Light
- Dark
- AMOLED

---

# Future Tables

- Family Accounts
- Teams
- Shared Tasks
- Shared Shopping
- Shared Calendar
- AI Workflows
- AI Automation Rules
- Wearable Devices
- Smart Home Integrations
- Email Sync
- Travel Planner

---

# Estimated Database Size

MVP

~35 Tables

Version 2

~60 Tables

Enterprise

80–100+ Tables

---

# Design Principles

- Normalize where practical.
- Use UUIDs for identifiers.
- Soft-delete records when appropriate.
- Index commonly queried fields.
- Encrypt sensitive data.
- Keep modules loosely coupled.
- Make every module independently scalable.
