
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { FilterBar } from "@/components/FilterBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  image_url?: string;
  featured: boolean;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    location: "",
    priceRange: "",
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      console.log('Fetching properties...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }
      
      console.log('Properties fetched:', data?.length || 0);
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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedFilters.type || property.title.toLowerCase().includes(selectedFilters.type.toLowerCase());
    const matchesLocation = !selectedFilters.location || property.location.toLowerCase().includes(selectedFilters.location.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <Header />
      
      <HeroSection />
      
      {/* Seção de Busca e Filtros */}
      <section className="py-12" style={{ backgroundColor: '#f3f4f5' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#1d2846' }}>Encontre Seu Imóvel Ideal</h2>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por localização, tipo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button style={{ backgroundColor: '#1d2846' }} className="text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              
              <FilterBar filters={selectedFilters} onFilterChange={setSelectedFilters} />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Imóveis */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold" style={{ color: '#1d2846' }}>Imóveis Disponíveis</h2>
            <Badge variant="secondary">{filteredProperties.length} imóveis encontrados</Badge>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#1d2846' }}></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Sobre */}
      <AboutSection />

      {/* Formulário de Lead */}
      <section className="py-12" style={{ backgroundColor: '#f3f4f5' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
