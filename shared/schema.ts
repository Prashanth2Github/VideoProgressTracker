import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videoProgress = pgTable("video_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  videoId: text("video_id").notNull(),
  intervals: jsonb("intervals").$type<[number, number][]>().notNull(),
  totalUniqueSeconds: integer("total_unique_seconds").notNull().default(0),
  lastPosition: integer("last_position").notNull().default(0),
  duration: integer("duration").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schema now requires updatedAt
export const insertVideoProgressSchema = createInsertSchema(videoProgress).pick({
  userId: true,
  videoId: true,
  intervals: true,
  totalUniqueSeconds: true,
  lastPosition: true,
  duration: true,
  updatedAt: true,  // <--- add this
});

export const updateVideoProgressSchema = insertVideoProgressSchema.partial().extend({
  userId: z.string(),
  videoId: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type VideoProgress = typeof videoProgress.$inferSelect;
export type InsertVideoProgress = z.infer<typeof insertVideoProgressSchema>;
export type UpdateVideoProgress = z.infer<typeof updateVideoProgressSchema>;
