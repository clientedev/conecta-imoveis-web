
import { LeadForm } from '@/components/LeadForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LeadsPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f3f4f5' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1d2846' }}>
              Encontre o Imóvel Perfeito
            </h1>
            <p className="text-xl text-gray-600">
              Preencha o formulário abaixo e nossa equipe entrará em contato com as melhores opções para você.
            </p>
          </div>
          
          <LeadForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LeadsPage;
