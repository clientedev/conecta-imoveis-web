
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
}

const ScheduleVisit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointment_date: '',
    notes: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchProperty();
  }, [id, user, navigate]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, location, price')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Erro",
        description: "Imóvel não encontrado",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          client_id: user?.id,
          property_id: id,
          appointment_date: formData.appointment_date,
          notes: formData.notes
        }]);

      if (error) throw error;

      toast({
        title: "Visita agendada com sucesso!",
        description: "Entraremos em contato para confirmar."
      });

      navigate('/cliente/dashboard');
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast({
        title: "Erro ao agendar visita",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/imovel/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Visita
              </CardTitle>
              <CardDescription>
                Agende sua visita para conhecer o imóvel pessoalmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Property Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-gray-600">{property.location}</p>
                <p className="text-blue-600 font-bold">
                  R$ {property.price.toLocaleString('pt-BR')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="appointment_date">Data e Hora da Visita *</Label>
                  <Input
                    id="appointment_date"
                    type="datetime-local"
                    value={formData.appointment_date}
                    onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                    min={minDate}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Selecione uma data a partir de amanhã
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Alguma observação especial para a visita?"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleVisit;
