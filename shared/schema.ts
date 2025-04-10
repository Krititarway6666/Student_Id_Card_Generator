import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  rollNumber: text("roll_number").notNull(),
  classGrade: text("class_grade").notNull(),
  division: text("division").notNull(),
  allergies: text("allergies").array(),
  rackNumber: text("rack_number"),
  busRoute: text("bus_route"),
  photo: text("photo").notNull(),
  template: text("template").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
