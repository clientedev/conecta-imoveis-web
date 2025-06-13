
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, User, Phone, Mail, Home, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes?: string;
  properties: {
    id: string;
    title: string;
    location: string;
    price: number;
    image_url?: string;
  };
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            price,
            image_url
          )
        `)
        .eq('client_id', user?.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      setAppointments(data || []);
      
      // Calcular estatísticas
      const total = data?.length || 0;
      const pending = data?.filter(apt => apt.status === 'pending').length || 0;
      const confirmed = data?.filter(apt => apt.status === 'confirmed').length || 0;
      
      setStats({
        totalAppointments: total,
        pendingAppointments: pending,
        confirmedAppointments: confirmed
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus agendamentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmado', variant: 'default' as const },
      completed: { label: 'Realizado', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge variant={statusInfo.variant} className={
        status === 'confirmed' ? 'bg-green-500' : 
        status === 'completed' ? 'bg-blue-500' : ''
      }>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1d2846' }}>
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1d2846' }}>
                  Bem-vindo, {user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600">Gerencie seus agendamentos e encontre o imóvel ideal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Visitas</p>
                  <p className="text-2xl font-bold" style={{ color: '#1d2846' }}>{stats.totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
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
                  <p className="text-sm text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmedAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white shadow-sm">
          <CardHeader>
            <CardTitle style={{ color: '#1d2846' }}>Ações Rápidas</CardTitle>
            <CardDescription>O que você gostaria de fazer hoje?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="h-16 text-white" style={{ backgroundColor: '#1d2846' }}>
                <Link to="/" className="flex flex-col items-center gap-2">
                  <Home className="h-6 w-6" />
                  <span>Explorar Imóveis</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16">
                <a 
                  href="https://wa.me/5511915137494?text=Olá! Gostaria de falar com um corretor." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <Phone className="h-6 w-6" />
                  <span>Falar com Corretor</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle style={{ color: '#1d2846' }}>Seus Agendamentos</CardTitle>
            <CardDescription>
              Visualize e acompanhe suas visitas agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#1d2846' }}></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum agendamento ainda</h3>
                <p className="text-gray-500 mb-4">Que tal explorar nossos imóveis e agendar uma visita?</p>
                <Button asChild style={{ backgroundColor: '#1d2846' }} className="text-white">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Ver Imóveis
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="border border-gray-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={appointment.properties.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop"}
                            alt={appointment.properties.title}
                            className="w-full md:w-24 h-32 md:h-24 object-cover rounded"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-semibold" style={{ color: '#1d2846' }}>
                                {appointment.properties.title}
                              </h4>
                              <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                {appointment.properties.location}
                              </div>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(appointment.appointment_date)}
                            </div>
                            <div className="font-semibold" style={{ color: '#1d2846' }}>
                              R$ {appointment.properties.price.toLocaleString('pt-BR')}
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
