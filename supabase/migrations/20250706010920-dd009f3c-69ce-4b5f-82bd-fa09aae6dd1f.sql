
-- Remover as políticas antigas de leads que permitem que todos os brokers vejam todos os leads
DROP POLICY IF EXISTS "Brokers and admins can view all leads" ON public.leads;

-- Criar nova política que permite:
-- 1. Admins verem todos os leads
-- 2. Brokers verem apenas os leads que estão atendendo (handled_by = seu ID)
-- 3. Brokers verem leads que ainda não foram atribuídos a ninguém (handled_by IS NULL)
CREATE POLICY "Brokers see assigned leads and admins see all" 
ON public.leads 
FOR SELECT 
USING (
  -- Admins podem ver todos os leads
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (user_type = 'admin' OR is_admin = true)
  )
  OR
  -- Brokers podem ver apenas leads não atribuídos ou que eles estão atendendo
  (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_type = 'broker'
    )
    AND (handled_by IS NULL OR handled_by = auth.uid())
  )
);

-- Manter as outras políticas de UPDATE e DELETE como estavam
-- Elas já permitem apenas brokers e admins modificarem leads
