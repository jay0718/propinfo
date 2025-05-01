// Types from shared/schema.ts

export interface User {
  id: number;
  username: string;
  password?: string;
  isAdmin: boolean;
}

export interface PropFirm {
  id: number;
  name: string;
  logo?: string;
  description: string;
  websiteUrl?: string;
  maxAccountSize: number;
  profitSplit: number;
  challengeFeeMin?: number;
  challengeFeeMax?: number;
  payoutTime?: number;
  maxDailyDrawdown?: number;
  maxTotalDrawdown?: number;
  minTradingDays?: number;
  scalingPlan: boolean;
  tradingPlatforms: string[];
  tradableAssets: string[];
  featured: boolean;
  avgRating?: number;
  ratingCount: number;
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
