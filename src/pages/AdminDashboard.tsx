import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Home, Users, Calendar, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  property_type?: string;
  image_url?: string;
  featured: boolean;
  is_available: boolean;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_type?: string;
  location_interest?: string;
  price_range?: string;
  observations?: string;
  created_at: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes?: string;
  profiles: {
    full_name: string;
    phone?: string;
  };
  properties: {
    title: string;
    location: string;
  };
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    featuredProperties: 0,
    totalLeads: 0,
    totalUsers: 0,
    totalAppointments: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    property_type: '',
    featured: false,
    is_available: true
  });

  useEffect(() => {
    fetchProperties();
    fetchUsers();
    fetchLeads();
    fetchAppointments();
    fetchStats();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os imóveis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          status,
          notes,
          profiles (
            full_name,
            phone
          ),
          properties (
            title,
            location
          )
        `)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [propertiesData, leadsData, usersData, appointmentsData] = await Promise.all([
        supabase.from('properties').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('appointments').select('*')
      ]);

      const properties = propertiesData.data || [];
      const leads = leadsData.data || [];
      const users = usersData.data || [];
      const appointments = appointmentsData.data || [];

      setStats({
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.is_available).length,
        featuredProperties: properties.filter(p => p.featured).length,
        totalLeads: leads.length,
        totalUsers: users.length,
        totalAppointments: appointments.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const promoteUser = async (userId: string, newType: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newType })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Usuário promovido para ${newType} com sucesso`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao promover usuário",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do usuário",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      property_type: '',
      featured: false,
      is_available: true
    });
    setPropertyImages([]);
    setEditingProperty(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        image_url: propertyImages[0] || null // Primeira imagem como principal
      };

      let result;
      if (editingProperty) {
        result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select();
      } else {
        result = await supabase
          .from('properties')
          .insert([propertyData])
          .select();
      }

      if (result.error) throw result.error;

      const propertyId = result.data?.[0]?.id;

      // Se temos imagens e um propertyId, salvar as imagens
      if (propertyId && propertyImages.length > 0) {
        // Primeiro, deletar imagens existentes se estamos editando
        if (editingProperty) {
          await supabase
            .from('property_images')
            .delete()
            .eq('property_id', propertyId);
        }

        // Inserir novas imagens
        const imageInserts = propertyImages.map((url, index) => ({
          property_id: propertyId,
          image_url: url,
          image_order: index
        }));

        await supabase
          .from('property_images')
          .insert(imageInserts);
      }

      toast({
        title: "Sucesso",
        description: editingProperty ? "Imóvel atualizado com sucesso" : "Imóvel criado com sucesso"
      });

      setDialogOpen(false);
      resetForm();
      fetchProperties();
      fetchStats();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar imóvel",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      location: property.location,
      price: property.price.toString(),
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      area: property.area || '',
      property_type: property.property_type || '',
      featured: property.featured,
      is_available: property.is_available
    });

    // Buscar imagens do imóvel
    try {
      const { data } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', property.id)
        .order('image_order');
      
      const images = data?.map(img => img.image_url) || [];
      if (images.length === 0 && property.image_url) {
        setPropertyImages([property.image_url]);
      } else {
        setPropertyImages(images);
      }
    } catch (error) {
      console.error('Error fetching property images:', error);
      setPropertyImages(property.image_url ? [property.image_url] : []);
    }

    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Imóvel excluído com sucesso"
      });

      fetchProperties();
      fetchStats();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir imóvel",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1d2846' }}>Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie imóveis, usuários, leads e configurações</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Imóveis</p>
                  <p className="text-2xl font-bold" style={{ color: '#1d2846' }}>{stats.totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Imóveis Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#949492' }}>
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Em Destaque</p>
                  <p className="text-2xl font-bold" style={{ color: '#949492' }}>{stats.featuredProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Leads</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Usuários</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agendamentos</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle style={{ color: '#1d2846' }}>Gerenciar Imóveis</CardTitle>
                    <CardDescription>Adicione, edite ou remova imóveis</CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={resetForm}
                        className="text-white"
                        style={{ backgroundColor: '#1d2846' }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Imóvel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
                        </DialogTitle>
                        <DialogDescription>
                          Preencha as informações do imóvel. Você pode adicionar até 10 imagens.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) => setFormData({...formData, title: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="location">Localização *</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="price">Preço *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="property_type">Tipo</Label>
                            <Select
                              value={formData.property_type}
                              onValueChange={(value) => setFormData({...formData, property_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="apartamento">Apartamento</SelectItem>
                                <SelectItem value="casa">Casa</SelectItem>
                                <SelectItem value="terreno">Terreno</SelectItem>
                                <SelectItem value="comercial">Comercial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bedrooms">Quartos</Label>
                            <Input
                              id="bedrooms"
                              type="number"
                              value={formData.bedrooms}
                              onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bathrooms">Banheiros</Label>
                            <Input
                              id="bathrooms"
                              type="number"
                              value={formData.bathrooms}
                              onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="area">Área</Label>
                            <Input
                              id="area"
                              placeholder="Ex: 120m²"
                              value={formData.area}
                              onChange={(e) => setFormData({...formData, area: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Status</Label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={formData.featured}
                                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                />
                                Destaque
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={formData.is_available}
                                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                                />
                                Disponível
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={4}
                          />
                        </div>

                        <MultiImageUpload
                          propertyId={editingProperty?.id}
                          onImagesChange={setPropertyImages}
                          existingImages={propertyImages}
                        />

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            className="text-white"
                            style={{ backgroundColor: '#1d2846' }}
                          >
                            {editingProperty ? 'Atualizar' : 'Criar'} Imóvel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#1d2846' }}></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <Card key={property.id} className="border border-gray-100">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <img
                              src={property.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=150&fit=crop"}
                              alt={property.title}
                              className="w-full md:w-32 h-24 object-cover rounded"
                            />
                            
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h4 className="font-semibold" style={{ color: '#1d2846' }}>{property.title}</h4>
                                <div className="flex gap-2">
                                  {property.featured && (
                                    <Badge style={{ backgroundColor: '#949492', color: 'white' }}>Destaque</Badge>
                                  )}
                                  <Badge variant={property.is_available ? "default" : "secondary"}>
                                    {property.is_available ? "Disponível" : "Indisponível"}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                              <p className="font-semibold text-lg" style={{ color: '#1d2846' }}>
                                R$ {property.price.toLocaleString('pt-BR')}
                              </p>
                              
                              <div className="flex justify-end gap-2 mt-4">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(property)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDelete(property.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#1d2846' }}>Gerenciar Usuários</CardTitle>
                <CardDescription>Promova usuários e gerencie acessos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold" style={{ color: '#1d2846' }}>
                              {user.full_name || user.email}
                            </h4>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant={user.user_type === 'admin' ? 'default' : user.user_type === 'broker' ? 'secondary' : 'outline'}>
                                {user.user_type === 'admin' ? 'Administrador' : 
                                 user.user_type === 'broker' ? 'Corretor' : 'Cliente'}
                              </Badge>
                              <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                {user.is_active ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {user.user_type === 'client' && (
                              <Button 
                                size="sm" 
                                onClick={() => promoteUser(user.id, 'broker')}
                                style={{ backgroundColor: '#1d2846' }}
                                className="text-white"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Promover a Corretor
                              </Button>
                            )}
                            
                            {user.user_type === 'broker' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => promoteUser(user.id, 'client')}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Remover Corretor
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant={user.is_active ? "destructive" : "default"}
                              onClick={() => toggleUserStatus(user.id, user.is_active)}
                            >
                              {user.is_active ? 'Desativar' : 'Ativar'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#1d2846' }}>Leads</CardTitle>
                <CardDescription>Leads capturados pelo site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <Card key={lead.id} className="border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold" style={{ color: '#1d2846' }}>{lead.name}</h4>
                            <p className="text-gray-600 text-sm">{lead.email} | {lead.phone}</p>
                          </div>
                          <Badge variant="secondary">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </Badge>
                        </div>
                        
                        {lead.property_type && (
                          <p className="text-sm"><strong>Tipo:</strong> {lead.property_type}</p>
                        )}
                        {lead.location_interest && (
                          <p className="text-sm"><strong>Localização:</strong> {lead.location_interest}</p>
                        )}
                        {lead.price_range && (
                          <p className="text-sm"><strong>Faixa de preço:</strong> {lead.price_range}</p>
                        )}
                        {lead.observations && (
                          <p className="text-sm"><strong>Observações:</strong> {lead.observations}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#1d2846' }}>Agendamentos</CardTitle>
                <CardDescription>Visitas agendadas pelos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold" style={{ color: '#1d2846' }}>
                              {appointment.properties.title}
                            </h4>
                            <p className="text-gray-600 text-sm">{appointment.properties.location}</p>
                            <p className="text-sm">
                              <strong>Cliente:</strong> {appointment.profiles.full_name}
                              {appointment.profiles.phone && ` - ${appointment.profiles.phone}`}
                            </p>
                          </div>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm">
                          <strong>Data:</strong> {new Date(appointment.appointment_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        
                        {appointment.notes && (
                          <p className="text-sm"><strong>Observações:</strong> {appointment.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
