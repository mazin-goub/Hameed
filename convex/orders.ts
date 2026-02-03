import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.string(),
    orderType: v.union(v.literal("delivery"), v.literal("catering")),
    items: v.optional(v.array(v.object({
      name: v.string(),
      type: v.union(v.literal("burger"), v.literal("liver"), v.literal("sausage"), v.literal("kofta"), v.literal("drinks"), v.literal("desserts"), v.literal("Lasagna")),
      quantity: v.number(),
      customizations: v.array(v.string()),
      price: v.number(),
    }))),
    eventDate: v.optional(v.string()),
    eventLocation: v.optional(v.string()),
    guestCount: v.optional(v.number()),
    cateringItems: v.optional(v.array(v.object({
      item: v.string(),
      quantity: v.number(),
    }))),
    totalAmount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create order");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("orders", {
      userId,
      customerEmail: user.email || "",
      status: "pending",
      ...args,
    });
  },
});

export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getAllOrders = query({
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

    return await ctx.db
      .query("orders")
      .order("desc")
      .collect();
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected"), v.literal("completed")),
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

    await ctx.db.patch(args.orderId, {
      status: args.status,
    });
  },
});
