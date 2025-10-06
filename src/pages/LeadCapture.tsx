import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const LeadCapture = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    locationInterest: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.locationInterest) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: 'lead@contato.com',
          phone: formData.phone,
          locationInterest: formData.locationInterest,
          status: 'pending'
        }),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Seus dados foram enviados. Em breve entraremos em contato!'
        });
        
        setFormData({ name: '', phone: '', locationInterest: '' });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error('Erro ao enviar dados');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar seus dados. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Encontre seu Imóvel Ideal
            </h2>
            <p className="text-gray-600">
              Preencha o formulário e entraremos em contato
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Região de Interesse</Label>
              <Input
                id="location"
                type="text"
                value={formData.locationInterest}
                onChange={(e) => setFormData({ ...formData, locationInterest: e.target.value })}
                placeholder="Ex: Centro, Zona Sul, etc."
                className="mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#1d2846' }}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ao enviar, você aceita ser contatado por nossa equipe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCapture;
