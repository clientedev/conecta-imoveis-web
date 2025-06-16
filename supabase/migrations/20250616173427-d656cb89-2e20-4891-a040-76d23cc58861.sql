
-- Adicionar campo de status aos leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text DEFAULT 'novo';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS handled_by uuid REFERENCES public.profiles(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS handled_at timestamp with time zone;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_handled_by ON public.leads(handled_by);

-- Comentários para documentação
COMMENT ON COLUMN public.leads.status IS 'Status do lead: novo, em_atendimento, atendido';
COMMENT ON COLUMN public.leads.handled_by IS 'ID do corretor que está atendendo o lead';
COMMENT ON COLUMN public.leads.handled_at IS 'Data/hora quando o lead foi marcado como atendido';
