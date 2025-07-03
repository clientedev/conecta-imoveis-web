
-- Corrigir as políticas RLS para a tabela leads
-- Permitir que usuários com is_admin = true também possam acessar

-- Remover políticas existentes
DROP POLICY IF EXISTS "Brokers and admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Brokers and admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Brokers and admins can delete leads" ON public.leads;

-- Criar políticas atualizadas que incluem is_admin = true
CREATE POLICY "Brokers and admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type IN ('broker', 'admin') OR is_admin = true)
  )
);

CREATE POLICY "Brokers and admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type IN ('broker', 'admin') OR is_admin = true)
  )
);

CREATE POLICY "Brokers and admins can delete leads" 
ON public.leads 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type IN ('broker', 'admin') OR is_admin = true)
  )
);
