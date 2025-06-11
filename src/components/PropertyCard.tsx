
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Bed, Bath, Ruler, MapPin, Calendar, Share2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    image: string;
    featured: boolean;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
              Destaque
            </Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
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
        <div className="absolute bottom-3 left-3">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-lg font-bold">
            {property.price}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>{property.area}</span>
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
          <Link to="/agendar-visita">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Visita
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
