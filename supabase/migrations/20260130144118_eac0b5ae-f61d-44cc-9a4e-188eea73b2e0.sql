-- Atualizar Hero da Home
UPDATE page_blocks 
SET conteudo = jsonb_set(conteudo, '{imagem_url}', '"local:hero-networking"')
WHERE id = '66e1d6a1-3989-47cf-89ac-bfde368313ad';

-- Atualizar "Fundado em Confiança e Credibilidade" 
UPDATE page_blocks 
SET conteudo = jsonb_set(conteudo, '{imagem_url}', '"local:confianca-credibilidade"')
WHERE id = '6b0d000f-3114-4f93-9bcf-54dc3725d78e';

-- Atualizar "Crescimento Através da Colaboração"
UPDATE page_blocks 
SET conteudo = jsonb_set(conteudo, '{imagem_url}', '"local:crescimento-colaboracao"')
WHERE id = '341d964c-da02-4d50-8e24-b48e8cef0da3';

-- Atualizar "A Força de Uma Comunidade Unida"
UPDATE page_blocks 
SET conteudo = jsonb_set(conteudo, '{imagem_url}', '"local:comunidade-unida"')
WHERE id = '20e8294c-3af9-4fac-a74d-eb97c0cfc13e';

-- Atualizar Hero da página Sobre
UPDATE page_blocks 
SET conteudo = jsonb_set(conteudo, '{imagem_url}', '"local:sobre-nce"')
WHERE id = 'a37c14af-4030-4acf-90d6-231e29c7637f';