-- Tabela para registrar heartbeats do sistema
CREATE TABLE public.system_heartbeat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  tipo text NOT NULL DEFAULT 'keep_alive',
  detalhes jsonb DEFAULT '{}'::jsonb
);

-- Permitir leitura pública (para o dashboard)
ALTER TABLE public.system_heartbeat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Heartbeats são públicos para leitura" 
ON public.system_heartbeat 
FOR SELECT 
USING (true);

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Função para inserir heartbeat
CREATE OR REPLACE FUNCTION public.insert_heartbeat()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir novo heartbeat
  INSERT INTO public.system_heartbeat (tipo, detalhes) 
  VALUES ('keep_alive', jsonb_build_object('timestamp', now(), 'source', 'pg_cron'));
  
  -- Manter apenas os últimos 30 registros para não acumular dados
  DELETE FROM public.system_heartbeat 
  WHERE id NOT IN (
    SELECT id FROM public.system_heartbeat 
    ORDER BY created_at DESC 
    LIMIT 30
  );
END;
$$;