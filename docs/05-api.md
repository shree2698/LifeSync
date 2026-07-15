# 🌐 LifeSync API Documentation

Version: 1.0
Status: Draft

Base URL

```
https://api.lifesync.app/api/v1
```

Development

```
http://localhost:3000/api/v1
```

---

# API Principles

- RESTful
- Versioned
- Secure
- Fast
- Predictable
- AI Ready

Every endpoint returns JSON.

---

# Authentication

Authentication is handled using Clerk.

Every protected request includes:

```
Authorization: Bearer <TOKEN>
```

---

# Response Format

## Success

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Authentication APIs

## Register

POST

```
/auth/register
```

---

## Login

POST

```
/auth/login
```

---

## Logout

POST

```
/auth/logout
```

---

## Refresh Session

POST

```
/auth/refresh
```

---

## Forgot Password

POST

```
/auth/forgot-password
```

---

## Reset Password

POST

```
/auth/reset-password
```

---

## Current User

GET

```
/auth/me
```

---

# User APIs

## Get Profile

GET

```
/users/profile
```

---

## Update Profile

PATCH

```
/users/profile
```

---

## Upload Avatar

POST

```
/users/avatar
```

---

## Preferences

GET

```
/users/preferences
```

PATCH

```
/users/preferences
```

---

# Dashboard APIs

GET

```
/dashboard
```

Returns

- Today's Tasks
- Habits
- Goals
- Calendar
- Finance Summary
- Health Summary
- AI Summary

---

# Task APIs

## Get Tasks

GET

```
/tasks
```

Supports

- Pagination
- Search
- Filters
- Sorting

---

## Create Task

POST

```
/tasks
```

---

## Update Task

PATCH

```
/tasks/:id
```

---

## Delete Task

DELETE

```
/tasks/:id
```

---

## Complete Task

PATCH

```
/tasks/:id/complete
```

---

## Duplicate Task

POST

```
/tasks/:id/duplicate
```

---

# Habit APIs

GET

```
/habits
```

---

POST

```
/habits
```

---

PATCH

```
/habits/:id
```

---

DELETE

```
/habits/:id
```

---

Complete Habit

POST

```
/habits/:id/log
```

---

# Goals

GET

```
/goals
```

POST

```
/goals
```

PATCH

```
/goals/:id
```

DELETE

```
/goals/:id
```

---

# Notes

GET

```
/notes
```

POST

```
/notes
```

PATCH

```
/notes/:id
```

DELETE

```
/notes/:id
```

---

# Calendar

GET

```
/calendar/events
```

POST

```
/calendar/events
```

PATCH

```
/calendar/events/:id
```

DELETE

```
/calendar/events/:id
```

---

# Finance APIs

## Accounts

GET

```
/finance/accounts
```

POST

```
/finance/accounts
```

---

## Income

GET

```
/finance/income
```

POST

```
/finance/income
```

---

## Expenses

GET

```
/finance/expenses
```

POST

```
/finance/expenses
```

PATCH

```
/finance/expenses/:id
```

DELETE

```
/finance/expenses/:id
```

---

## Budgets

GET

```
/finance/budgets
```

POST

```
/finance/budgets
```

---

## Savings

GET

```
/finance/savings
```

POST

```
/finance/savings
```

---

# Health APIs

## Dashboard

GET

```
/health
```

---

## Water

GET

```
/health/water
```

POST

```
/health/water
```

---

## Sleep

GET

```
/health/sleep
```

POST

```
/health/sleep
```

---

## Workout

GET

```
/health/workouts
```

POST

```
/health/workouts
```

---

## Weight

GET

```
/health/weight
```

POST

```
/health/weight
```

---

## Medication

GET

```
/health/medications
```

POST

```
/health/medications
```

---

## Women's Health

GET

```
/health/cycle
```

POST

```
/health/cycle
```

---

## PCOS

GET

```
/health/pcos
```

POST

```
/health/pcos
```

---

## Hair

GET

```
/health/hair
```

POST

```
/health/hair
```

---

## Skin

GET

```
/health/skin
```

POST

```
/health/skin
```

---

# Shopping APIs

GET

```
/shopping/lists
```

POST

```
/shopping/lists
```

---

GET

```
/shopping/items
```

POST

```
/shopping/items
```

PATCH

```
/shopping/items/:id
```

DELETE

```
/shopping/items/:id
```

---

# Notification APIs

GET

```
/notifications
```

---

PATCH

```
/notifications/:id/read
```

---

DELETE

```
/notifications/:id
```

---

# Reminder APIs

GET

```
/reminders
```

POST

```
/reminders
```

PATCH

```
/reminders/:id
```

DELETE

```
/reminders/:id
```

---

# AI APIs

## Chat

POST

```
/ai/chat
```

---

## Planner

POST

```
/ai/planner
```

---

## Coach

POST

```
/ai/coach
```

---

## Journal

POST

```
/ai/journal
```

---

## Memory

GET

```
/ai/memory
```

---

## Suggestions

GET

```
/ai/suggestions
```

---

# Upload APIs

POST

```
/uploads/image
```

POST

```
/uploads/file
```

POST

```
/uploads/avatar
```

---

# Search

GET

```
/search
```

Searches across

- Tasks
- Notes
- Habits
- Goals
- Expenses
- Shopping
- Calendar

---

# Settings APIs

GET

```
/settings
```

PATCH

```
/settings
```

---

# Analytics

GET

```
/analytics/dashboard
```

---

GET

```
/analytics/productivity
```

---

GET

```
/analytics/finance
```

---

GET

```
/analytics/health
```

---

# Error Codes

| Code | Meaning |
|-------|----------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# Rate Limits

Guest

100 requests/hour

Authenticated

1000 requests/hour

Premium

5000 requests/hour

---

# Future APIs

- Family
- Team Workspace
- Shared Calendar
- Shared Tasks
- Wearables
- Smart Home
- Voice Assistant
- Email Integration
- WhatsApp Integration
- Third-party Developer API

---

# API Design Guidelines

- Use plural resource names (`/tasks`, `/goals`).
- Prefer `PATCH` for partial updates and `PUT` only for full replacements.
- Return consistent response shapes for success and errors.
- Validate all input before database operations.
- Include pagination for list endpoints.
- Document breaking changes under a new API version (`/api/v2`) rather than modifying existing routes.