import assert from "node:assert";
import test from "node:test";
import { z } from "zod";

// Zod schemas matching our finance validation layer
const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["CASH", "BANK", "WALLET", "CREDIT_CARD", "UPI", "INVESTMENT"]),
  balance: z.number(),
  currency: z.string().default("USD"),
});

const transactionSchema = z.object({
  accountId: z.string().uuid("Invalid Account ID"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  toAccountId: z.string().uuid().nullable().optional(),
});

const budgetSchema = z.object({
  name: z.string().min(1, "Budget name is required"),
  amount: z.number().positive("Total limit must be positive"),
  startDate: z.string(),
  endDate: z.string(),
});

const savingsSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().default(0),
  deadline: z.string().nullable().optional(),
});

const billSchema = z.object({
  name: z.string().min(1, "Bill name is required"),
  amount: z.number().positive("Amount must be positive"),
  dueDate: z.string(),
  isRecurring: z.boolean().default(false),
});

const subscriptionSchema = z.object({
  name: z.string().min(1, "Subscription name is required"),
  amount: z.number().positive("Amount must be positive"),
  billingCycle: z.string().default("MONTHLY"),
  renewalDate: z.string(),
});

test("Account Schema Validation Tests", async (t) => {
  await t.test("should successfully validate standard account payloads", () => {
    const payload = {
      name: "Chase Checking",
      type: "BANK",
      balance: 1000,
    };
    const result = accountSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on invalid account type", () => {
    const payload = {
      name: "Chase Checking",
      type: "SHOEBOX",
      balance: 100,
    };
    const result = accountSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Transaction Schema Validation Tests", async (t) => {
  await t.test("should successfully validate positive amount expense transactions", () => {
    const payload = {
      accountId: "123e4567-e89b-12d3-a456-426614174000",
      amount: 45.5,
      type: "EXPENSE",
      description: "Coffee shop visit",
    };
    const result = transactionSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on negative amounts", () => {
    const payload = {
      accountId: "123e4567-e89b-12d3-a456-426614174000",
      amount: -12.0,
      type: "EXPENSE",
    };
    const result = transactionSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Budget Limit Schema Validation Tests", async (t) => {
  await t.test("should validate correct budget configurations", () => {
    const payload = {
      name: "General Food Budget",
      amount: 500,
      startDate: "2026-07-01",
      endDate: "2026-07-31",
    };
    const result = budgetSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Savings Goals Schema Validation Tests", async (t) => {
  await t.test("should validate standard savings target configurations", () => {
    const payload = {
      name: "New Laptop",
      targetAmount: 1500,
      currentAmount: 100,
    };
    const result = savingsSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Scheduled Bills Schema Validation Tests", async (t) => {
  await t.test("should validate bill schedules", () => {
    const payload = {
      name: "Internet Fiber Plan",
      amount: 60,
      dueDate: "2026-07-28",
      isRecurring: true,
    };
    const result = billSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Active Subscriptions Schema Validation Tests", async (t) => {
  await t.test("should validate subscription renewals", () => {
    const payload = {
      name: "Netflix Premium",
      amount: 19.99,
      billingCycle: "MONTHLY",
      renewalDate: "2026-08-01",
    };
    const result = subscriptionSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});
