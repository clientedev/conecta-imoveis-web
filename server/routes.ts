import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { storage } from './storage';
import bcrypt from 'bcrypt';
import { 
  insertProfileSchema, 
  insertPropertySchema, 
  insertLeadSchema, 
  insertAppointmentSchema,
  insertBrokerOrderSchema 
} from '@shared/schema';

const app = new Hono();

app.use('*', cors());

// Authentication routes
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email e senha são obrigatórios' }, 400);
    }

    const profile = await storage.getProfileByEmail(email);
    
    if (!profile) {
      return c.json({ error: 'Email ou senha inválidos' }, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, profile.password);
    
    if (!isPasswordValid) {
      return c.json({ error: 'Email ou senha inválidos' }, 401);
    }

    const { password: _, ...profileWithoutPassword } = profile;
    
    return c.json({
      user: { id: profile.id, email: profile.email },
      profile: {
        ...profileWithoutPassword,
        is_admin: profile.role === 'admin',
        user_type: profile.role === 'corretor' ? 'broker' : profile.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Erro ao fazer login' }, 500);
  }
});

app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, fullName, phone } = await c.req.json();
    
    if (!email || !password || !fullName) {
      return c.json({ error: 'Email, senha e nome completo são obrigatórios' }, 400);
    }

    const existingProfile = await storage.getProfileByEmail(email);
    if (existingProfile) {
      return c.json({ error: 'Email já cadastrado' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newProfile = await storage.createProfile({
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: 'client',
      isActive: true
    });

    const { password: _, ...profileWithoutPassword } = newProfile;
    
    return c.json({
      user: { id: newProfile.id, email: newProfile.email },
      profile: {
        ...profileWithoutPassword,
        is_admin: false,
        user_type: 'client'
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Erro ao criar conta' }, 500);
  }
});

// Profiles routes
app.get('/api/profiles', async (c) => {
  try {
    const profiles = await storage.getAllProfiles();
    return c.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return c.json({ error: 'Failed to fetch profiles' }, 500);
  }
});

app.get('/api/profiles/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const profile = await storage.getProfile(id);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    return c.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.post('/api/profiles', zValidator('json', insertProfileSchema), async (c) => {
  try {
    const profileData = c.req.valid('json');
    const profile = await storage.createProfile(profileData);
    return c.json(profile, 201);
  } catch (error) {
    console.error('Error creating profile:', error);
    return c.json({ error: 'Failed to create profile' }, 500);
  }
});

app.patch('/api/profiles/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    const profile = await storage.updateProfile(id, updateData);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    return c.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Properties routes
app.get('/api/properties', async (c) => {
  try {
    const properties = await storage.getAllProperties();
    return c.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({ error: 'Failed to fetch properties' }, 500);
  }
});

app.get('/api/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const property = await storage.getProperty(id);
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }
    return c.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return c.json({ error: 'Failed to fetch property' }, 500);
  }
});

const createPropertySchema = insertPropertySchema.extend({
  additionalImages: z.array(z.string()).optional()
});

app.post('/api/properties', zValidator('json', createPropertySchema), async (c) => {
  try {
    const body = c.req.valid('json');
    const { additionalImages, ...propertyData } = body;
    
    const property = await storage.createProperty(propertyData);
    
    if (additionalImages && additionalImages.length > 0) {
      await storage.addPropertyImages(property.id, additionalImages);
    }
    
    return c.json(property, 201);
  } catch (error) {
    console.error('Error creating property:', error);
    return c.json({ error: 'Failed to create property' }, 500);
  }
});

app.patch('/api/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    const property = await storage.updateProperty(id, updateData);
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }
    return c.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return c.json({ error: 'Failed to update property' }, 500);
  }
});

// Leads routes
app.get('/api/leads', async (c) => {
  try {
    const leads = await storage.getAllLeads();
    return c.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return c.json({ error: 'Failed to fetch leads' }, 500);
  }
});

app.get('/api/leads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const lead = await storage.getLead(id);
    if (!lead) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    return c.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return c.json({ error: 'Failed to fetch lead' }, 500);
  }
});

app.post('/api/leads', zValidator('json', insertLeadSchema), async (c) => {
  try {
    const leadData = c.req.valid('json');
    const lead = await storage.createLead(leadData);
    
    try {
      await storage.assignNextLead(lead.id);
      console.log(`Lead ${lead.id} automatically assigned to broker`);
    } catch (assignError) {
      console.error('Error auto-assigning lead:', assignError);
    }
    
    return c.json(lead, 201);
  } catch (error) {
    console.error('Error creating lead:', error);
    return c.json({ error: 'Failed to create lead' }, 500);
  }
});

