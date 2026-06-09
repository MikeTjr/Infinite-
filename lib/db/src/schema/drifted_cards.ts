import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { couplesTable } from "./couples";

export const driftedCardsTable = pgTable("drifted_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  cardId: text("card_id").notNull(),
  count: integer("count").notNull().default(1),
  lastDriftedAt: timestamp("last_drifted_at").defaultNow().notNull(),
});

export const retiredCardsTable = pgTable("retired_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupleId: uuid("couple_id").notNull().references(() => couplesTable.id, { onDelete: "cascade" }),
  cardId: text("card_id").notNull(),
  retiredAt: timestamp("retired_at").defaultNow().notNull(),
});

export const insertDriftedCardSchema = createInsertSchema(driftedCardsTable).omit({ id: true, lastDriftedAt: true });
export const selectDriftedCardSchema = createSelectSchema(driftedCardsTable);
export const insertRetiredCardSchema = createInsertSchema(retiredCardsTable).omit({ id: true, retiredAt: true });

export type InsertDriftedCard = z.infer<typeof insertDriftedCardSchema>;
export type DriftedCard = typeof driftedCardsTable.$inferSelect;
export type InsertRetiredCard = z.infer<typeof insertRetiredCardSchema>;
export type RetiredCard = typeof retiredCardsTable.$inferSelect;
