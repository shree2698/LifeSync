# 🤝 Contributing to LifeSync

Version: 1.0
Status: Active

Product: LifeSync OS

Company: Souree Tech

---

# Welcome

Thank you for contributing to **LifeSync**.

LifeSync is an AI-powered Life Operating System designed to help people organize every aspect of their lives.

This document explains how we develop, review, test, and maintain the project.

---

# Core Principles

Every contribution should follow these principles:

- Keep it simple.
- Write readable code.
- Prefer consistency over cleverness.
- Mobile-first thinking.
- Accessibility matters.
- AI should assist, not replace good engineering.
- Every feature should solve a real user problem.

---

# Development Workflow

```
Issue
   ↓
Discussion
   ↓
Branch
   ↓
Development
   ↓
Testing
   ↓
Code Review
   ↓
Merge
   ↓
Deployment
```

---

# Repository Structure

```
LifeSync/

apps/
    web/
    mobile/

packages/
    ui/
    hooks/
    utils/
    types/
    config/
    ai/
    services/

prisma/

docs/

public/

scripts/
```

---

# Branch Naming

Use descriptive branch names.

Examples

```
feature/tasks

feature/dashboard

feature/finance

feature/health

bugfix/calendar

bugfix/login

hotfix/payment

refactor/ui

docs/api
```

---

# Commit Messages

Follow Conventional Commits.

Examples

```
feat(tasks): add recurring tasks

feat(ai): planner agent

fix(auth): login redirect

fix(ui): sidebar overflow

docs(api): update endpoints

refactor(database): simplify relations

test(tasks): add unit tests

chore: update dependencies
```

---

# Pull Request Checklist

Before opening a pull request:

- [ ] Code builds successfully.
- [ ] Lint passes.
- [ ] Tests pass.
- [ ] Documentation updated (if needed).
- [ ] No unused code.
- [ ] UI matches design system.
- [ ] Accessibility considered.

---

# Coding Standards

## Language

TypeScript only.

Avoid JavaScript unless absolutely necessary.

---

## Formatting

Use:

- Prettier
- ESLint

Never manually format code that conflicts with project rules.

---

## Naming Conventions

### Variables

```ts
const userName
const totalExpense
```

### Functions

```ts
calculateBudget()

createTask()

updateProfile()
```

### Components

```tsx
TaskCard

DashboardHeader

FinanceChart
```

### Hooks

```ts
useAuth()

useTasks()

useCalendar()
```

### Types

```ts
User

Task

Expense
```

### Constants

```ts
MAX_FILE_SIZE

DEFAULT_THEME
```

---

# Folder Structure

Each feature should follow a consistent structure.

```
tasks/

components/

hooks/

services/

types/

utils/

page.tsx
```

---

# UI Guidelines

All UI should use shared components from:

```
packages/ui
```

Avoid duplicate components.

---

# Styling

Web

- Tailwind CSS
- shadcn/ui

Mobile

- NativeWind

Do not mix multiple styling approaches without discussion.

---

# State Management

Use:

React Query

↓

Server state

Zustand

↓

Global state

React State

↓

Local component state

Avoid unnecessary global state.

---

# API Guidelines

- Version all endpoints.
- Validate input with Zod.
- Return consistent response shapes.
- Handle errors gracefully.
- Never expose internal errors to users.

---

# Database Guidelines

Use Prisma.

Every model should include:

```prisma
id

createdAt

updatedAt
```

Prefer soft deletes when appropriate.

---

# AI Development

Every AI feature must include:

- Prompt definition
- Expected inputs
- Expected outputs
- Tool permissions
- Error handling
- Safety considerations

Never hardcode prompts inside components.

Store prompts under:

```
packages/ai
```

---

# Accessibility

All UI must:

- Support keyboard navigation.
- Include visible focus states.
- Use semantic HTML on the web.
- Provide accessible labels.
- Meet WCAG AA contrast guidelines.

---

# Testing

Every feature should include tests where practical.

Types

- Unit Tests
- Integration Tests
- End-to-End Tests

Preferred tools

- Vitest
- Playwright

---

# Documentation

Update documentation whenever:

- New APIs are added.
- Database models change.
- New modules are introduced.
- AI behavior changes.
- Design system changes.

Documentation should be treated as part of the feature.

---

# Security

Never commit:

- API keys
- Secrets
- Tokens
- Passwords
- Certificates
- Environment files

Use environment variables for sensitive configuration.

---

# Performance

Targets

- Dashboard < 2 seconds
- API < 500 ms (typical)
- AI responses streamed when possible
- Mobile interactions remain smooth

Optimize only after measuring.

---

# Code Review Guidelines

Reviewers should check:

- Correctness
- Readability
- Performance
- Accessibility
- Security
- Tests
- Documentation
- Design consistency

Feedback should be constructive and focused on the code, not the person.

---

# Dependency Management

Before adding a dependency:

1. Confirm it solves a real need.
2. Check maintenance and community support.
3. Prefer existing project dependencies when possible.
4. Avoid duplicate libraries.

---

# Release Process

```
Development
      ↓
Internal Testing
      ↓
Alpha
      ↓
Beta
      ↓
Production
```

Production releases should include:

- Changelog
- Version bump
- Migration notes (if applicable)

---

# Community Expectations

We encourage:

- Respectful communication
- Clear feedback
- Collaboration
- Curiosity
- Continuous learning

Harassment, discrimination, or abusive behavior is not acceptable.

---

# Project Goals

Every contribution should help LifeSync become:

- Easier to use
- More reliable
- More secure
- More accessible
- More intelligent

When deciding between two approaches, choose the one that is easier to maintain and understand.

---

# Thank You

Thank you for helping build LifeSync.

Together, we're creating an AI-powered platform that helps people organize their lives, achieve their goals, and reduce everyday complexity.