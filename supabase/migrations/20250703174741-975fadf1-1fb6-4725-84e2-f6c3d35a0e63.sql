
-- Criar função para promover usuário a admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Verificar se quem está chamando é admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Apenas administradores podem promover usuários para admin';
  END IF;
  
  UPDATE public.profiles 
  SET user_type = 'admin', is_admin = true, updated_at = now() 
  WHERE id = _user_id;
END;
$$;

-- Criar função para remover admin (rebaixar para client)
CREATE OR REPLACE FUNCTION public.demote_from_admin(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Verificar se quem está chamando é admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Apenas administradores podem remover privilégios de admin';
  END IF;
  
  -- Não permitir que o admin remova a si mesmo
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'Você não pode remover seus próprios privilégios de administrador';
  END IF;
  
  UPDATE public.profiles 
  SET user_type = 'client', is_admin = false, updated_at = now() 
  WHERE id = _user_id;
END;
$$;
