-- Criar bucket para imagens do site
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público para leitura
CREATE POLICY "Public can view site images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-images');

-- Políticas de upload/edição para admins
CREATE POLICY "Admins can upload site images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'site-images' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update site images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'site-images' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete site images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'site-images' 
  AND public.is_admin(auth.uid())
);