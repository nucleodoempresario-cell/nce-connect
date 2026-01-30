-- Adicionar blocos para as páginas de listagem

-- Página Empresas
INSERT INTO page_blocks (pagina, tipo_bloco, ordem, conteudo, visivel) VALUES
('empresas', 'hero', 1, '{
  "badge": "Empresas Parceiras",
  "titulo": "Empresas do Núcleo",
  "subtitulo": "Conheça as empresas que fazem parte da nossa comunidade de empresários de alto nível."
}'::jsonb, true);

-- Página Membros  
INSERT INTO page_blocks (pagina, tipo_bloco, ordem, conteudo, visivel) VALUES
('membros', 'hero', 1, '{
  "badge": "Nossa Comunidade",
  "titulo": "Nossos Nucleados",
  "subtitulo": "Conheça os empresários de alto nível que fazem parte do NCE. Líderes comprometidos com a excelência e o crescimento mútuo."
}'::jsonb, true);

-- Página Notícias
INSERT INTO page_blocks (pagina, tipo_bloco, ordem, conteudo, visivel) VALUES
('noticias', 'hero', 1, '{
  "badge": "Fique Atualizado",
  "titulo": "Notícias e Novidades",
  "subtitulo": "Acompanhe as últimas notícias, eventos e acontecimentos do Núcleo do Empresário."
}'::jsonb, true);

-- Configurações Globais (Footer)
INSERT INTO page_blocks (pagina, tipo_bloco, ordem, conteudo, visivel) VALUES
('global', 'configuracoes', 1, '{
  "footer_descricao": "Uma comunidade exclusiva de empresários de alto nível, unidos pelo compromisso com a excelência e o crescimento mútuo. Networking estratégico que gera resultados reais.",
  "footer_instagram": "https://instagram.com",
  "nome_site": "NCE - Núcleo do Empresário",
  "slogan": "Conectando Empresários para o Sucesso"
}'::jsonb, true);