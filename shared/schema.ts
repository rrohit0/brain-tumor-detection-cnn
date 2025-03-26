import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define brain tumor image schema
export const brainImages = pgTable("brain_images", {
  id: serial("id").primaryKey(),
  originalFilename: text("original_filename").notNull(),
  storagePath: text("storage_path").notNull(),
  processedPath: text("processed_path"),
  uploadDate: text("upload_date").notNull(),
  hasTumor: boolean("has_tumor"),
  confidenceScore: text("confidence_score"),
  metadata: jsonb("metadata"),
});

export const insertBrainImageSchema = createInsertSchema(brainImages).omit({
  id: true
});

export type InsertBrainImage = z.infer<typeof insertBrainImageSchema>;
export type BrainImage = typeof brainImages.$inferSelect;
