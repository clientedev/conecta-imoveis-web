import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, LogOut, Mail, Phone, Building, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
}

interface User {
  id: string;
  full_name?: string;
  email?: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
}

interface AdminEmail {
  id: string;
  email: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({});
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile && !profile.is_admin && profile.user_type !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    fetchData();
  }, [user, profile, navigate]);

  const fetchData = async () => {
    try {
      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;
      setLeads(leadsData || []);

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, user_type, is_active, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch admin emails
      const { data: adminEmailsData, error: adminEmailsError } = await supabase
        .from('admin_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminEmailsError) throw adminEmailsError;
      setAdminEmails(adminEmailsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const saveProperty = async () => {
    try {
      // Validar campos obrigatórios
      if (!newProperty.title || !newProperty.location || !newProperty.price) {
        toast({
          title: "Erro",
          description: "Título, localização e preço são obrigatórios",
          variant: "destructive"
        });
        return;
      }

      // Criar objeto com campos obrigatórios preenchidos
      const propertyData = {
        title: newProperty.title,
        location: newProperty.location,
        price: newProperty.price,
        description: newProperty.description || null,
        bedrooms: newProperty.bedrooms || null,
        bathrooms: newProperty.bathrooms || null,
        area: newProperty.area || null,
        property_type: newProperty.property_type || null,
        image_url: newProperty.image_url || null,
        featured: newProperty.featured || false,
        is_available: newProperty.is_available !== false
      };

      if (editingProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
        toast({ title: "Imóvel atualizado com sucesso!" });
      } else {
        // Create new property
        const { error } = await supabase
          .from('properties')
          .insert(propertyData);

        if (error) throw error;
        toast({ title: "Imóvel criado com sucesso!" });
      }

      setNewProperty({});
      setEditingProperty(null);
      fetchData();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o imóvel",
        variant: "destructive"
      });
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Imóvel removido com sucesso!" });
      fetchData();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o imóvel",
        variant: "destructive"
      });
    }
  };

  const toggleUserType = async (userId: string, currentType: string) => {
    try {
      const newType = currentType === 'broker' ? 'client' : 'broker';
      
      const { error } = await supabase.rpc('promote_to_broker', {
        _user_id: userId
      });

      if (error) throw error;

      toast({ 
        title: newType === 'broker' ? "Usuário promovido a corretor!" : "Usuário removido de corretor!"
      });
      fetchData();
    } catch (error) {
      console.error('Error updating user type:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o tipo de usuário",
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
      toast({ title: !currentStatus ? "Usuário ativado!" : "Usuário desativado!" });
      fetchData();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do usuário",
        variant: "destructive"
      });
    }
  };

  const addAdminEmail = async () => {
    if (!newAdminEmail) return;

    try {
      const { error } = await supabase
        .from('admin_emails')
        .insert([{ email: newAdminEmail }]);

      if (error) throw error;
      toast({ title: "Email de administrador adicionado!" });
      setNewAdminEmail('');
      fetchData();
    } catch (error) {
      console.error('Error adding admin email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o email",
        variant: "destructive"
      });
    }
  };

  const removeAdminEmail = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Email de administrador removido!" });
      fetchData();
    } catch (error) {
      console.error('Error removing admin email:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o email",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f4f5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto" style={{ borderColor: '#1d2846' }}></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1d2846' }}>Painel Administrativo</h1>
              <p className="text-gray-600">Bem-vindo, {profile?.full_name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Voltar ao Site
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#1d2846' }}>{leads.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imóveis</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#1d2846' }}>{properties.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#1d2846' }}>{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Corretores</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#1d2846' }}>
                {users.filter(u => u.user_type === 'broker').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="admins">Administradores</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center" style={{ color: '#1d2846' }}>
                      <Building className="h-5 w-5 mr-2" />
                      Gerenciar Imóveis
                    </CardTitle>
                    <CardDescription>
                      Adicione, edite ou remova imóveis do site
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button style={{ backgroundColor: '#1d2846' }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Imóvel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                      <DialogHeader>
                        <DialogTitle style={{ color: '#1d2846' }}>
                          {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
                        </DialogTitle>
                        <DialogDescription>
                          Preencha os dados do imóvel
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título *</Label>
                          <Input
                            id="title"
                            value={newProperty.title || ''}
                            onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                            placeholder="Ex: Apartamento Moderno no Centro"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Localização *</Label>
                          <Input
                            id="location"
                            value={newProperty.location || ''}
                            onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                            placeholder="Ex: Centro, São Paulo"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="price">Preço (R$) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProperty.price || ''}
                            onChange={(e) => setNewProperty({...newProperty, price: Number(e.target.value)})}
                            placeholder="850000"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="property_type">Tipo</Label>
                          <Select 
                            value={newProperty.property_type || ''} 
                            onValueChange={(value) => setNewProperty({...newProperty, property_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartamento">Apartamento</SelectItem>
                              <SelectItem value="casa">Casa</SelectItem>
                              <SelectItem value="cobertura">Cobertura</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Quartos</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            value={newProperty.bedrooms || ''}
                            onChange={(e) => setNewProperty({...newProperty, bedrooms: Number(e.target.value)})}
                            placeholder="3"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Banheiros</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            value={newProperty.bathrooms || ''}
                            onChange={(e) => setNewProperty({...newProperty, bathrooms: Number(e.target.value)})}
                            placeholder="2"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="area">Área</Label>
                          <Input
                            id="area"
                            value={newProperty.area || ''}
                            onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                            placeholder="95m²"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="image_url">URL da Imagem</Label>
                          <Input
                            id="image_url"
                            value={newProperty.image_url || ''}
                            onChange={(e) => setNewProperty({...newProperty, image_url: e.target.value})}
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newProperty.description || ''}
                          onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                          placeholder="Descrição detalhada do imóvel..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newProperty.featured || false}
                            onChange={(e) => setNewProperty({...newProperty, featured: e.target.checked})}
                          />
                          <span>Imóvel em destaque</span>
                        </label>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newProperty.is_available !== false}
                            onChange={(e) => setNewProperty({...newProperty, is_available: e.target.checked})}
                          />
                          <span>Disponível</span>
                        </label>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setNewProperty({});
                          setEditingProperty(null);
                        }}>
                          Cancelar
                        </Button>
                        <Button 
                          onClick={saveProperty}
                          style={{ backgroundColor: '#1d2846' }}
                        >
                          {editingProperty ? 'Atualizar' : 'Criar'} Imóvel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: '#1d2846' }}>{property.title}</h3>
                          <p className="text-gray-600">{property.location}</p>
                          <p className="text-lg font-bold" style={{ color: '#1d2846' }}>
                            R$ {property.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {property.featured && <Badge style={{ backgroundColor: '#949492' }}>Destaque</Badge>}
                          <Badge variant={property.is_available ? "default" : "secondary"}>
                            {property.is_available ? 'Disponível' : 'Indisponível'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {property.bedrooms}q • {property.bathrooms}b • {property.area}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingProperty(property);
                              setNewProperty(property);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteProperty(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#1d2846' }}>
                  <Users className="h-5 w-5 mr-2" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription>
                  Promova usuários a corretores ou desative contas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold" style={{ color: '#1d2846' }}>{user.full_name || 'Sem nome'}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.user_type === 'broker' ? 'default' : 'secondary'}>
                            {user.user_type === 'broker' ? 'Corretor' : 'Cliente'}
                          </Badge>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserType(user.id, user.user_type)}
                          >
                            {user.user_type === 'broker' ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Remover Corretor
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Promover a Corretor
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant={user.is_active ? 'destructive' : 'default'}
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                          >
                            {user.is_active ? 'Desativar' : 'Ativar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#1d2846' }}>
                  <Mail className="h-5 w-5 mr-2" />
                  Leads Recebidos
                </CardTitle>
                <CardDescription>
                  Leads capturados através do formulário do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Nenhum lead encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg" style={{ color: '#1d2846' }}>{lead.name}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge variant="secondary" style={{ backgroundColor: '#949492', color: 'white' }}>
                            Novo Lead
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{lead.phone}</span>
                          </div>
                        </div>

                        {lead.property_type && (
                          <div className="mb-2">
                            <strong>Tipo de imóvel:</strong> {lead.property_type}
                          </div>
                        )}
                        
                        {lead.location_interest && (
                          <div className="mb-2">
                            <strong>Localização de interesse:</strong> {lead.location_interest}
                          </div>
                        )}
                        
                        {lead.price_range && (
                          <div className="mb-2">
                            <strong>Faixa de preço:</strong> {lead.price_range}
                          </div>
                        )}
                        
                        {lead.observations && (
                          <div className="mb-3">
                            <strong>Observações:</strong> {lead.observations}
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => window.open(`mailto:${lead.email}`)}>
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open(`tel:${lead.phone}`)}>
                            <Phone className="h-4 w-4 mr-1" />
                            Ligar
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank')}
                          >
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#1d2846' }}>
                  <UserCheck className="h-5 w-5 mr-2" />
                  Emails de Administradores
                </CardTitle>
                <CardDescription>
                  Gerencie quais emails têm acesso administrativo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="email@exemplo.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                  <Button onClick={addAdminEmail} style={{ backgroundColor: '#1d2846' }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {adminEmails.map((adminEmail) => (
                    <div key={adminEmail.id} className="flex justify-between items-center p-3 border rounded">
                      <span>{adminEmail.email}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeAdminEmail(adminEmail.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
