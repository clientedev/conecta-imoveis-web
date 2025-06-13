
-- Criar tabela para múltiplas imagens dos imóveis
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índice para melhor performance
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_order ON public.property_images(property_id, image_order);

-- Habilitar RLS
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para property_images (público para leitura)
CREATE POLICY "Anyone can view property images" 
  ON public.property_images 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert property images" 
  ON public.property_images 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update property images" 
  ON public.property_images 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete property images" 
  ON public.property_images 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Criar bucket para imagens dos imóveis
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Políticas para o bucket de imagens
CREATE POLICY "Anyone can view property images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update property images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete property images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
