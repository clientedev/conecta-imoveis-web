import { db } from "./db";
import { 
  profiles, 
  properties, 
  leads, 
  appointments, 
  brokerOrder, 
  leadDistributionLog,
  propertyImages,
  adminEmails,
  type Profile, 
  type InsertProfile, 
  type Property, 
  type InsertProperty,
  type Lead, 
  type InsertLead, 
  type Appointment, 
  type InsertAppointment,
  type BrokerOrder,
  type InsertBrokerOrder,
  type LeadDistributionLog
} from "@shared/schema";
import { eq, desc, asc, and, isNull, sql } from "drizzle-orm";

export interface IStorage {
  // Profile operations
  getProfile(id: string): Promise<Profile | undefined>;
  createProfile(insertProfile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  getBrokers(): Promise<Profile[]>;

  // Property operations
  getProperty(id: string): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  createProperty(insertProperty: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<Property>): Promise<Property | undefined>;
  addPropertyImages(propertyId: string, imageUrls: string[]): Promise<void>;

  // Lead operations
  getLead(id: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<(Lead & { handledBy?: Profile })[]>;
  createLead(insertLead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<Lead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;
  assignNextLead(leadId: string): Promise<Lead | undefined>;

  // Appointment operations
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<(Appointment & { client?: Profile; property?: Property })[]>;
  createAppointment(insertAppointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | undefined>;

  // Broker order operations
  getBrokerOrder(): Promise<(BrokerOrder & { broker: Profile })[]>;
  updateBrokerOrder(orders: { id: number; orderPosition: number }[]): Promise<void>;
  addBrokerToOrder(brokerId: string): Promise<BrokerOrder>;
  removeBrokerFromOrder(brokerId: string): Promise<void>;

  // Admin operations
  promoteToAdmin(userId: string): Promise<void>;
  demoteFromAdmin(userId: string): Promise<void>;
  promoteToBroker(userId: string): Promise<void>;
  getAdminEmails(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  // Profile operations
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profile, updatedAt: sql`now()` })
      .where(eq(profiles.id, id))
      .returning();
    return updatedProfile || undefined;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }

  async getBrokers(): Promise<Profile[]> {
    return await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.role, "corretor"), eq(profiles.isActive, true)))
      .orderBy(asc(profiles.fullName));
  }

  // Property operations
  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: sql`now()` })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty || undefined;
  }

  async addPropertyImages(propertyId: string, imageUrls: string[]): Promise<void> {
    if (imageUrls.length === 0) return;
    
    const imageInserts = imageUrls.map((imageUrl, index) => ({
      propertyId,
      imageUrl,
      imageOrder: index
    }));
    
    await db.insert(propertyImages).values(imageInserts);
  }

  // Lead operations
  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getAllLeads(): Promise<(Lead & { handledBy?: Profile })[]> {
    const results = await db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        phone: leads.phone,
        locationInterest: leads.locationInterest,
        propertyType: leads.propertyType,
        priceRange: leads.priceRange,
        observations: leads.observations,
        status: leads.status,
        handledBy: leads.handledBy,
        handledAt: leads.handledAt,
        createdAt: leads.createdAt,
        handledByProfile: profiles,
      })
      .from(leads)
      .leftJoin(profiles, eq(leads.handledBy, profiles.id))
      .orderBy(desc(leads.createdAt));
    
    return results.map(result => ({
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      locationInterest: result.locationInterest,
      propertyType: result.propertyType,
      priceRange: result.priceRange,
      observations: result.observations,
      status: result.status,
      handledBy: result.handledBy,
      handledAt: result.handledAt,
      createdAt: result.createdAt,
      handledByProfile: result.handledByProfile || undefined,
    }));
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    
    // Auto-assign to next broker if status is pending
    if (lead.status === "pending") {
      const assignedLead = await this.assignNextLead(lead.id);
      return assignedLead || lead;
    }
    
    return lead;
  }

  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead | undefined> {
    const [updatedLead] = await db
      .update(leads)
      .set(lead)
      .where(eq(leads.id, id))
      .returning();
    return updatedLead || undefined;
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return result.rowCount > 0;
  }

  async assignNextLead(leadId: string): Promise<Lead | undefined> {
    // Use transaction to ensure atomic lead assignment
    return await db.transaction(async (tx) => {
      // Phase 1: Try to find a broker who has never been assigned (lastAssigned IS NULL)
      let nextBroker = await tx
        .select({
          id: brokerOrder.id,
          brokerId: brokerOrder.brokerId,
          orderPosition: brokerOrder.orderPosition,
          lastAssigned: brokerOrder.lastAssigned,
          totalLeadsAssigned: brokerOrder.totalLeadsAssigned,
        })
        .from(brokerOrder)
        .where(and(eq(brokerOrder.isActive, true), isNull(brokerOrder.lastAssigned)))
        .orderBy(asc(brokerOrder.orderPosition))
        .limit(1)
        .for('update');

      // Phase 2: If no never-assigned broker found, get the one with oldest lastAssigned
      if (nextBroker.length === 0) {
        nextBroker = await tx
          .select({
            id: brokerOrder.id,
            brokerId: brokerOrder.brokerId,
            orderPosition: brokerOrder.orderPosition,
            lastAssigned: brokerOrder.lastAssigned,
            totalLeadsAssigned: brokerOrder.totalLeadsAssigned,
          })
          .from(brokerOrder)
          .where(eq(brokerOrder.isActive, true))
          .orderBy(asc(brokerOrder.lastAssigned), asc(brokerOrder.orderPosition))
          .limit(1)
          .for('update');
      }

      if (nextBroker.length === 0) {
        console.log("No active brokers found for lead assignment");
        return undefined;
      }

      const broker = nextBroker[0];

      // Check if lead is still available for assignment
      const [leadToAssign] = await tx
        .select()
        .from(leads)
        .where(and(eq(leads.id, leadId), isNull(leads.handledBy)))
        .for('update');

      if (!leadToAssign) {
        console.log("Lead already assigned or not found");
        return undefined;
      }

      // Update lead with assigned broker
      const [updatedLead] = await tx
        .update(leads)
        .set({
          handledBy: broker.brokerId,
          handledAt: sql`now()`,
          status: "assigned"
        })
        .where(eq(leads.id, leadId))
        .returning();

      // Update broker order with last assigned time and count
      await tx
        .update(brokerOrder)
        .set({
          lastAssigned: sql`now()`,
          totalLeadsAssigned: broker.totalLeadsAssigned + 1,
          updatedAt: sql`now()`
        })
        .where(eq(brokerOrder.id, broker.id));

      // Log the assignment
      await tx.insert(leadDistributionLog).values({
        leadId: leadId,
        brokerId: broker.brokerId,
        orderPosition: broker.orderPosition,
      });

      return updatedLead || undefined;
    });
  }

  // Appointment operations
  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAllAppointments(): Promise<(Appointment & { client?: Profile; property?: Property })[]> {
    return await db
      .select({
        id: appointments.id,
        clientId: appointments.clientId,
        propertyId: appointments.propertyId,
        appointmentDate: appointments.appointmentDate,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        client: profiles,
        property: properties,
      })
      .from(appointments)
      .leftJoin(profiles, eq(appointments.clientId, profiles.id))
      .leftJoin(properties, eq(appointments.propertyId, properties.id))
      .orderBy(desc(appointments.appointmentDate))
      .then(results =>
        results.map(result => ({
          ...result,
          client: result.client || undefined,
          property: result.property || undefined,
        }))
      );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(insertAppointment).returning();
    return appointment;
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set(appointment)
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment || undefined;
  }

  // Broker order operations
  async getBrokerOrder(): Promise<(BrokerOrder & { broker: Profile })[]> {
    return await db
      .select({
        id: brokerOrder.id,
        brokerId: brokerOrder.brokerId,
        orderPosition: brokerOrder.orderPosition,
        isActive: brokerOrder.isActive,
        lastAssigned: brokerOrder.lastAssigned,
        totalLeadsAssigned: brokerOrder.totalLeadsAssigned,
        createdAt: brokerOrder.createdAt,
        updatedAt: brokerOrder.updatedAt,
        broker: profiles,
      })
      .from(brokerOrder)
      .innerJoin(profiles, eq(brokerOrder.brokerId, profiles.id))
      .orderBy(asc(brokerOrder.orderPosition));
  }

  async updateBrokerOrder(orders: { id: number; orderPosition: number }[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (const order of orders) {
        await tx
          .update(brokerOrder)
          .set({ 
            orderPosition: order.orderPosition,
            updatedAt: sql`now()`
          })
          .where(eq(brokerOrder.id, order.id));
      }
    });
  }

  async addBrokerToOrder(brokerId: string): Promise<BrokerOrder> {
    // Get the highest order position
    const maxPosition = await db
      .select({ max: sql<number>`MAX(${brokerOrder.orderPosition})` })
      .from(brokerOrder);
    
    const nextPosition = (maxPosition[0]?.max || 0) + 1;

    const [newOrder] = await db
      .insert(brokerOrder)
      .values({
        brokerId,
        orderPosition: nextPosition,
        isActive: true,
      })
      .returning();

    return newOrder;
  }

  async removeBrokerFromOrder(brokerId: string): Promise<void> {
    await db
      .update(brokerOrder)
      .set({ isActive: false, updatedAt: sql`now()` })
      .where(eq(brokerOrder.brokerId, brokerId));
  }

  // Admin operations
  async promoteToAdmin(userId: string): Promise<void> {
    await db
      .update(profiles)
      .set({ 
        isAdmin: true, 
        role: "admin",
        updatedAt: sql`now()`
      })
      .where(eq(profiles.id, userId));
  }

  async demoteFromAdmin(userId: string): Promise<void> {
    await db
      .update(profiles)
      .set({ 
        isAdmin: false, 
        role: "client",
        updatedAt: sql`now()`
      })
      .where(eq(profiles.id, userId));
  }

  async promoteToBroker(userId: string): Promise<void> {
    await db
      .update(profiles)
      .set({ 
        role: "corretor",
        updatedAt: sql`now()`
      })
      .where(eq(profiles.id, userId));

    // Add to broker order if not already there
    const existing = await db
      .select()
      .from(brokerOrder)
      .where(eq(brokerOrder.brokerId, userId))
      .limit(1);

    if (existing.length === 0) {
      await this.addBrokerToOrder(userId);
    }
  }

  async getAdminEmails(): Promise<string[]> {
    const result = await db.select({ email: adminEmails.email }).from(adminEmails);
    return result.map(r => r.email);
  }
}

export const storage = new DatabaseStorage();