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
  extra: json("extra").$type<Record<string, any>>().default("{}"),
});

export const insertPropFirmSchema = createInsertSchema(propFirms).omit({
  id: true,
  avgRating: true,
  ratingCount: true,
});

// Account Types model
export const accountTypes = pgTable("account_types", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id")
    .notNull()
    .references(() => propFirms.id),

  // from your new interface:
  accountType: text("account_type").notNull(),
  stage: integer("stage"),

  referralCode: text("referral_code"),

  accountSize: integer("account_size").notNull(),
  startingBalance: integer("starting_balance"),

  drawdownType: text("drawdown_type").notNull(),

  price: doublePrecision("price"),
  currentDiscountRate: doublePrecision("current_discount_rate"),
  discountedPrice: doublePrecision("discounted_price"),

  activationFee: doublePrecision("activation_fee"),
  targetProfit: integer("target_profit").notNull(),

  MLL: doublePrecision("mll"),
  DLLExists: boolean("dll_exists").default(false).notNull(),
  DLL: doublePrecision("dll"),

  payoutRatio: doublePrecision("payout_ratio"),
  payoutFrequency: text("payout_frequency"),

  tradableAssets: text("tradable_assets").array(),

  miniTradingFee: doublePrecision("mini_trading_fee"),
  microTradingFee: doublePrecision("micro_trading_fee"),

  positionClosureDueTime: text("position_closure_due_time"),

  newsTradingAllowed: boolean("news_trading_allowed").default(false).notNull(),
  newsTradingAllowedCondition: text("news_trading_allowed_condition"),

  DCAAllowed: boolean("dca_allowed").default(false).notNull(),
  DCACondition: text("dca_condition"),

  maxTrailingAllowed: boolean("max_trailing_allowed").default(false).notNull(),
  maxTrailingCondition: text("max_trailing_condition"),

  microScalpingAllowed: boolean("micro_scalping_allowed").default(false).notNull(),
  microScalpingCondition: text("micro_scalping_condition"),

  maxAccountsPerTrader: integer("max_accounts_per_trader").notNull(),
  maxAccountsPerTraderCondition: text("max_accounts_per_trader_condition"),

  maxContractsPerTrade: integer("max_contracts_per_trade").notNull(),

  copyTradingAllowed: boolean("copy_trading_allowed").default(false).notNull(),
  copyTradingCondition: text("copy_trading_condition"),

  scalingPlan: boolean("scaling_plan").default(false).notNull(),
  scalingPlanCondition: text("scaling_plan_condition"),

  algoTradingAllowed: boolean("algo_trading_allowed").default(false).notNull(),
  algoTradingCondition: text("algo_trading_condition"),

  resetAllowed: boolean("reset_allowed").default(false).notNull(),
  resetCondition: text("reset_condition"),
  resetPrice: doublePrecision("reset_price"),
  resetLimit: integer("reset_limit"),
  resetLimitCondition: text("reset_limit_condition"),
  resetDiscount: doublePrecision("reset_discount"),
  resetDiscountedPrice: doublePrecision("reset_discounted_price"),

  maxWithdrawal: integer("max_withdrawal"),
  withdrawalPlatform: text("withdrawal_platform").array(),

  bufferInsideWithdrawalAllowed: boolean("buffer_inside_withdrawal_allowed").default(false).notNull(),
  bufferAmount: doublePrecision("buffer_amount"),
  bufferInsideCondition: text("buffer_inside_condition"),

  consistencyRule: boolean("consistency_rule").default(false).notNull(),
  consistencyRatio: doublePrecision("consistency_ratio"),
  consistencyCondition: text("consistency_condition"),

  minTradingDays: integer("min_trading_days"),
  minTradingDaysCondition: text("min_trading_days_condition"),
  MaximumInactiveDays: integer("maximum_inactive_days"),

  liveAccountCondition: text("live_account_condition"),

  marketDepthData: boolean("market_depth_data_allowed").default(false).notNull(),
  marketDepthDataLevel: text("market_depth_data_level"),

  hasProfitSplitChange: boolean("has_profit_split_change").default(false).notNull(),
  initialProfitSplit: doublePrecision("initial_profit_split").notNull(),
  finalProfitSplit: doublePrecision("final_profit_split").notNull(),
  profitSplitCondition: text("profit_split_condition"),
});

export const insertAccountTypeSchema = createInsertSchema(accountTypes).omit({
  id: true,
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

export type AccountType = typeof accountTypes.$inferSelect;
export type InsertAccountType = z.infer<typeof insertAccountTypeSchema>;
