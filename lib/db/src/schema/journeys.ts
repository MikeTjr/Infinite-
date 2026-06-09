import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const journeysTable = pgTable("journeys", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  currentSeason: text("current_season").notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedDays: integer("completed_days").notNull().default(0),
  lastCheckinAt: timestamp("last_checkin_at"),
});

export const insertJourneySchema = createInsertSchema(journeysTable).omit({ id: true });
export const selectJourneySchema = createSelectSchema(journeysTable);

export type InsertJourney = z.infer<typeof insertJourneySchema>;
export type Journey = typeof journeysTable.$inferSelect;
