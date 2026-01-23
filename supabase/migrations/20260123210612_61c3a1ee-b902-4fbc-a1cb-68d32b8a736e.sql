-- Inserir perguntas do formulário de candidatura
INSERT INTO form_questions (texto_pergunta, tipo, ordem, obrigatoria, ativo, opcoes) VALUES
('Qual é o segmento de atuação da sua empresa?', 'texto_curto', 1, true, true, '[]'),
('Há quanto tempo você está no mercado?', 'multipla_escolha', 2, true, true, '["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "5 a 10 anos", "Mais de 10 anos"]'),
('Por que você deseja fazer parte do NCE?', 'texto_longo', 3, true, true, '[]'),
('Você está disposto a participar ativamente dos encontros mensais?', 'checkbox', 4, true, true, '[]'),
('Como você ficou sabendo do NCE?', 'multipla_escolha', 5, false, true, '["Indicação de membro", "Redes sociais", "Google", "Evento", "Outro"]')
ON CONFLICT DO NOTHING;

-- Inserir/atualizar conteúdo institucional
INSERT INTO site_content (tipo, conteudo) VALUES
('institucional', '{
  "missao": "Conectar lideranças empresariais estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios qualificadas.",
  "visao": "Ser a referência em networking empresarial de alto nível no Brasil, reconhecido pela qualidade das conexões e resultados gerados para seus membros.",
  "valores": ["Ética e Integridade", "Colaboração Genuína", "Excelência e Inovação", "Respeito Mútuo", "Compromisso com Resultados"],
  "objetivos": [
    "Promover networking estratégico de alta qualidade entre empresários",
    "Facilitar parcerias comerciais e oportunidades de negócios",
    "Compartilhar conhecimentos e melhores práticas empresariais",
    "Fortalecer o desenvolvimento econômico regional",
    "Criar um ambiente de confiança e colaboração mútua"
  ]
}'),
('requisitos', '{
  "titulo": "Requisitos para Participar",
  "requisitos": [
    "Ser empresário ou líder de negócio estabelecido",
    "Comprometimento com os valores e princípios do grupo",
    "Disponibilidade para participar dos encontros mensais",
    "Interesse genuíno em networking e colaboração",
    "Postura ética e profissional em todas as interações",
    "Disposição para contribuir com a comunidade"
  ]
}')
ON CONFLICT DO NOTHING;

-- Criar alguns perfis de demonstração (sem user_id real - para visualização pública)
-- Nota: Estes são perfis fictícios para demonstração visual

