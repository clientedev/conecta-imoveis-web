
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bed, Bath, Ruler, MapPin, ArrowLeft } from 'lucide-react';
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
}

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
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
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para agendar uma visita",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    navigate(`/agendar-visita/${id}`);
  };

  if (loading) {
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

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <img
              src={property.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
              alt={property.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            {property.featured && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                Destaque
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                R$ {property.price.toLocaleString('pt-BR')}
              </div>
            </div>

            {/* Property Features */}
            <div className="flex gap-6">
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-500" />
                  <span>{property.bedrooms} quartos</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-500" />
                  <span>{property.bathrooms} banheiros</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-gray-500" />
                  <span>{property.area}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleScheduleVisit}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar Visita
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://wa.me/5511915137494?text=Olá! Gostaria de mais informações sobre este imóvel.', '_blank')}
              >
                Entrar em Contato via WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Informações do Imóvel</CardTitle>
            <CardDescription>
              Detalhes adicionais sobre este imóvel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.property_type && (
                <div>
                  <strong>Tipo:</strong> {property.property_type}
                </div>
              )}
              <div>
                <strong>Código:</strong> #{property.id.slice(0, 8)}
              </div>
              {property.bedrooms && (
                <div>
                  <strong>Quartos:</strong> {property.bedrooms}
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <strong>Banheiros:</strong> {property.bathrooms}
                </div>
              )}
              {property.area && (
                <div>
                  <strong>Área:</strong> {property.area}
                </div>
              )}
              <div>
                <strong>Localização:</strong> {property.location}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PropertyDetail;
