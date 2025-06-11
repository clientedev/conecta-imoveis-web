
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Filter, Search, Heart } from "lucide-react";
import { useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { FilterBar } from "@/components/FilterBar";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    location: "",
    priceRange: "",
  });

  // Mock data para demonstração
  const properties = [
    {
      id: 1,
      title: "Apartamento Moderno no Centro",
      location: "Centro, São Paulo",
      price: "R$ 850.000",
      bedrooms: 3,
      bathrooms: 2,
      area: "95m²",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Casa Térrea com Quintal",
      location: "Vila Madalena, São Paulo",
      price: "R$ 1.200.000",
      bedrooms: 4,
      bathrooms: 3,
      area: "180m²",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=300&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Cobertura com Vista Panorâmica",
      location: "Moema, São Paulo",
      price: "R$ 2.100.000",
      bedrooms: 4,
      bathrooms: 4,
      area: "250m²",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=500&h=300&fit=crop",
      featured: true
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedFilters.type || property.title.toLowerCase().includes(selectedFilters.type.toLowerCase());
    const matchesLocation = !selectedFilters.location || property.location.toLowerCase().includes(selectedFilters.location.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSection />
      
      {/* Seção de Busca e Filtros */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Encontre Seu Imóvel Ideal</h2>
            
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
                <Button className="bg-blue-600 hover:bg-blue-700">
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
            <h2 className="text-3xl font-bold">Imóveis Disponíveis</h2>
            <Badge variant="secondary">{filteredProperties.length} imóveis encontrados</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <AboutSection />

      {/* Formulário de Lead */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Encontre o Imóvel dos Seus Sonhos</h2>
            <p className="text-gray-600 mb-8">
              Preencha o formulário e nossa equipe entrará em contato com as melhores opções para você.
            </p>
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
