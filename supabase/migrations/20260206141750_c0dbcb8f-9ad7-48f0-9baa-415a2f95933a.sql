
-- Allow admins to delete profiles
CREATE POLICY "Admins podem deletar perfis"
ON public.profiles
FOR DELETE
USING (is_admin(auth.uid()));
