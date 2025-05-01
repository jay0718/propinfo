import { 
  users, type User, type InsertUser, 
  propFirms, type PropFirm, type InsertPropFirm,
  reviews, type Review, type InsertReview,
  resources, type Resource, type InsertResource,
  adminCredentials, type AdminCredentials, type InsertAdminCredentials
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // PropFirm operations
  getAllPropFirms(): Promise<PropFirm[]>;
  getFeaturedPropFirms(): Promise<PropFirm[]>;
  getPropFirm(id: number): Promise<PropFirm | undefined>;
  createPropFirm(firm: InsertPropFirm): Promise<PropFirm>;
  updatePropFirm(id: number, firm: Partial<PropFirm>): Promise<PropFirm | undefined>;
  deletePropFirm(id: number): Promise<boolean>;
  
  // Review operations
  getAllReviews(): Promise<Review[]>;
  getReviewsByFirmId(firmId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateFirmRating(firmId: number): Promise<void>;
  
  // Resource operations
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<Resource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  
  // Admin operations
  verifyAdminCredentials(username: string, password: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private propFirms: Map<number, PropFirm>;
  private reviews: Map<number, Review>;
  private resources: Map<number, Resource>;
  private adminCredentials: Map<number, AdminCredentials>;

  private currentUserId: number;
  private currentFirmId: number;
  private currentReviewId: number;
  private currentResourceId: number;
  private currentAdminId: number;

  constructor() {
    this.users = new Map();
    this.propFirms = new Map();
    this.reviews = new Map();
    this.resources = new Map();
    this.adminCredentials = new Map();

    this.currentUserId = 1;
    this.currentFirmId = 1;
    this.currentReviewId = 1;
    this.currentResourceId = 1;
    this.currentAdminId = 1;

    // Initialize with sample admin
    const adminId = this.currentAdminId++;
    this.adminCredentials.set(adminId, {
      id: adminId,
      username: 'admin',
      password: 'admin123' // In production, this would be hashed
    });

    // Initialize with sample data
    this.initSampleData();
  }

  // =================== User Methods =================== //
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // =================== PropFirm Methods =================== //
  async getAllPropFirms(): Promise<PropFirm[]> {
    return Array.from(this.propFirms.values());
  }

  async getFeaturedPropFirms(): Promise<PropFirm[]> {
    return Array.from(this.propFirms.values()).filter(firm => firm.featured);
  }

  async getPropFirm(id: number): Promise<PropFirm | undefined> {
    return this.propFirms.get(id);
  }

  async createPropFirm(firm: InsertPropFirm): Promise<PropFirm> {
    const id = this.currentFirmId++;
    const newFirm: PropFirm = { 
      ...firm, 
      id, 
      ratingCount: 0,
      avgRating: 0
    };
    this.propFirms.set(id, newFirm);
    return newFirm;
  }

  async updatePropFirm(id: number, updates: Partial<PropFirm>): Promise<PropFirm | undefined> {
    const firm = this.propFirms.get(id);
    if (!firm) return undefined;
    
    const updatedFirm = { ...firm, ...updates };
    this.propFirms.set(id, updatedFirm);
    return updatedFirm;
  }

  async deletePropFirm(id: number): Promise<boolean> {
    return this.propFirms.delete(id);
  }

  // =================== Review Methods =================== //
  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByFirmId(firmId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.firmId === firmId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, newReview);
    
    // Update the firm's rating
    await this.updateFirmRating(review.firmId);
    
    return newReview;
  }

  async updateFirmRating(firmId: number): Promise<void> {
    const firm = await this.getPropFirm(firmId);
    if (!firm) return;

    const firmReviews = await this.getReviewsByFirmId(firmId);
    const ratingCount = firmReviews.length;
    
    if (ratingCount === 0) {
      await this.updatePropFirm(firmId, { avgRating: 0, ratingCount: 0 });
      return;
    }
    
    const totalRating = firmReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / ratingCount;
    
    await this.updatePropFirm(firmId, { avgRating, ratingCount });
  }

  // =================== Resource Methods =================== //
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.category === category
    );
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const newResource: Resource = {
      ...resource,
      id
    };
    this.resources.set(id, newResource);
    return newResource;
  }

  async updateResource(id: number, updates: Partial<Resource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { ...resource, ...updates };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // =================== Admin Methods =================== //
  async verifyAdminCredentials(username: string, password: string): Promise<boolean> {
    const admin = Array.from(this.adminCredentials.values()).find(
      admin => admin.username === username && admin.password === password
    );
    
    return !!admin;
  }

  // =================== Sample Data =================== //
  private initSampleData() {
    // Sample Prop Firms
    const ftmo = this.createPropFirm({
      name: "FTMO",
      logo: "",
      description: "FTMO is a proprietary trading firm offering funded accounts to successful traders. They have a rigorous two-phase evaluation process before providing a funded account.",
      websiteUrl: "https://ftmo.com",
      maxAccountSize: 200000,
      profitSplit: 80,
      challengeFeeMin: 540,
      challengeFeeMax: 1080,
      payoutTime: 14,
      maxDailyDrawdown: 5,
      maxTotalDrawdown: 10,
      minTradingDays: 10,
      scalingPlan: true,
      tradingPlatforms: ["MetaTrader 4", "MetaTrader 5", "cTrader"],
      tradableAssets: ["Forex", "Commodities", "Indices", "Cryptos", "Stocks"],
      featured: true,
    });

    const fundedNext = this.createPropFirm({
      name: "Funded Next",
      logo: "",
      description: "Funded Next provides traders with capital to trade financial markets. They offer a straightforward evaluation process and competitive profit splits.",
      websiteUrl: "https://fundednext.com",
      maxAccountSize: 400000,
      profitSplit: 90,
      challengeFeeMin: 349,
      challengeFeeMax: 999,
      payoutTime: 7,
      maxDailyDrawdown: 4,
      maxTotalDrawdown: 8,
      minTradingDays: 0,
      scalingPlan: true,
      tradingPlatforms: ["MetaTrader 4", "MetaTrader 5"],
      tradableAssets: ["Forex", "Commodities", "Indices", "Cryptos"],
      featured: true,
    });

    const fundedTrader = this.createPropFirm({
      name: "The Funded Trader",
      logo: "",
      description: "The Funded Trader offers funded accounts with a user-friendly evaluation process. They are known for their quick payouts and excellent customer support.",
      websiteUrl: "https://thefundedtrader.com",
      maxAccountSize: 200000,
      profitSplit: 85,
      challengeFeeMin: 375,
      challengeFeeMax: 975,
      payoutTime: 5,
      maxDailyDrawdown: 5,
      maxTotalDrawdown: 8,
      minTradingDays: 5,
      scalingPlan: true,
      tradingPlatforms: ["MetaTrader 4", "MetaTrader 5"],
      tradableAssets: ["Forex", "Commodities", "Indices", "Cryptos"],
      featured: true,
    });

    // Sample Resources
    this.createResource({
      title: "How to Pass a Prop Firm Challenge",
      content: "<p>This comprehensive guide walks you through the essential strategies for passing prop firm challenges...</p>",
      summary: "Essential strategies and tips for successfully passing prop firm evaluations and securing funded accounts.",
      category: "Beginner Guide",
      authorName: "Sarah Johnson",
      authorImage: "https://randomuser.me/api/portraits/women/40.jpg",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
      readTime: 8,
      publishedAt: new Date("2023-08-15"),
    });

    this.createResource({
      title: "Risk Management Techniques for Prop Traders",
      content: "<p>Learn effective risk management strategies to protect your capital and navigate prop firm drawdown rules...</p>",
      summary: "Learn effective risk management strategies to protect your capital and navigate prop firm drawdown rules.",
      category: "Risk Management",
      authorName: "Michael Chen",
      authorImage: "https://randomuser.me/api/portraits/men/35.jpg",
      image: "https://images.unsplash.com/photo-1642543348745-03b1219733d9",
      readTime: 12,
      publishedAt: new Date("2023-09-22"),
    });

    this.createResource({
      title: "Top 5 Prop Trading Firms of 2023",
      content: "<p>Comprehensive reviews and comparisons of the leading proprietary trading firms based on trader feedback...</p>",
      summary: "Comprehensive reviews and comparisons of the leading proprietary trading firms based on trader feedback.",
      category: "Compare & Review",
      authorName: "Alex Rodriguez",
      authorImage: "https://randomuser.me/api/portraits/men/65.jpg",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74",
      readTime: 15,
      publishedAt: new Date("2023-10-08"),
    });

    // Sample Reviews
    this.createReview({
      firmId: 1,
      username: "James Wilson",
      rating: 5,
      title: "Excellent Platform and Support",
      content: "FTMO has been life-changing for me. Their platform is incredibly stable, and their support team is responsive. I've received every payout on time, and the scaling opportunities are excellent.",
      tradingExperience: "Forex Trader, 2 years with FTMO",
    });

    this.createReview({
      firmId: 3,
      username: "Emma Thompson",
      rating: 4,
      title: "Great Profit Split",
      content: "The Funded Trader offers the best profit split I've found. Their challenge rules are reasonable, and I appreciate the rapid payout system. Their educational resources also helped me improve my trading.",
      tradingExperience: "Futures Trader, 1 year with TFT",
    });

    this.createReview({
      firmId: 2,
      username: "David Kumar",
      rating: 4,
      title: "Competitive Fees",
      content: "Funded Next has some of the most competitive challenge fees in the industry. I've managed to get funded on my first attempt, and their dashboard makes tracking my trading metrics straightforward.",
      tradingExperience: "Crypto Trader, 6 months with Funded Next",
    });
  }
}

export const storage = new MemStorage();
