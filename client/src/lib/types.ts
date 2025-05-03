// Types from shared/schema.ts

export interface User {
  id: number;
  username: string;
  password?: string;
  isAdmin: boolean;
}

/** One “account” offering (e.g. Topstep 50 K, 100 K, 150 K) */
export interface AccountType {
  /** Account type that could be Challenge account, Funded Account, Live Account */
  accountType: 'Challenge' | 'Funding' | 'Live' | 'InstantFunded' | string;
  stage?: number;

  /** Account size in USD (e.g. 50000) */
  accountSize: number;
  startingBalance?: number;

  /** Drawdown Type: End-Of-Day | End-Of-Test | Trailing Max Daily Drawdown */
  drawdownType: 'EOD' | 'EOT' | 'TMDD' | 'Static';

  /** Original price (원가) */
  price?: number;

  /** Current discount rate (0.0–1.0, e.g. 0.2 = 20%) */
  currentDiscountRate?: number;

  /** Price after discount */
  discountedPrice?: number;

  /** Activation fee */
  activationFee?: number;

  /** Target profit (절대값, e.g. 10000) */
  targetProfit: number;

  /** Maximum Loss Limit */
  MLL?: number;

  /** Daily Loss Limit */
  DLLExists?: boolean;
  DLL?: number;

  /** Payout ratio */
  payoutRatio?: number;

  /** Payout frequency, e.g. 'monthly', 'weekly' */
  payoutFrequency?: string;

  /** Tradable Assets */
  tradableAssets?: string[];

  /** Trading Fee */
  miniTradingFee?: number;
  microTradingFee?: number;

  /** Position Closure Due Time */
  positionClosureDueTime?: string;

  /** ——— remaining firm‐level settings ——— */
  newsTradingAllowed: boolean;
  newsTradingAllowedCondition?: string;

  DCAAllowed: boolean;
  DCACondition?: string;

  maxTrailingAllowed: boolean;
  maxTrailingCondition?: string;

  microScalpingAllowed: boolean;
  microScalpingCondition?: string;
  
  maxAccountsPerTrader: number;
  maxAccountsPerTraderCondition?: string;

  maxContractsPerTrade: number;

  copyTradingAllowed: boolean;
  copyTradingCondition?: string;

  scalingPlan: boolean;
  scalingPlanCondition?: string;

  algoTradingAllowed: boolean;
  algoTradingCondition?: string;

  resetAllowed: boolean;
  resetCondition?: string;
  resetPrice?: number;
  resetLimit?: number;
  resetLimitCondition?: string;
  resetDiscount?: number;
  resetDiscountedPrice?: number;

  /** Withdrawal */
  maxWithdrawal?: number;
  withdrawalPlatform?: string[];

  bufferInsideWithdrawalAllowed: boolean;
  bufferAmount?: number;
  bufferInsideCondition?: string;

  /** Consistency Rule */
  consistencyRule?: boolean;
  consistencyRatio?: number;
  consistencyCondition?: string;

  /** Minimum Trading Days */
  minTradingDays?: number;
  minTradingDaysCondition?: string;
  MaximumInactiveDays?: number;

  /** Live Account */
  liveAccountCondition?: string;

  /** Market Depth Data */
  marketDepthData?: boolean;
  marketDepthDataLevel?: string;
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

  /** Min trading days rule (firm‐wide) */
  minTradingDays?: number;

  tradingPlatforms: string[];
  tradableAssets: string[];     // e.g. ['Futures', 'FX']
  featured: boolean;

  avgRating?: number;
  ratingCount: number;

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
