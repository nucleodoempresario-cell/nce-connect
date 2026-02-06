-- Inserir heartbeat manual para inicializar o sistema
SELECT public.insert_heartbeat();

-- Verificar se o cron job existe e recriá-lo se necessário
SELECT cron.schedule(
  'supabase-heartbeat',
  '0 8 */3 * *',
  'SELECT public.insert_heartbeat()'
);