-- Criar empresas de demonstração (status publicado para aparecerem publicamente)
INSERT INTO companies (nome, descricao_curta, descricao_completa, status, logo_url, site_url, redes_sociais) VALUES
('Tech Solutions Brasil', 'Soluções tecnológicas inovadoras para empresas', 'A Tech Solutions Brasil é uma empresa líder em desenvolvimento de software e soluções digitais. Com mais de 15 anos de experiência, atendemos empresas de todos os portes com serviços de consultoria, desenvolvimento de sistemas e transformação digital.', 'publicado', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop', 'https://techsolutions.com.br', '{"linkedin": "https://linkedin.com/company/techsolutions", "instagram": "https://instagram.com/techsolutions"}'),
('Construtora Horizonte', 'Construções de alto padrão', 'A Construtora Horizonte é referência em construções residenciais e comerciais de alto padrão. Nossa equipe de engenheiros e arquitetos desenvolve projetos exclusivos com qualidade, segurança e pontualidade.', 'publicado', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop', 'https://construtora-horizonte.com.br', '{"linkedin": "https://linkedin.com/company/horizonte"}'),
('Agro Premium', 'Agronegócio sustentável e inovador', 'A Agro Premium atua no agronegócio há mais de 20 anos, produzindo grãos e commodities com práticas sustentáveis. Exportamos para mais de 30 países e investimos constantemente em tecnologia agrícola.', 'publicado', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop', 'https://agropremium.com.br', '{"instagram": "https://instagram.com/agropremium"}'),
('Consultoria Estratégica', 'Consultoria empresarial especializada', 'Oferecemos serviços de consultoria estratégica para empresas que buscam crescimento sustentável. Nossa metodologia exclusiva já ajudou mais de 500 empresas a alcançarem seus objetivos.', 'publicado', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop', 'https://consultoriaestrategica.com.br', '{"linkedin": "https://linkedin.com/company/consultoriaestrategica"}'),
('Indústria MetalTech', 'Metalurgia de precisão', 'A MetalTech é especializada em metalurgia de precisão para os setores automotivo, aeroespacial e industrial. Contamos com equipamentos de última geração e certificações internacionais de qualidade.', 'publicado', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop', 'https://metaltech.ind.br', '{"linkedin": "https://linkedin.com/company/metaltech"}'),
('Grupo Investimentos', 'Gestão de patrimônio e investimentos', 'O Grupo Investimentos oferece serviços completos de gestão patrimonial, assessoria de investimentos e planejamento financeiro para pessoas físicas e jurídicas de alto patrimônio.', 'publicado', 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=200&h=200&fit=crop', 'https://grupoinvestimentos.com.br', '{"linkedin": "https://linkedin.com/company/grupoinvestimentos", "instagram": "https://instagram.com/grupoinvestimentos"}')
ON CONFLICT DO NOTHING;

-- Criar notícias de demonstração (publicadas)
INSERT INTO news (titulo, resumo, conteudo, publicado, imagem_capa) VALUES
('NCE promove encontro de networking com mais de 50 empresários', 
'O último encontro mensal do Núcleo do Empresário reuniu mais de 50 líderes empresariais para uma noite de networking e palestras exclusivas.',
'<p>O Núcleo do Empresário realizou mais um encontro memorável, reunindo mais de 50 empresários de diversos setores da economia regional.</p><p>O evento contou com palestras sobre tendências de mercado, inovação e estratégias de crescimento. Os participantes também tiveram a oportunidade de trocar experiências e estabelecer novas parcerias de negócios.</p><p>"Cada encontro do NCE é uma oportunidade única de aprender e crescer junto com outros empresários que compartilham os mesmos valores", destacou um dos membros fundadores.</p><p>O próximo encontro está marcado para o mês que vem e promete trazer novidades exclusivas para os nucleados.</p>',
true,
'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=630&fit=crop'),

('Membro do NCE fecha parceria estratégica de R$ 10 milhões', 
'Uma das empresas membro do NCE anunciou parceria estratégica que movimentará R$ 10 milhões nos próximos dois anos.',
'<p>Uma das empresas que fazem parte do Núcleo do Empresário acaba de anunciar uma parceria estratégica que promete movimentar R$ 10 milhões ao longo dos próximos dois anos.</p><p>A conexão foi estabelecida durante um dos encontros mensais do grupo, demonstrando o poder do networking qualificado que o NCE proporciona.</p><p>Segundo o empresário, "o ambiente de confiança que o NCE proporciona foi fundamental para que essa parceria se concretizasse. Conhecemos nosso futuro parceiro em um dos jantares do grupo e a química foi imediata".</p><p>Este é mais um exemplo de como o networking estratégico pode gerar resultados extraordinários quando feito da forma correta.</p>',
true,
'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&h=630&fit=crop'),

('Palestra exclusiva sobre Inteligência Artificial nos negócios', 
'O NCE recebeu especialista internacional para palestra sobre como a IA está transformando o mundo dos negócios.',
'<p>O Núcleo do Empresário trouxe um especialista internacional em Inteligência Artificial para uma palestra exclusiva sobre como essa tecnologia está revolucionando o mundo dos negócios.</p><p>Os participantes aprenderam sobre:</p><ul><li>Aplicações práticas de IA para otimização de processos</li><li>Ferramentas de IA para marketing e vendas</li><li>O futuro do trabalho e como se preparar</li><li>Cases de sucesso de empresas que implementaram IA</li></ul><p>A palestra gerou grande engajamento e muitas perguntas dos empresários presentes, que já estão planejando implementar algumas das soluções apresentadas em suas empresas.</p>',
true,
'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=630&fit=crop'),

('Novo processo seletivo: vagas abertas para novos nucleados', 
'O NCE abre processo seletivo para novos membros. Conheça os requisitos e candidate-se.',
'<p>O Núcleo do Empresário está com vagas abertas para novos membros em seu processo seletivo trimestral.</p><p>Para se candidatar, é necessário:</p><ul><li>Ser empresário ou líder de negócio estabelecido</li><li>Ter comprometimento com os valores do grupo</li><li>Disponibilidade para participar dos encontros mensais</li><li>Interesse genuíno em networking e colaboração</li></ul><p>O processo seletivo é criterioso e busca garantir que todos os membros compartilhem os mesmos valores e objetivos.</p><p>Os interessados podem se candidatar através do formulário disponível em nosso site. As candidaturas serão analisadas pela diretoria do NCE e os selecionados receberão contato em até 7 dias úteis.</p>',
true,
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop')
ON CONFLICT DO NOTHING;