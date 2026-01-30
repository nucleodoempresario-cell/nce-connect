-- Adicionar imagem ao Hero da página Seja Nucleado
UPDATE page_blocks 
SET conteudo = jsonb_set(conteudo, '{imagem_url}', '"local:seja-nucleado"')
WHERE id = '1941a813-3de1-45b4-a2c5-10b396152b92';