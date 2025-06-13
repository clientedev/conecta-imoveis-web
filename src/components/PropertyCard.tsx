
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Bed, Bath, Ruler, MapPin, Calendar, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PropertyCarousel } from "./PropertyCarousel";
import { supabase } from "@/integrations/supabase/client";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
    image_url?: string;
    featured: boolean;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchPropertyImages();
  }, [property.id]);

  const fetchPropertyImages = async () => {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('image_url')
        .eq('property_id', property.id)
        .order('image_order');

      if (error) throw error;
      
      const imageUrls = data?.map(img => img.image_url) || [];
      
      // Se não tem imagens cadastradas, usar a image_url principal
      if (imageUrls.length === 0 && property.image_url) {
        setImages([property.image_url]);
      } else {
        setImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching property images:', error);
      // Fallback para image_url se houver erro
      if (property.image_url) {
        setImages([property.image_url]);
      }
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative">
        <PropertyCarousel 
          images={images}
          title={property.title}
          className="h-48"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {property.featured && (
            <Badge style={{ backgroundColor: '#949492', color: 'white' }}>
              Destaque
            </Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="text-white px-3 py-1 rounded-full text-lg font-bold" style={{ backgroundColor: '#1d2846' }}>
            R$ {property.price.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: '#1d2846' }}>{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>{property.area || '-'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/imovel/${property.id}`}>
            Ver Detalhes
          </Link>
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700" asChild>
          <Link to={`/agendar-visita/${property.id}`}>
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Visita
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
