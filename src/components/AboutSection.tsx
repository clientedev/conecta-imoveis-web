
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Home, TrendingUp, Shield, Clock } from "lucide-react";

export const AboutSection = () => {
  const values = [
    {
      icon: Shield,
      title: "Confiança",
      description: "Transparência em todas as negociações"
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Atendimento de qualidade superior"
    },
    {
      icon: Users,
      title: "Relacionamento",
      description: "Parceria duradoura com nossos clientes"
    },
    {
      icon: Clock,
      title: "Agilidade",
      description: "Processos rápidos e eficientes"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Sobre Nós</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            MM Conecta Imóveis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Há mais de 10 anos no mercado imobiliário, conectamos pessoas aos seus sonhos 
            com profissionalismo, dedicação e resultados excepcionais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Facilitar a realização do sonho da casa própria e dos melhores investimentos 
                imobiliários, oferecendo atendimento personalizado e soluções inovadoras.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser a corretora de imóveis mais confiável e reconhecida da região, 
                referência em qualidade de serviço e satisfação do cliente.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-gray-600 text-sm">Imóveis Vendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-gray-600 text-sm">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop"
              alt="Equipe MM Conecta"
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute inset-0 bg-blue-600/20 rounded-lg"></div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Nossos Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
