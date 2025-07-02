import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, LogOut, Mail, Phone, Building, Trash2, Download, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
  status?: string;
  handled_by?: string;
  handled_at?: string;
  profiles?: {
    full_name: string;
  } | null;
}

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes?: string;
  profiles: {
    full_name: string;
    phone?: string;
  } | null;
  properties: {
    title: string;
    location: string;
  } | null;
}

const BrokerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('BrokerDashboard - User:', user?.email);
    console.log('BrokerDashboard - Profile:', profile);
    console.log('BrokerDashboard - User Type:', profile?.user_type);

    if (!user) {
      navigate('/corretor/login');
      return;
    }

    // Allow both 'broker' and 'admin' user types to access broker dashboard
    if (profile && profile.user_type !== 'broker' && profile.user_type !== 'admin') {
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
    console.log('Fetching leads and appointments data...');
    try {
      // Fetch leads with handler information
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          profiles!leads_handled_by_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error('Error fetching leads:', leadsError);
        throw leadsError;
      }
      
      console.log('Leads fetched:', leadsData?.length || 0);
      console.log('Raw leads data:', leadsData);

      setLeads(leadsData || []);

      // Fetch appointments with proper error handling
      const { data: appointmentsData, error: appointmentsError } = await supabase
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

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }
      
      console.log('Appointments data:', appointmentsData);
      setAppointments(appointmentsData || []);
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

  const updateLeadStatus = async (leadId: string, status: string) => {
    console.log(`Updating lead ${leadId} status to:`, status);
    console.log('Current user ID:', user?.id);
    console.log('Current profile:', profile);
    
    try {
      const updateData: any = { 
        status,
        handled_by: status === 'novo' ? null : user?.id,
        handled_at: status === 'atendido' ? new Date().toISOString() : (status === 'em_atendimento' ? new Date().toISOString() : null)
      };

      console.log('Update data:', updateData);

      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select(`
          *,
          profiles!leads_handled_by_fkey (
            full_name
          )
        `);

      if (error) {
        console.error('Error updating lead status:', error);
        throw error;
      }

      console.log('Lead status updated successfully:', data);

      toast({
        title: "Sucesso",
        description: "Status do lead atualizado com sucesso"
      });

      // Force immediate refresh to get updated data with profile info
      await fetchData();
      
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      toast({
        title: "Erro",
        description: `Erro ao atualizar status do lead: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    console.log('Deleting lead:', leadId);

    try {
      const { data, error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)
        .select();

      if (error) {
        console.error('Error deleting lead:', error);
        throw error;
      }

      console.log('Lead deleted successfully:', data);

      toast({
        title: "Sucesso",
        description: "Lead excluído com sucesso"
      });

      // Force immediate refresh
      await fetchData();
      
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Erro",
        description: `Erro ao excluir lead: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    console.log(`Updating appointment ${appointmentId} status to:`, status);
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment status:', error);
        throw error;
      }

      console.log('Appointment status updated successfully');

      toast({
        title: "Sucesso",
        description: "Status do agendamento atualizado com sucesso"
      });

      // Force immediate refresh
      await fetchData();
      
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do agendamento",
        variant: "destructive"
      });
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    console.log('Deleting appointment:', appointmentId);

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }

      console.log('Appointment deleted successfully');

      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso"
      });

      // Force immediate refresh
      await fetchData();
      
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir agendamento",
        variant: "destructive"
      });
    }
  };

  const generateLeadsPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text('Relatório de Leads', 20, 20);
      
      // Data de geração
      doc.setFontSize(12);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      let yPosition = 50;
      
      leads.forEach((lead, index) => {
        // Verificar se precisa de nova página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Informações do lead
        doc.setFontSize(14);
        doc.text(`${index + 1}. ${lead.name}`, 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.text(`Email: ${lead.email}`, 25, yPosition);
        yPosition += 6;
        
        doc.text(`Telefone: ${lead.phone}`, 25, yPosition);
        yPosition += 6;
        
        if (lead.property_type) {
          doc.text(`Tipo de imóvel: ${lead.property_type}`, 25, yPosition);
          yPosition += 6;
        }
        
        if (lead.location_interest) {
          doc.text(`Localização de interesse: ${lead.location_interest}`, 25, yPosition);
          yPosition += 6;
        }
        
        if (lead.price_range) {
          doc.text(`Faixa de preço: ${lead.price_range}`, 25, yPosition);
          yPosition += 6;
        }
        
        const status = lead.status || 'novo';
        doc.text(`Status: ${status}`, 25, yPosition);
        yPosition += 6;
        
        if (lead.profiles?.full_name) {
          doc.text(`Atendido por: ${lead.profiles.full_name}`, 25, yPosition);
          yPosition += 6;
        }
        
        if (lead.handled_at) {
          doc.text(`Data de atendimento: ${new Date(lead.handled_at).toLocaleDateString('pt-BR')}`, 25, yPosition);
          yPosition += 6;
        }
        
        doc.text(`Criado em: ${new Date(lead.created_at).toLocaleDateString('pt-BR')}`, 25, yPosition);
        yPosition += 6;
        
        if (lead.observations) {
          doc.text(`Observações: ${lead.observations}`, 25, yPosition);
          yPosition += 6;
        }
        
        yPosition += 10; // Espaço entre leads
      });
      
      // Salvar o PDF
      doc.save(`leads-relatorio-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Sucesso",
        description: "Relatório PDF gerado com sucesso"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório PDF",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500';
      case 'em_atendimento': return 'bg-yellow-500';
      case 'atendido': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLeadStatusText = (status: string) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'em_atendimento': return 'Em Atendimento';
      case 'atendido': return 'Atendido';
      default: return 'Novo';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel do Corretor</h1>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'confirmed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Leads Recebidos
                    </CardTitle>
                    <CardDescription>
                      Leads capturados através do site
                    </CardDescription>
                  </div>
                  <Button onClick={generateLeadsPDF} className="bg-red-600 hover:bg-red-700">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Nenhum lead encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{lead.name}</h3>
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
                          <div className="flex items-center gap-2">
                            <Badge className={getLeadStatusColor(lead.status || 'novo')}>
                              {getLeadStatusText(lead.status || 'novo')}
                            </Badge>
                          </div>
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

                        {/* Status do atendimento */}
                        {lead.status === 'em_atendimento' && lead.profiles?.full_name && (
                          <div className="mb-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                            <strong>Sendo atendido por:</strong> {lead.profiles.full_name}
                            {lead.handled_at && (
                              <span className="text-sm text-gray-600 ml-2">
                                desde {new Date(lead.handled_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                        )}

                        {lead.status === 'atendido' && lead.profiles?.full_name && (
                          <div className="mb-3 p-2 bg-green-50 rounded border-l-4 border-green-400">
                            <strong>Atendido por:</strong> {lead.profiles.full_name}
                            {lead.handled_at && (
                              <span className="text-sm text-gray-600 ml-2">
                                em {new Date(lead.handled_at).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4 flex-wrap">
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
                          
                          {/* Status Management Buttons */}
                          {lead.status !== 'em_atendimento' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-yellow-50 hover:bg-yellow-100"
                              onClick={() => updateLeadStatus(lead.id, 'em_atendimento')}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Iniciar Atendimento
                            </Button>
                          )}
                          
                          {lead.status === 'em_atendimento' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-green-50 hover:bg-green-100"
                              onClick={() => updateLeadStatus(lead.id, 'atendido')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Finalizar Atendimento
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendamentos de Visitas
                </CardTitle>
                <CardDescription>
                  Visitas agendadas pelos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Nenhum agendamento encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">
                              {appointment.properties?.title || 'Propriedade não encontrada'}
                            </h3>
                            <p className="text-gray-600">
                              {appointment.properties?.location || 'Localização não disponível'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Cliente: {appointment.profiles?.full_name || 'Nome não disponível'}
                              {appointment.profiles?.phone && ` - ${appointment.profiles.phone}`}
                            </p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <strong>Data e hora:</strong> {' '}
                          {new Date(appointment.appointment_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        
                        {appointment.notes && (
                          <div className="mb-3">
                            <strong>Observações:</strong> {appointment.notes}
                          </div>
                        )}
                        
                        <div className="flex gap-2 flex-wrap">
                          {appointment.profiles?.phone && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => window.open(`tel:${appointment.profiles.phone}`)}>
                                <Phone className="h-4 w-4 mr-1" />
                                Ligar
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => window.open(`https://wa.me/55${appointment.profiles.phone?.replace(/\D/g, '')}`, '_blank')}
                              >
                                WhatsApp
                              </Button>
                            </>
                          )}
                          
                          {/* Status Management Buttons */}
                          {appointment.status !== 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-100"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marcar Realizada
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteAppointment(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BrokerDashboard;
