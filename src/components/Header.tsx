
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Building, Users, Phone, LogIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Imóveis", href: "/imoveis", icon: Building },
    { name: "Sobre", href: "/sobre", icon: Users },
    { name: "Contato", href: "/contato", icon: Phone },
  ];

  return (
    <header style={{ backgroundColor: '#f3f4f5' }} className="shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="MM Conecta Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1d2846' }}>MM Conecta</h1>
              <p className="text-xs" style={{ color: '#1d2846' }}>Imóveis</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 transition-colors duration-200 flex items-center space-x-1"
                style={{ color: '#1d2846' }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Login/Access Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Cliente
              </Link>
            </Button>
            <Button asChild style={{ backgroundColor: '#1d2846' }}>
              <Link to="/corretor/login">
                Corretor
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-700 transition-colors duration-200 p-2"
                    style={{ color: '#1d2846' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Área do Cliente
                    </Link>
                  </Button>
                  <Button className="w-full" asChild style={{ backgroundColor: '#1d2846' }}>
                    <Link to="/corretor/login">
                      Área do Corretor
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
