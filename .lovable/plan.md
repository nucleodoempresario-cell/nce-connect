
# Sistema de Keep-Alive Multi-Camada

O projeto ja possui um sistema de heartbeat via `pg_cron` que funciona bem (ultimo ping hoje as 8h). Vamos adicionar camadas extras de seguranca para garantir que o Supabase nunca pause.

## O que sera feito

### Camada 1 - Edge Function `keep-alive`
Criar uma Edge Function que insere registros na tabela `system_heartbeat` existente (nao precisa criar `activity_logs` pois ja temos a tabela funcionando). A funcao aceita `source` no body para identificar a origem.

### Camada 2 - Hook `useKeepAlive`
Hook React que verifica via `localStorage` se ja fez heartbeat nas ultimas 24h. Se nao, chama a Edge Function com `source: "website_visit"`. Sera integrado no `App.tsx`.

### Camada 3 - GitHub Actions
Workflow com cron a cada 4 dias que chama a Edge Function via curl. Inclui `workflow_dispatch` para testes manuais e verificacao de status code.

---

## Detalhes tecnicos

### 1. Edge Function `supabase/functions/keep-alive/index.ts`
- Usa `SUPABASE_SERVICE_ROLE_KEY` para bypass de RLS
- Insere na tabela `system_heartbeat` existente (campos: `tipo`, `detalhes`)
- Aceita `source` no body (default: `"unknown"`)
- CORS habilitado
- `verify_jwt = false` no config.toml

### 2. Hook `src/hooks/useKeepAlive.ts`
- No `useEffect` ao montar, verifica `localStorage` key `lastKeepAlive`
- Se diferenca > 24h, chama `supabase.functions.invoke('keep-alive', { body: { source: 'website_visit' } })`
- Atualiza `localStorage` com timestamp atual
- Silencioso (sem feedback visual, apenas log no console)

### 3. Integracao no `App.tsx`
- Adicionar `useKeepAlive()` dentro do componente App

### 4. Arquivo `.github/workflows/keep-alive.yml`
- Cron: `0 6 */4 * *`
- `workflow_dispatch` para teste manual
- Curl para a Edge Function com anon key publica
- `source: "github_actions"`
- Verificacao do status code (falha se nao for 200)

### 5. Atualizar `supabase/config.toml`
- Adicionar `[functions.keep-alive]` com `verify_jwt = false`

### 6. Atualizar `HeartbeatWidget`
- Ajustar para considerar os novos sources no calculo de proximo heartbeat
