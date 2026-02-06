-- Allow admins to update any profile (needed for approve/reject/activate/deactivate)
CREATE POLICY "Admins podem editar qualquer perfil"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));