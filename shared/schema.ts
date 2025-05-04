import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Prop Firm model
export const propFirms = pgTable("prop_firms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  backgroundImage: text("background_image"),
  description: text("description").notNull(),
  websiteUrl: text("website_url"),
  minPayoutTime: integer("min_payout_time"),
  payoutWindow: text("payout_window"),
  tradingPlatforms: text("trading_platforms").array(),
  tradableAssets: text("tradable_assets").array(),
  featured: boolean("featured").default(false).notNull(),
  avgRating: doublePrecision("avg_rating"),
  ratingCount: integer("rating_count").default(0).notNull(),
  extra: json("extra")
  .$type<{ key:string; value:string }[]>()
  .default(sql`'{}'`),
  accountTypes: json("account_types")
  .$type<any[]>()
  .default(sql`'[]'`)
  .notNull(),  
});

export const insertPropFirmSchema = createInsertSchema(propFirms).omit({
  id: true,
  avgRating: true,
  ratingCount: true,
});

// Reviews model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull(),
  username: text("username").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tradingExperience: text("trading_experience"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Resources model (for educational content)
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  authorName: text("author_name").notNull(),
  authorImage: text("author_image"),
  image: text("image"),
  readTime: integer("read_time"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

// Admin model for authentication
export const adminCredentials = pgTable("admin_credentials", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAdminCredentialsSchema = createInsertSchema(adminCredentials).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PropFirm = typeof propFirms.$inferSelect;
export type InsertPropFirm = z.infer<typeof insertPropFirmSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type AdminCredentials = typeof adminCredentials.$inferSelect;
export type InsertAdminCredentials = z.infer<typeof insertAdminCredentialsSchema>;
