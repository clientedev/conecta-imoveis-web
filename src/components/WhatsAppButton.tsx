
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const WhatsAppButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const whatsappNumber = "5511915137494"; // WhatsApp atendimento: (11) 91513-7494
  const message = encodeURIComponent("Olá! Gostaria de mais informações sobre os imóveis disponíveis.");

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleContactPageClick = () => {
    navigate('/contato');
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showOptions && (
        <div className="mb-2 space-y-2">
          <Button
            onClick={handleContactPageClick}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          <Button
            onClick={handleWhatsAppClick}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 block"
            size="icon"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      <Button
        onClick={toggleOptions}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <Phone className="h-6 w-6" />
      </Button>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 pointer-events-none"></div>
    </div>
  );
};
