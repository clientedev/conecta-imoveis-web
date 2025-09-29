import { 
  Profile, 
  Property, 
  Lead, 
  Appointment, 
  BrokerOrder 
} from "@shared/schema";

class APIClient {
  private baseURL = '/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Profiles
  async getProfiles(): Promise<Profile[]> {
    return this.request('/profiles');
  }

  async getProfile(id: string): Promise<Profile> {
    return this.request(`/profiles/${id}`);
  }

  async createProfile(profile: Partial<Profile>): Promise<Profile> {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateProfile(id: string, profile: Partial<Profile>): Promise<Profile> {
    return this.request(`/profiles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    return this.request('/properties');
  }

  async getProperty(id: string): Promise<Property> {
    return this.request(`/properties/${id}`);
  }

  async createProperty(property: Partial<Property>): Promise<Property> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    return this.request(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(property),
    });
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    return this.request('/leads');
  }

  async getLead(id: string): Promise<Lead> {
    return this.request(`/leads/${id}`);
  }

  async createLead(lead: Partial<Lead>): Promise<Lead> {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    });
  }

  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
    return this.request(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(lead),
    });
  }

  async deleteLead(id: string): Promise<{ success: boolean }> {
    return this.request(`/leads/${id}`, { method: 'DELETE' });
  }

  async assignLead(id: string): Promise<Lead> {
    return this.request(`/leads/${id}/assign`, { method: 'POST' });
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return this.request('/appointments');
  }

  async getAppointment(id: string): Promise<Appointment> {
    return this.request(`/appointments/${id}`);
  }

  async createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    return this.request(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(appointment),
    });
  }

  // Brokers
  async getBrokers(): Promise<Profile[]> {
    return this.request('/brokers');
  }

  // Broker Order
  async getBrokerOrder(): Promise<BrokerOrder[]> {
    return this.request('/broker-order');
  }

  async updateBrokerOrder(orders: { id: number; orderPosition: number }[]): Promise<{ success: boolean }> {
    return this.request('/broker-order', {
      method: 'PATCH',
      body: JSON.stringify({ orders }),
    });
  }

  async addBrokerToOrder(brokerId: string): Promise<BrokerOrder> {
    return this.request(`/broker-order/${brokerId}`, { method: 'POST' });
  }

  async removeBrokerFromOrder(brokerId: string): Promise<{ success: boolean }> {
    return this.request(`/broker-order/${brokerId}`, { method: 'DELETE' });
  }

  // Admin operations
  async promoteToAdmin(userId: string): Promise<{ success: boolean }> {
    return this.request(`/admin/promote/${userId}`, { method: 'POST' });
  }

  async demoteFromAdmin(userId: string): Promise<{ success: boolean }> {
    return this.request(`/admin/demote/${userId}`, { method: 'POST' });
  }

  async promoteToBroker(userId: string): Promise<{ success: boolean }> {
    return this.request(`/admin/promote-broker/${userId}`, { method: 'POST' });
  }

  async getAdminEmails(): Promise<string[]> {
    return this.request('/admin/emails');
  }

  // Compatibility methods to match Supabase-like API
  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => this.selectWithFilter(table, columns, { [column]: value }),
        order: (column: string, options?: { ascending?: boolean }) => 
          this.selectWithOrder(table, columns, column, options),
        data: () => this.select(table, columns),
      }),
      insert: (data: any) => ({
        returning: () => this.insert(table, data),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => 
          this.update(table, data, { [column]: value }),
      }),
      delete: () => ({
        eq: (column: string, value: any) =>
          this.delete(table, { [column]: value }),
      }),
    };
  }

  private async select(table: string, columns: string): Promise<any> {
    switch (table) {
      case 'profiles':
        return this.getProfiles();
      case 'properties':
        return this.getProperties();
      case 'leads':
        return this.getLeads();
      case 'appointments':
        return this.getAppointments();
      default:
        throw new Error(`Table ${table} not supported`);
    }
  }

  private async selectWithFilter(table: string, columns: string, filter: any): Promise<any> {
    const data = await this.select(table, columns);
    const [key, value] = Object.entries(filter)[0];
    return data.filter((item: any) => item[key] === value);
  }

  private async selectWithOrder(table: string, columns: string, orderBy: string, options?: { ascending?: boolean }): Promise<any> {
    const data = await this.select(table, columns);
    return data.sort((a: any, b: any) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (options?.ascending === false) {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  private async insert(table: string, data: any): Promise<any> {
    switch (table) {
      case 'profiles':
        return this.createProfile(data);
      case 'properties':
        return this.createProperty(data);
      case 'leads':
        return this.createLead(data);
      case 'appointments':
        return this.createAppointment(data);
      default:
        throw new Error(`Table ${table} not supported`);
    }
  }

  private async update(table: string, data: any, filter: any): Promise<any> {
    const [key, value] = Object.entries(filter)[0];
    switch (table) {
      case 'profiles':
        return this.updateProfile(value as string, data);
      case 'properties':
        return this.updateProperty(value as string, data);
      case 'leads':
        return this.updateLead(value as string, data);
      case 'appointments':
        return this.updateAppointment(value as string, data);
      default:
        throw new Error(`Table ${table} not supported`);
    }
  }

  private async delete(table: string, filter: any): Promise<any> {
    const [key, value] = Object.entries(filter)[0];
    switch (table) {
      case 'leads':
        return this.deleteLead(value as string);
      default:
        throw new Error(`Delete for table ${table} not supported`);
    }
  }
}

export const api = new APIClient();