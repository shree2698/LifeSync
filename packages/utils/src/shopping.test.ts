import assert from "node:assert";
import test from "node:test";
import { z } from "zod";

// Zod schemas matching our shopping validation layer
const listFormSchema = z.object({
  name: z.string().min(1, "List name is required"),
  color: z.string().optional(),
});

const itemFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().default("pcs"),
  price: z.number().default(0),
  categoryId: z.string().uuid().nullable().optional(),
});

const essentialFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  targetQuantity: z.number().positive(),
  unit: z.string().default("pcs"),
  estimatedPrice: z.number().default(0),
});

const pantryFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  currentQuantity: z.number().default(0),
  minimumQuantity: z.number().default(0),
  expiryDate: z.string().nullable().optional(),
});

const wishlistFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  desiredPrice: z.number().default(0),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

test("Shopping List Schema Validation Tests", async (t) => {
  await t.test("should successfully validate correct list payloads", () => {
    const payload = {
      name: "Weekly Groceries",
      color: "#10B981",
    };
    const result = listFormSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on empty list name", () => {
    const payload = {
      name: "",
    };
    const result = listFormSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Shopping Item Schema Validation Tests", async (t) => {
  await t.test("should validate standard shopping item payload", () => {
    const payload = {
      name: "Organic Milk",
      quantity: 2,
      unit: "gallons",
      price: 5.49,
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
    };
    const result = itemFormSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on negative item quantity", () => {
    const payload = {
      name: "Organic Milk",
      quantity: -1,
    };
    const result = itemFormSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});

test("Monthly Essentials Schema Validation Tests", async (t) => {
  await t.test("should validate correct essential configurations", () => {
    const payload = {
      name: "Dishwasher Pods",
      targetQuantity: 1,
      unit: "pack",
      estimatedPrice: 14.99,
    };
    const result = essentialFormSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Pantry Inventory Schema Validation Tests", async (t) => {
  await t.test("should validate correct pantry item inventory", () => {
    const payload = {
      name: "Olive Oil Bottle",
      currentQuantity: 0.5,
      minimumQuantity: 1,
      expiryDate: "2027-12-31T00:00:00.000Z",
    };
    const result = pantryFormSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});

test("Wishlist Product Schema Validation Tests", async (t) => {
  await t.test("should validate correct wishlist configurations", () => {
    const payload = {
      name: "Mechanical Keyboard",
      desiredPrice: 120,
      priority: "HIGH",
    };
    const result = wishlistFormSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  await t.test("should fail on invalid priority option", () => {
    const payload = {
      name: "Mechanical Keyboard",
      priority: "URGENT",
    };
    const result = wishlistFormSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
  });
});
