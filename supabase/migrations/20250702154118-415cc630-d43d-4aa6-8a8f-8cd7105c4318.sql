
-- Primeiro, vamos verificar e corrigir as políticas RLS para a tabela leads
-- Remover políticas conflitantes e criar novas políticas mais específicas

-- Remover políticas antigas que podem estar conflitando
DROP POLICY IF EXISTS "Admin can update leads" ON public.leads;
DROP POLICY IF EXISTS "Corretores and admin can view leads" ON public.leads;
DROP POLICY IF EXISTS "Corretores e admin podem ver leads" ON public.leads;

-- Criar políticas mais específicas e funcionais
CREATE POLICY "Brokers and admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('broker', 'admin')
  )
);

CREATE POLICY "Brokers and admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('broker', 'admin')
  )
);

CREATE POLICY "Brokers and admins can delete leads" 
ON public.leads 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('broker', 'admin')
  )
);

-- Garantir que o campo handled_by seja uma referência válida para profiles
ALTER TABLE public.leads 
DROP CONSTRAINT IF EXISTS leads_handled_by_fkey;

ALTER TABLE public.leads 
ADD CONSTRAINT leads_handled_by_fkey 
FOREIGN KEY (handled_by) 
REFERENCES public.profiles(id);
