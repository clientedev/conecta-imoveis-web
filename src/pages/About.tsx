
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Home, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#1d2846' }}>
            Sobre a M&M Conecta Imóveis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Há mais de uma década conectando pessoas aos seus sonhos imobiliários. 
            Somos especialistas em encontrar o imóvel perfeito para cada necessidade.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Home className="h-12 w-12 mx-auto mb-4" style={{ color: '#1d2846' }} />
              <div className="text-3xl font-bold mb-2" style={{ color: '#1d2846' }}>500+</div>
              <div className="text-gray-600">Imóveis Vendidos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#1d2846' }} />
              <div className="text-3xl font-bold mb-2" style={{ color: '#1d2846' }}>1000+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 mx-auto mb-4" style={{ color: '#1d2846' }} />
              <div className="text-3xl font-bold mb-2" style={{ color: '#1d2846' }}>98%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 mx-auto mb-4" style={{ color: '#1d2846' }} />
              <div className="text-3xl font-bold mb-2" style={{ color: '#1d2846' }}>10+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </CardContent>
          </Card>
        </section>

        {/* About Content */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#1d2846' }}>Nossa História</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                A M&M Conecta Imóveis nasceu da paixão por conectar pessoas aos seus lares dos sonhos. 
                Fundada há mais de 10 anos, nossa empresa se estabeleceu como referência no mercado 
                imobiliário da região.
              </p>
              <p>
                Com uma equipe experiente e dedicada, oferecemos um atendimento personalizado e 
                humanizado, entendendo que cada cliente tem necessidades únicas e especiais.
              </p>
              <p>
                Nossa missão é tornar o processo de compra, venda ou locação de imóveis uma 
                experiência tranquila e satisfatória para todos os nossos clientes.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
              alt="Equipe M&M Conecta"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#1d2846' }}>Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#949492' }}>
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1d2846' }}>Transparência</h3>
              <p className="text-gray-600">
                Acreditamos na honestidade e clareza em todas as nossas negociações, 
                garantindo confiança mútua.
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#949492' }}>
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1d2846' }}>Excelência</h3>
              <p className="text-gray-600">
                Buscamos sempre a excelência no atendimento e nos resultados que 
                entregamos aos nossos clientes.
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#949492' }}>
                <Home className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1d2846' }}>Compromisso</h3>
              <p className="text-gray-600">
                Estamos comprometidos em encontrar a solução ideal para cada cliente, 
                superando expectativas.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
