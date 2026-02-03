import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMenuItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_availability", (q) => q.eq("available", true))
      .collect();
    
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.image ? await ctx.storage.getUrl(item.image) : null,
      }))
    );
  },
});

export const getAllMenuItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "mahgoubzeyad857@gmail.com") {
      throw new Error("Admin access required");
    }

    const items = await ctx.db
      .query("menuItems")
      .order("desc")
      .collect();
    
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.image ? await ctx.storage.getUrl(item.image) : null,
      }))
    );
  },
});

export const addMenuItem = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("burger"), v.literal("liver"), v.literal("sausage"), v.literal("kofta"), v.literal("drinks"), v.literal("desserts"), v.literal("Lasagna")),
    description: v.string(),
    basePrice: v.number(),
    image: v.optional(v.id("_storage")),
    customizations: v.array(v.object({
      name: v.string(),
      price: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "mahgoubzeyad857@gmail.com") {
      throw new Error("Admin access required");
    }

    return await ctx.db.insert("menuItems", {
      ...args,
      available: true,
    });
  },
});

export const updateMenuItem = mutation({
  args: {
    itemId: v.id("menuItems"),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("burger"), v.literal("liver"), v.literal("sausage"), v.literal("kofta"), v.literal("drinks"), v.literal("desserts"), v.literal("Lasagna"))),
    description: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    image: v.optional(v.id("_storage")),
    available: v.optional(v.boolean()),
    customizations: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "mahgoubzeyad857@gmail.com") {
      throw new Error("Admin access required");
    }

    const { itemId, ...updates } = args;
    await ctx.db.patch(itemId, updates);
  },
});

export const deleteMenuItem = mutation({
  args: {
    itemId: v.id("menuItems"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "mahgoubzeyad857@gmail.com") {
      throw new Error("Admin access required");
    }

    await ctx.db.delete(args.itemId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "mahgoubzeyad857@gmail.com") {
      throw new Error("Admin access required");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const seedMenuItems = mutation({
  args: {},
  handler: async (ctx) => {
    const existingItems = await ctx.db.query("menuItems").collect();
    if (existingItems.length > 0) {
      return "Menu already seeded";
    }

    const menuItems = [
      {
        name: "UFO Burger",
        type: "burger" as const,
        description: "Premium beef patty with  sauce, sealed in our signature UFO style",
        basePrice: 25,
        available: true,
        customizations: [
          { name: "Extra Lettuce", price: 2 },
          { name: "Extra Cheese", price: 3 },
          { name: "No Onions", price: 0 },
          { name: "Extra Sauce", price: 1.5 },
        ],
      },
      {
        name: "Golden Liver Sandwich",
        type: "liver" as const,
        description: "Tender liver with golden spices, wrapped in vintage style",
        basePrice: 20,
        available: true,
        customizations: [
          { name: "Extra Lettuce", price: 2 },
          { name: "Spicy Sauce", price: 1 },
          { name: "No Onions", price: 0 },
          { name: "Extra Pickles", price: 1.5 },
        ],
      },
      {
        name: "Classic Sausage UFO",
        type: "sausage" as const,
        description: "Premium sausage with classic herbs, UFO-sealed for freshness",
        basePrice: 22,
        available: true,
        customizations: [
          { name: "Extra Lettuce", price: 2 },
          { name: "Mustard Sauce", price: 1 },
          { name: "No Onions", price: 0 },
          { name: "Extra Tomatoes", price: 2 },
        ],
      },
      {
        name: " Kofta Delight",
        type: "kofta" as const,
        description: "Hand-crafted kofta with  spices, sealed to perfection",
        basePrice: 28,
        available: true,
        customizations: [
          { name: "Extra Lettuce", price: 2 },
          { name: "Tahini Sauce", price: 2 },
          { name: "No Onions", price: 0 },
          { name: "Extra Sauce", price: 1.5 },
        ],
      },
    ];

    for (const item of menuItems) {
      await ctx.db.insert("menuItems", item);
    }

    return "Menu seeded successfully";
  },
});
