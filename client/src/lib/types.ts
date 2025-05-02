// Types from shared/schema.ts

export interface User {
  id: number;
  username: string;
  password?: string;
  isAdmin: boolean;
}

/** One “account” offering (e.g. Topstep 50 K, 100 K, 150 K) */
export interface AccountType {
  /** Account size in USD (e.g. 50000) */
  accountSize: number;

  /** Drawdown Type: End-Of-Day | End-Of-Test | Trailing Max Daily Drawdown */
  drawdownType: 'EOD' | 'EOT' | 'TMDD';

  /** Original price (원가) */
  price: number;

  /** Current discount rate (0.0–1.0, e.g. 0.2 = 20%) */
  currentDiscountRate: number;

  /** Price after discount */
  discountedPrice: number;

  /** Activation fee */
  activationFee: number;

  /** Target profit (절대값, e.g. 10000) */
  targetProfit: number;

  /** Maximum Loss Limit */
  MLL: number;

  /** Daily Loss Limit */
  DLL: number;

  /** Minimum days required in evaluation */
  minEvaluationDays: number;

  /** Minimum days required once funded */
  minFundedDays: number;

  /** Payout ratio (0.0–1.0, e.g. 0.8 = 80%) */
  payoutRatio: number;

  /** Payout frequency, e.g. 'monthly', 'weekly' */
  payoutFrequency: string;
}

/** A proprietary‐trading firm with one or more account offerings */
export interface PropFirm {
  id: number;
  name: string;
  logo?: string;
  description: string;
  websiteUrl?: string;

  /** Company‐wide profit split (e.g. 0.8 = 80% to trader) */
  profitSplit: number;

  /** Min/max challenge fee */
  challengeFeeMin?: number;
  challengeFeeMax?: number;

  /** Days until first payout */
  payoutTime?: number;

  /** Firm‐level drawdown caps (if any) */
  maxDailyDrawdown?: number;
  maxTotalDrawdown?: number;

  /** Min trading days rule (firm‐wide) */
  minTradingDays?: number;

  scalingPlan: boolean;
  tradingPlatforms: string[];   // e.g. ['NinjaTrader', 'TradingView']
  tradableAssets: string[];     // e.g. ['Futures', 'FX']
  featured: boolean;

  avgRating?: number;
  ratingCount: number;

  /** ——— NEW: all the different account offerings ——— */
  accountTypes: AccountType[];

  /** ——— remaining firm‐level settings ——— */
  evaluationStages?: string[];    // e.g. ['Phase 1', 'Phase 2']
  newsTradingAllowed?: boolean;
  DCAAllowed?: boolean;
  maxTrailingAllowed?: boolean;
  microScalpingAllowed?: boolean;
  maxAccountsPerTrader?: number;
  maxContractsPerTrade?: number;
  copyTradingAllowed?: boolean;
  consistencyEval?: number;      // e.g. 0.4 = 40%
  consistencyFunded?: number;    // e.g. 0.4 = 40%

  /** Any extra one-off or firm-unique rules */
  extra?: Record<string, any>;
}

export interface Review {
  id: number;
  firmId: number;
  username: string;
  rating: number;
  title: string;
  content: string;
  tradingExperience?: string;
  createdAt: Date;
}

export interface Resource {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  authorName: string;
  authorImage?: string;
  image?: string;
  readTime: number;
  publishedAt: Date;
}

export interface AdminCredentials {
  id: number;
  username: string;
  password?: string;
}
