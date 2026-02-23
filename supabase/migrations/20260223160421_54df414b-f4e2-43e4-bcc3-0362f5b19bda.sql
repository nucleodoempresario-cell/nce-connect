CREATE POLICY "Authenticated users can create applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (
  nome_candidato IS NOT NULL 
  AND nome_candidato <> '' 
  AND email IS NOT NULL 
  AND email <> '' 
  AND status = 'novo'
);