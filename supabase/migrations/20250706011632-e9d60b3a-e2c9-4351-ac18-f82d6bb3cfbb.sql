
-- Permitir que corretores possam inserir propriedades
CREATE POLICY "Brokers can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type = 'broker' OR user_type = 'admin' OR is_admin = true)
  )
);

-- Permitir que corretores possam atualizar propriedades
CREATE POLICY "Brokers can update properties" 
ON public.properties 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type = 'broker' OR user_type = 'admin' OR is_admin = true)
  )
);

-- Permitir que corretores possam deletar propriedades
CREATE POLICY "Brokers can delete properties" 
ON public.properties 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type = 'broker' OR user_type = 'admin' OR is_admin = true)
  )
);
