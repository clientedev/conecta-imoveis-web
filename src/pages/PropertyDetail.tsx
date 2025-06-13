
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { PropertyCarousel } from '@/components/PropertyCarousel';
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
  const [images, setImages] = useState<string[]>([]);
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
      
      // Buscar imagens do imóvel
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', id)
        .order('image_order');

      if (imagesError) throw imagesError;
      
      const imageUrls = imagesData?.map(img => img.image_url) || [];
      
      // Se não tem imagens cadastradas, usar a image_url principal
      if (imageUrls.length === 0 && data.image_url) {
        setImages([data.image_url]);
      } else {
        setImages(imageUrls);
      }
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
      <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#1d2846' }}></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
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
          {/* Carrossel de Imagens */}
          <div className="relative">
            <PropertyCarousel 
              images={images}
              title={property.title}
              className="h-96 lg:h-[500px]"
            />
            {property.featured && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 text-black z-10">
                Destaque
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#1d2846' }}>{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}</span>
              </div>
              <div className="text-3xl font-bold mb-4" style={{ color: '#1d2846' }}>
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
                <h2 className="text-xl font-semibold mb-2" style={{ color: '#1d2846' }}>Descrição</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleScheduleVisit}
                className="w-full text-white"
                style={{ backgroundColor: '#1d2846' }}
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
            <CardTitle style={{ color: '#1d2846' }}>Informações do Imóvel</CardTitle>
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
