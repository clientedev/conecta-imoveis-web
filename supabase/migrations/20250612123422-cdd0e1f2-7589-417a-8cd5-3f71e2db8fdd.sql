
-- Adicionar coluna de administrador na tabela profiles
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Criar tabela para gerenciar quais emails podem ser administradores
CREATE TABLE public.admin_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir o email padrão do administrador
INSERT INTO public.admin_emails (email) VALUES ('admin@admin.com');

-- Atualizar trigger para verificar se o usuário é admin baseado no email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type, is_admin)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    CASE 
      WHEN EXISTS (SELECT 1 FROM public.admin_emails WHERE email = new.email) THEN 'admin'
      ELSE 'client'
    END,
    EXISTS (SELECT 1 FROM public.admin_emails WHERE email = new.email)
  );
  RETURN new;
END;
$$;

-- Adicionar políticas RLS para admin_emails (apenas admins podem ver/editar)
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage admin emails" 
  ON public.admin_emails 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Adicionar políticas RLS para properties (todos podem ver, apenas admins podem editar)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view available properties" 
  ON public.properties 
  FOR SELECT 
  USING (is_available = true OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Admins can manage properties" 
  ON public.properties 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Criar função para promover usuário a corretor
CREATE OR REPLACE FUNCTION public.promote_to_broker(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Verificar se quem está chamando é admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Apenas administradores podem promover usuários';
  END IF;
  
  UPDATE public.profiles 
  SET user_type = 'broker', updated_at = now() 
  WHERE id = _user_id;
END;
$$;
