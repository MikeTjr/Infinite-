import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const mirrorResultsTable = pgTable("mirror_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  assessmentType: text("assessment_type", { enum: ["love_language", "conflict_style"] }).notNull(),
  partner1Result: text("partner1_result").notNull(),
  partner2Result: text("partner2_result").notNull(),
  completedAt: timestamp("completed_at").notNull(),
});

export const insertMirrorResultSchema = createInsertSchema(mirrorResultsTable).omit({ id: true });
export const selectMirrorResultSchema = createSelectSchema(mirrorResultsTable);

export type InsertMirrorResult = z.infer<typeof insertMirrorResultSchema>;
export type MirrorResult = typeof mirrorResultsTable.$inferSelect;
