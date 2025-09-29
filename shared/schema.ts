import { serial, uuid, varchar, text, boolean, integer, timestamp, numeric, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations, sql } from "drizzle-orm";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "corretor", "client"]);
export const leadStatusEnum = pgEnum("lead_status", ["pending", "assigned", "contacted", "qualified", "converted", "lost"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["scheduled", "confirmed", "completed", "cancelled", "rescheduled"]);

// Admin emails table
export const adminEmails = pgTable("admin_emails", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").default("client"),
  userType: varchar("user_type", { length: 50 }),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  area: varchar("area", { length: 100 }),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  propertyType: varchar("property_type", { length: 100 }),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property images table
export const propertyImages = pgTable("property_images", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: uuid("property_id").references(() => properties.id).notNull(),
  imageUrl: text("image_url").notNull(),
  imageOrder: integer("image_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leads table - enhanced with distribution system
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  locationInterest: varchar("location_interest", { length: 255 }),
  propertyType: varchar("property_type", { length: 100 }),
  priceRange: varchar("price_range", { length: 100 }),
  observations: text("observations"),
  status: leadStatusEnum("status").default("pending"),
  handledBy: uuid("handled_by").references(() => profiles.id),
  handledAt: timestamp("handled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: uuid("client_id").references(() => profiles.id),
  propertyId: uuid("property_id").references(() => properties.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: appointmentStatusEnum("status").default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Broker order table - new table for lead distribution
export const brokerOrder = pgTable("broker_order", {
  id: serial("id").primaryKey(),
  brokerId: uuid("broker_id").references(() => profiles.id).notNull(),
  orderPosition: integer("order_position").notNull(),
  isActive: boolean("is_active").default(true),
  lastAssigned: timestamp("last_assigned"),
  totalLeadsAssigned: integer("total_leads_assigned").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead distribution log - to track assignments
export const leadDistributionLog = pgTable("lead_distribution_log", {
  id: serial("id").primaryKey(),
  leadId: uuid("lead_id").references(() => leads.id).notNull(),
  brokerId: uuid("broker_id").references(() => profiles.id).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  orderPosition: integer("order_position").notNull(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  handledLeads: many(leads),
  appointments: many(appointments),
  brokerOrder: many(brokerOrder),
}));

export const propertiesRelations = relations(properties, ({ many }) => ({
  images: many(propertyImages),
  appointments: many(appointments),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  handledBy: one(profiles, {
    fields: [leads.handledBy],
    references: [profiles.id],
  }),
  distributionLogs: many(leadDistributionLog),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(profiles, {
    fields: [appointments.clientId],
    references: [profiles.id],
  }),
  property: one(properties, {
    fields: [appointments.propertyId],
    references: [properties.id],
  }),
}));

export const brokerOrderRelations = relations(brokerOrder, ({ one, many }) => ({
  broker: one(profiles, {
    fields: [brokerOrder.brokerId],
    references: [profiles.id],
  }),
  distributionLogs: many(leadDistributionLog),
}));

export const leadDistributionLogRelations = relations(leadDistributionLog, ({ one }) => ({
  lead: one(leads, {
    fields: [leadDistributionLog.leadId],
    references: [leads.id],
  }),
  broker: one(profiles, {
    fields: [leadDistributionLog.brokerId],
    references: [profiles.id],
  }),
}));

// Zod schemas
export const insertProfileSchema = createInsertSchema(profiles);
export const insertPropertySchema = createInsertSchema(properties);
export const insertLeadSchema = createInsertSchema(leads);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertBrokerOrderSchema = createInsertSchema(brokerOrder);
export const insertLeadDistributionLogSchema = createInsertSchema(leadDistributionLog);

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type BrokerOrder = typeof brokerOrder.$inferSelect;
export type InsertBrokerOrder = typeof brokerOrder.$inferInsert;
export type LeadDistributionLog = typeof leadDistributionLog.$inferSelect;
export type InsertLeadDistributionLog = typeof leadDistributionLog.$inferInsert;