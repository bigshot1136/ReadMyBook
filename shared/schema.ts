import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storyTemplates = pgTable("story_templates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  placeholderNames: jsonb("placeholder_names"), // Characters that can be customized
  genre: varchar("genre", { length: 50 }),
  ageGroup: varchar("age_group", { length: 20 }),
  pageCount: integer("page_count"),
  previewImages: jsonb("preview_images"),
  description: text("description"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  storyType: varchar("story_type", { length: 20 }).notNull(), // 'template', 'custom', 'premade'
  userId: varchar("user_id").references(() => users.id),
  characterNames: jsonb("character_names"),
  pageCount: integer("page_count"),
  illustrations: jsonb("illustrations"), // Array of image URLs
  genre: varchar("genre", { length: 50 }),
  ageGroup: varchar("age_group", { length: 20 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  isPublished: boolean("is_published").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.0"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  storyId: integer("story_id").references(() => stories.id),
  orderType: varchar("order_type", { length: 20 }), // 'digital', 'physical', 'custom'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  shippingAddress: jsonb("shipping_address"),
  orderStatus: varchar("order_status", { length: 20 }).default("processing"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertStoryTemplate = typeof storyTemplates.$inferInsert;
export type StoryTemplate = typeof storyTemplates.$inferSelect;

export type InsertStory = typeof stories.$inferInsert;
export type Story = typeof stories.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

// Zod schemas
export const insertStoryTemplateSchema = createInsertSchema(storyTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const customStoryRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  pageCount: z.number().min(8).max(50),
  characterNames: z.array(z.string()).min(1, "At least one character name is required"),
  theme: z.string().min(1, "Theme is required"),
  characterPhotos: z.array(z.string()).optional(), // Base64 encoded images
});

export type CustomStoryRequest = z.infer<typeof customStoryRequestSchema>;
