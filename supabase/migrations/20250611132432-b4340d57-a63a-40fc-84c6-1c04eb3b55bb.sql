
-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('client', 'broker', 'admin')) DEFAULT 'client',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Criar tabela de imóveis
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area TEXT,
  property_type TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_type TEXT,
  location_interest TEXT,
  price_range TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id),
  property_id UUID REFERENCES public.properties(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Políticas para properties (público para leitura)
CREATE POLICY "Qualquer um pode ver imóveis disponíveis" 
  ON public.properties FOR SELECT 
  USING (is_available = true);

-- Políticas para leads (apenas corretores e admin podem ver)
CREATE POLICY "Corretores e admin podem ver leads" 
  ON public.leads FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('broker', 'admin')
    )
  );

-- Políticas para appointments
CREATE POLICY "Clientes podem ver seus agendamentos" 
  ON public.appointments FOR SELECT 
  USING (client_id = auth.uid());

CREATE POLICY "Clientes podem criar agendamentos" 
  ON public.appointments FOR INSERT 
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Corretores e admin podem ver todos agendamentos" 
  ON public.appointments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('broker', 'admin')
    )
  );

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'client'
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir alguns imóveis de exemplo
INSERT INTO public.properties (title, description, location, price, bedrooms, bathrooms, area, property_type, image_url, featured) VALUES
('Apartamento Moderno no Centro', 'Lindo apartamento com acabamento de primeira qualidade, localizado no centro da cidade com fácil acesso ao transporte público.', 'Centro, São Paulo', 850000, 3, 2, '95m²', 'apartamento', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop', true),
('Casa Térrea com Quintal', 'Casa espaçosa com quintal amplo, ideal para famílias. Localizada em bairro residencial tranquilo.', 'Vila Madalena, São Paulo', 1200000, 4, 3, '180m²', 'casa', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=300&fit=crop', false),
('Cobertura com Vista Panorâmica', 'Cobertura duplex com vista deslumbrante da cidade. Acabamento de luxo e área de lazer completa.', 'Moema, São Paulo', 2100000, 4, 4, '250m²', 'cobertura', 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=500&h=300&fit=crop', true);
