-- 1. Add auto_aprovacao field to companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS auto_aprovacao boolean DEFAULT false;

-- 2. Create audit_log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela text NOT NULL,
  registro_id uuid NOT NULL,
  usuario_id uuid,
  acao text NOT NULL,
  dados_anteriores jsonb,
  dados_novos jsonb,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 4. Create policy for admins to view audit_log
CREATE POLICY "Admins podem ver audit_log"
  ON public.audit_log FOR SELECT
  USING (is_admin(auth.uid()));

-- 5. Create trigger function to log changes
CREATE OR REPLACE FUNCTION public.log_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (tabela, registro_id, usuario_id, acao, dados_anteriores)
    VALUES (TG_TABLE_NAME, OLD.id, auth.uid(), TG_OP, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (tabela, registro_id, usuario_id, acao, dados_anteriores, dados_novos)
    VALUES (TG_TABLE_NAME, NEW.id, auth.uid(), TG_OP, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (tabela, registro_id, usuario_id, acao, dados_novos)
    VALUES (TG_TABLE_NAME, NEW.id, auth.uid(), TG_OP, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- 6. Create triggers for profiles table
DROP TRIGGER IF EXISTS audit_profiles ON public.profiles;
CREATE TRIGGER audit_profiles 
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_changes();

-- 7. Create triggers for companies table
DROP TRIGGER IF EXISTS audit_companies ON public.companies;
CREATE TRIGGER audit_companies 
  AFTER INSERT OR UPDATE OR DELETE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.log_changes();