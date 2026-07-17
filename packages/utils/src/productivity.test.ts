import assert from "node:assert";
import test from "node:test";
import { z } from "zod";

// Zod schemas matching our database/API validation layer
const taskValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().nullable().optional(),
  estimatedDuration: z.number().min(0).nullable().optional(),
});

const habitValidationSchema = z.object({
  title: z.string().min(1, "Habit title is required"),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"]).default("DAILY"),
  category: z.string().default("Personal"),
});

const goalValidationSchema = z.object({
  title: z.string().min(1, "Goal title is required"),
  target: z.number().positive(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]).default("ACTIVE"),
});

test("Task Zod Validation Schema Tests", async (t) => {
  await t.test("should successfully validate a correct task payload", () => {
    const payload = {
      title: "Review Q3 product roadmap",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: "2026-07-20T00:00:00.000Z",
      estimatedDuration: 45,
    };
    
    const result = taskValidationSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.title, "Review Q3 product roadmap");
    }
  });

  await t.test("should fail validation if title is empty", () => {
    const payload = {
      title: "",
      status: "TODO",
    };
    
    const result = taskValidationSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Habits Zod Validation Schema Tests", async (t) => {
  await t.test("should validate standard daily habit", () => {
    const payload = {
      title: "Drink 3L water",
      frequency: "DAILY",
      category: "Health",
    };
    
    const result = habitValidationSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Goals Zod Validation Schema Tests", async (t) => {
  await t.test("should fail if goal target is negative or zero", () => {
    const payload = {
      title: "Run half-marathon",
      target: 0,
    };
    
    const result = goalValidationSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});