app.patch('/api/leads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    const lead = await storage.updateLead(id, updateData);
    if (!lead) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    return c.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return c.json({ error: 'Failed to update lead' }, 500);
  }
});

app.delete('/api/leads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const success = await storage.deleteLead(id);
    if (!success) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return c.json({ error: 'Failed to delete lead' }, 500);
  }
});

// Lead assignment route
app.post('/api/leads/:id/assign', async (c) => {
  try {
    const id = c.req.param('id');
    const lead = await storage.assignNextLead(id);
    if (!lead) {
      return c.json({ error: 'Failed to assign lead' }, 400);
    }
    return c.json(lead);
  } catch (error) {
    console.error('Error assigning lead:', error);
    return c.json({ error: 'Failed to assign lead' }, 500);
  }
});

// Appointments routes
app.get('/api/appointments', async (c) => {
  try {
    const appointments = await storage.getAllAppointments();
    return c.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

app.get('/api/appointments/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const appointment = await storage.getAppointment(id);
    if (!appointment) {
      return c.json({ error: 'Appointment not found' }, 404);
    }
    return c.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return c.json({ error: 'Failed to fetch appointment' }, 500);
  }
});

app.post('/api/appointments', zValidator('json', insertAppointmentSchema), async (c) => {
  try {
    const appointmentData = c.req.valid('json');
    const appointment = await storage.createAppointment(appointmentData);
    return c.json(appointment, 201);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return c.json({ error: 'Failed to create appointment' }, 500);
  }
});

app.patch('/api/appointments/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    const appointment = await storage.updateAppointment(id, updateData);
    if (!appointment) {
      return c.json({ error: 'Appointment not found' }, 404);
    }
    return c.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return c.json({ error: 'Failed to update appointment' }, 500);
  }
});

// Broker order routes
app.get('/api/broker-order', async (c) => {
  try {
    const brokerOrder = await storage.getBrokerOrder();
    return c.json(brokerOrder);
  } catch (error) {
    console.error('Error fetching broker order:', error);
    return c.json({ error: 'Failed to fetch broker order' }, 500);
  }
});

app.patch('/api/broker-order', async (c) => {
  try {
    const orderData = await c.req.json();
    const { orders } = orderData;
    
    if (!Array.isArray(orders)) {
      return c.json({ error: 'Orders must be an array' }, 400);
    }

    await storage.updateBrokerOrder(orders);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating broker order:', error);
    return c.json({ error: 'Failed to update broker order' }, 500);
  }
});

app.post('/api/broker-order/:brokerId', async (c) => {
  try {
    const brokerId = c.req.param('brokerId');
    const brokerOrder = await storage.addBrokerToOrder(brokerId);
    return c.json(brokerOrder, 201);
  } catch (error) {
    console.error('Error adding broker to order:', error);
    return c.json({ error: 'Failed to add broker to order' }, 500);
  }
});

app.delete('/api/broker-order/:brokerId', async (c) => {
  try {
    const brokerId = c.req.param('brokerId');
    await storage.removeBrokerFromOrder(brokerId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing broker from order:', error);
    return c.json({ error: 'Failed to remove broker from order' }, 500);
  }
});

// Brokers routes
app.get('/api/brokers', async (c) => {
  try {
    const brokers = await storage.getBrokers();
    return c.json(brokers);
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return c.json({ error: 'Failed to fetch brokers' }, 500);
  }
});

// Admin routes
app.post('/api/admin/promote/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    await storage.promoteToAdmin(userId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error promoting to admin:', error);
    return c.json({ error: 'Failed to promote user to admin' }, 500);
  }
});

app.post('/api/admin/demote/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    await storage.demoteFromAdmin(userId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error demoting from admin:', error);
    return c.json({ error: 'Failed to demote user from admin' }, 500);
  }
});

app.post('/api/admin/promote-broker/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    await storage.promoteToBroker(userId);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error promoting to broker:', error);
    return c.json({ error: 'Failed to promote user to broker' }, 500);
  }
});

app.get('/api/admin/emails', async (c) => {
  try {
    const emails = await storage.getAdminEmails();
    return c.json(emails);
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return c.json({ error: 'Failed to fetch admin emails' }, 500);
  }
});

export default app;