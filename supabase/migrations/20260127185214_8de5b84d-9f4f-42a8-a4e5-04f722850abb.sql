-- Add visibility settings and products/services columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS campos_visiveis jsonb DEFAULT '{"bio": true, "telefone": true, "email": true, "cargo": true, "website": true, "redes_sociais": true}'::jsonb;

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS produtos_servicos text,
ADD COLUMN IF NOT EXISTS campos_visiveis jsonb DEFAULT '{"descricao_curta": true, "descricao_completa": true, "produtos_servicos": true, "telefone": true, "email": true, "endereco": true, "site_url": true, "redes_sociais": true, "segmento": true, "ano_fundacao": true, "numero_funcionarios": true}'::jsonb;