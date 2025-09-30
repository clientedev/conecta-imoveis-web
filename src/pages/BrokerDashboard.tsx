import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddPropertyForm } from "@/components/AddPropertyForm";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Home,
  Calendar,
  MessageSquare,
  Plus,
  ArrowLeft
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_type?: string;
  location_interest?: string;
  price_range?: string;
  observations?: string;
  status: string;
  created_at: string;
  handled_by?: string;
  handled_at?: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  property_type?: string;
  is_available: boolean;
  featured: boolean;
  created_at: string;
}

const BrokerDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
    fetchProperties();
  }, []);

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
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads",
        variant: "destructive"
      });
    }
  };

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

  const handleLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          handled_by: user?.id,
          handled_at: new Date().toISOString(),
          status: 'em_atendimento'
        })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Atendimento iniciado com sucesso!",
      });

      fetchLeads();
    } catch (error) {
      console.error('Error handling lead:', error);
      toast({
        title: "Erro",
        description: "Erro ao iniciar atendimento",
        variant: "destructive"
      });
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });

      fetchLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  };

  const updateLeadObservations = async (leadId: string, observations: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ observations })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Observações atualizadas com sucesso!",
      });

      fetchLeads();
    } catch (error) {
      console.error('Error updating observations:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar observações",
        variant: "destructive"
      });
    }
  };

  const handleAddPropertySuccess = () => {
    setShowAddProperty(false);
    fetchProperties();
    toast({
      title: "Sucesso",
      description: "Imóvel adicionado com sucesso!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showAddProperty) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowAddProperty(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
          <AddPropertyForm
            onSuccess={handleAddPropertySuccess}
            onCancel={() => setShowAddProperty(false)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard do Corretor</h1>
          <p className="text-gray-600">Gerencie seus leads e imóveis</p>
        </div>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Meus Leads</TabsTrigger>
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            
            <div className="grid gap-6">
              {leads.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Nenhum lead encontrado</p>
                  </CardContent>
                </Card>
              ) : (
                leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {lead.name}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={
                              lead.status === 'novo' ? 'default' : 
                              lead.status === 'em_atendimento' ? 'secondary' :
                              lead.status === 'convertido' ? 'default' : 'outline'
                            }>
                              {lead.status === 'novo' ? 'Novo' :
                               lead.status === 'em_atendimento' ? 'Em Atendimento' :
                               lead.status === 'convertido' ? 'Convertido' :
                               lead.status === 'perdido' ? 'Perdido' : lead.status}
                            </Badge>
                            <Badge variant="outline">
                              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                            </Badge>
                          </div>
                        </div>
                        {!lead.handled_by && (
                          <Button onClick={() => handleLead(lead.id)}>
                            Iniciar Atendimento
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.location_interest && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{lead.location_interest}</span>
                          </div>
                        )}
                        {lead.price_range && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>{lead.price_range}</span>
                          </div>
                        )}
                        {lead.property_type && (
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-500" />
                            <span>{lead.property_type}</span>
                          </div>
                        )}
                      </div>
                      
                      {lead.handled_by && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Sendo atendido por: <span className="font-medium">Corretor</span>
                          </p>
                        </div>
                      )}

                      {lead.handled_by === user?.id && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Observações:</h4>
                          <Textarea
                            value={lead.observations || ''}
                            onChange={(e) => {
                              const updatedLeads = leads.map(l => 
                                l.id === lead.id ? { ...l, observations: e.target.value } : l
                              );
                              setLeads(updatedLeads);
                            }}
                            onBlur={() => updateLeadObservations(lead.id, lead.observations || '')}
                            placeholder="Adicione observações sobre este lead..."
                            className="min-h-[80px]"
                          />
                        </div>
                      )}

                      {lead.observations && lead.handled_by !== user?.id && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Observações:</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded">{lead.observations}</p>
                        </div>
                      )}

                      {lead.handled_by === user?.id && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadStatus(lead.id, 'convertido')}
                          >
                            Marcar como Convertido
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateLeadStatus(lead.id, 'perdido')}
                          >
                            Marcar como Perdido
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Imóveis</h2>
              <Button onClick={() => setShowAddProperty(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Imóvel
              </Button>
            </div>

            <div className="grid gap-6">
              {properties.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">Nenhum imóvel cadastrado</p>
                    <Button onClick={() => setShowAddProperty(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Imóvel
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                properties.map((property) => (
                  <Card key={property.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{property.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={property.is_available ? 'default' : 'secondary'}>
                              {property.is_available ? 'Disponível' : 'Indisponível'}
                            </Badge>
                            {property.featured && (
                              <Badge variant="outline">Destaque</Badge>
                            )}
                            <Badge variant="outline">
                              {new Date(property.created_at).toLocaleDateString('pt-BR')}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            R$ {property.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        {property.bedrooms && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{property.bedrooms} quartos</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{property.bathrooms} banheiros</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{property.area}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrokerDashboard;
