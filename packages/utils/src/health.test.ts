import assert from "node:assert";
import test from "node:test";
import { z } from "zod";

// Zod schemas matching our health validation layer
const waterLogSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().optional(),
});

const sleepLogSchema = z.object({
  startTime: z.string().datetime("Invalid start time ISO format"),
  endTime: z.string().datetime("Invalid end time ISO format"),
  quality: z.number().min(1).max(5, "Quality must be between 1 and 5"),
  notes: z.string().nullable().optional(),
});

const workoutLogSchema = z.object({
  title: z.string().min(1, "Workout title is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  calories: z.number().nullable().optional(),
});

const weightLogSchema = z.object({
  weight: z.number().positive("Weight must be positive"),
  chest: z.number().nullable().optional(),
  waist: z.number().nullable().optional(),
  hips: z.number().nullable().optional(),
});

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  schedule: z.string().min(1, "Schedule is required"),
  frequency: z.string().min(1, "Frequency is required"),
});

const cycleSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const moodLogSchema = z.object({
  mood: z.string().min(1, "Mood selection is required"),
  energyLevel: z.number().min(1).max(5),
  stressLevel: z.number().min(1).max(5),
});

test("Water Log Schema Validation Tests", async (t) => {
  await t.test("should successfully validate positive amount", () => {
    const payload = { amount: 250 };
    const result = waterLogSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail validation for negative amount", () => {
    const payload = { amount: -100 };
    const result = waterLogSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Sleep Log Schema Validation Tests", async (t) => {
  await t.test("should validate correct sleep logs", () => {
    const payload = {
      startTime: "2026-07-17T22:00:00.000Z",
      endTime: "2026-07-18T06:00:00.000Z",
      quality: 4,
      notes: "Deep sleep felt good",
    };
    const result = sleepLogSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on invalid quality rating", () => {
    const payload = {
      startTime: "2026-07-17T22:00:00.000Z",
      endTime: "2026-07-18T06:00:00.000Z",
      quality: 6,
    };
    const result = sleepLogSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Workout Log Schema Validation Tests", async (t) => {
  await t.test("should validate standard workouts", () => {
    const payload = {
      title: "Evening Yoga",
      category: "Yoga",
      duration: 45,
      calories: 120,
    };
    const result = workoutLogSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on zero duration", () => {
    const payload = {
      title: "Cardio run",
      category: "Cardio",
      duration: 0,
    };
    const result = workoutLogSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Weight Log Schema Validation Tests", async (t) => {
  await t.test("should validate correct weight and hips measurements", () => {
    const payload = {
      weight: 68.5,
      hips: 95,
      chest: null,
    };
    const result = weightLogSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Medication Schedule Schema Validation Tests", async (t) => {
  await t.test("should validate standard medication parameters", () => {
    const payload = {
      name: "Omega-3 Fish Oil",
      dosage: "2 capsules",
      schedule: "Morning",
      frequency: "DAILY",
    };
    const result = medicationSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Cycle Tracking Schema Validation Tests", async (t) => {
  await t.test("should validate correct ISO date start times", () => {
    const payload = {
      startDate: "2026-07-18T00:00:00.000Z",
      notes: "Cycle onset",
    };
    const result = cycleSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Mood Log Schema Validation Tests", async (t) => {
  await t.test("should successfully validate standard mood and energy indices", () => {
    const payload = {
      mood: "Calm",
      energyLevel: 3,
      stressLevel: 2,
    };
    const result = moodLogSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});
