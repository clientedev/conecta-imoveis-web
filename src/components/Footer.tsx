
import { Button } from "@/components/ui/button";
import { Building, Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">MM Conecta</h2>
                <p className="text-gray-400 text-sm">Imóveis</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectamos você ao seu próximo lar ou investimento com excelência e confiança.
            </p>
            <div className="text-sm text-gray-400">
              <p>CNPJ: 14.389.179/8888</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="text-gray-400 hover:text-white transition-colors">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Compra de Imóveis</li>
              <li>Venda de Imóveis</li>
              <li>Locação</li>
              <li>Avaliação</li>
              <li>Consultoria</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Rua Marie Nader Calfat, 351</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">(11) 94000-5169</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">mmconectaimoveis@gmail.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Redes Sociais</h4>
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                  onClick={() => window.open('https://www.instagram.com/marciormariano?igsh=MXRza2NmeHVsZnp0Zw==', '_blank')}
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 MM Conecta Imóveis. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
