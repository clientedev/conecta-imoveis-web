
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPHBhdGggZD0ibTM2IDM0djEwaDEwdi0xMHptMC0ydjEyaDEydi0xMnoiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                ✨ Corretora Especializada
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Encontre o
                <span className="block text-yellow-300">Imóvel Perfeito</span>
                para Você
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Na MM Conecta Imóveis, conectamos você ao seu próximo lar ou investimento. 
                Com mais de 10 anos de experiência no mercado imobiliário.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Home className="h-5 w-5 mr-2" />
                Ver Imóveis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800">
                <Link to="/contato" className="flex items-center">
                  Falar com Corretor
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-200 text-sm">Imóveis Vendidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-blue-200 text-sm">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-blue-200 text-sm">Anos Experiência</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop"
                alt="Imóvel moderno"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold">Apartamentos Modernos</h3>
                <p className="text-sm opacity-90">A partir de R$ 350.000</p>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-sm font-semibold">+15%</div>
              <div className="text-xs text-gray-600">Valorização</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-sm font-semibold">1000+</div>
              <div className="text-xs text-gray-600">Clientes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
