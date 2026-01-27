-- Create permissions enum
CREATE TYPE public.admin_permission AS ENUM (
  'users_view',
  'users_edit', 
  'users_approve',
  'users_delete',
  'companies_view',
  'companies_edit',
  'companies_approve',
  'companies_delete',
  'news_view',
  'news_edit',
  'news_delete',
  'applications_view',
  'applications_edit',
  'applications_delete',
  'forms_manage',
  'reports_view',
  'admins_manage'
);

-- Create admin_permissions table for granular access control
CREATE TABLE public.admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission admin_permission NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, permission)
);

-- Enable RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Only super admins (those with admins_manage permission or existing admins) can manage permissions
CREATE POLICY "Admins podem ver permissões"
  ON public.admin_permissions FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins com permissão podem inserir"
  ON public.admin_permissions FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins com permissão podem deletar"
  ON public.admin_permissions FOR DELETE
  USING (is_admin(auth.uid()));

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission admin_permission)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = _user_id AND permission = _permission
  )
  OR 
  -- Super admins (with admins_manage) have all permissions
  EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_id = _user_id AND permission = 'admins_manage'
  )
  OR
  -- Fallback: existing admins without granular permissions have full access
  (
    is_admin(_user_id) AND 
    NOT EXISTS (SELECT 1 FROM public.admin_permissions WHERE user_id = _user_id)
  )
$$;

-- Grant all permissions to existing admins (super admin)
INSERT INTO public.admin_permissions (user_id, permission)
SELECT ur.user_id, p.permission
FROM public.user_roles ur
CROSS JOIN (
  SELECT unnest(enum_range(NULL::admin_permission)) AS permission
) p
WHERE ur.role = 'admin'
ON CONFLICT (user_id, permission) DO NOTHING;