import {
  users,
  storyTemplates,
  stories,
  orders,
  type User,
  type UpsertUser,
  type StoryTemplate,
  type InsertStoryTemplate,
  type Story,
  type InsertStory,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Story template operations
  getStoryTemplates(): Promise<StoryTemplate[]>;
  getStoryTemplate(id: number): Promise<StoryTemplate | undefined>;
  createStoryTemplate(template: InsertStoryTemplate): Promise<StoryTemplate>;
  
  // Story operations
  getStoriesByUser(userId: string): Promise<Story[]>;
  getStory(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, story: Partial<InsertStory>): Promise<Story>;
  deleteStory(id: number): Promise<void>;
  getPublishedStories(): Promise<Story[]>;
  searchStories(query: string, genre?: string, ageGroup?: string): Promise<Story[]>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllStories(): Promise<Story[]>;
  
  // Order operations
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Story template operations
  async getStoryTemplates(): Promise<StoryTemplate[]> {
    return await db.select().from(storyTemplates).orderBy(desc(storyTemplates.createdAt));
  }

  async getStoryTemplate(id: number): Promise<StoryTemplate | undefined> {
    const [template] = await db.select().from(storyTemplates).where(eq(storyTemplates.id, id));
    return template;
  }

  async createStoryTemplate(template: InsertStoryTemplate): Promise<StoryTemplate> {
    const [newTemplate] = await db.insert(storyTemplates).values(template).returning();
    return newTemplate;
  }

  // Story operations
  async getStoriesByUser(userId: string): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.userId, userId)).orderBy(desc(stories.createdAt));
  }

  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story;
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    return newStory;
  }

  async updateStory(id: number, story: Partial<InsertStory>): Promise<Story> {
    const [updatedStory] = await db
      .update(stories)
      .set({ ...story, updatedAt: new Date() })
      .where(eq(stories.id, id))
      .returning();
    return updatedStory;
  }

  async deleteStory(id: number): Promise<void> {
    await db.delete(stories).where(eq(stories.id, id));
  }

  async getPublishedStories(): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.isPublished, true)).orderBy(desc(stories.createdAt));
  }

  async searchStories(query: string, genre?: string, ageGroup?: string): Promise<Story[]> {
    let conditions = [eq(stories.isPublished, true)];
    
    if (query) {
      conditions.push(ilike(stories.title, `%${query}%`));
    }
    
    if (genre) {
      conditions.push(eq(stories.genre, genre));
    }
    
    if (ageGroup) {
      conditions.push(eq(stories.ageGroup, ageGroup));
    }
    
    return await db.select().from(stories)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(stories.createdAt));
  }

  // Order operations
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ orderStatus: status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.createdAt));
  }
}

export const storage = new DatabaseStorage();
