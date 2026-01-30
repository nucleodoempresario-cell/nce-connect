-- ========================================
-- Tabela page_blocks para o Page Builder Dinâmico
-- ========================================

CREATE TABLE public.page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pagina TEXT NOT NULL,
  tipo_bloco TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  conteudo JSONB NOT NULL DEFAULT '{}'::jsonb,
  visivel BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para busca por página
CREATE INDEX idx_page_blocks_pagina ON public.page_blocks(pagina);
CREATE INDEX idx_page_blocks_ordem ON public.page_blocks(pagina, ordem);

-- Enable RLS
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Conteúdo de blocos é público para leitura" 
ON public.page_blocks 
FOR SELECT 
USING (visivel = true);

CREATE POLICY "Admins podem gerenciar blocos" 
ON public.page_blocks 
FOR ALL 
USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_page_blocks_updated_at
BEFORE UPDATE ON public.page_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- Dados iniciais - PÁGINA HOME
-- ========================================

INSERT INTO public.page_blocks (pagina, tipo_bloco, ordem, conteudo) VALUES

-- HOME: Hero Section
('home', 'hero', 1, '{
  "badge": "Rede de Empresários Multisetorial",
  "titulo": "Conectando Empresários para o Sucesso",
  "subtitulo": "Uma comunidade exclusiva de líderes empresariais comprometidos com o crescimento mútuo, networking estratégico e excelência nos negócios.",
  "botao_primario": {"texto": "Explorar Oportunidades", "link": "/empresas"},
  "botao_secundario": {"texto": "Conheça o Núcleo", "link": "/sobre"},
  "imagem_url": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1974&auto=format&fit=crop",
  "estatistica": {"numero": "50+", "label": "Empresários"}
}'::jsonb),

-- HOME: Seção Confiança (Texto + Imagem)
('home', 'texto_imagem', 2, '{
  "titulo": "Fundado em Confiança e Credibilidade",
  "descricao": "O Núcleo do Empresário nasceu da necessidade de criar um ambiente onde líderes empresariais pudessem se conectar de forma genuína e gerar oportunidades reais.",
  "imagem_url": "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop",
  "imagem_lado": "esquerda",
  "features": [
    {"icon": "Shield", "titulo": "Ambiente Seguro", "descricao": "Grupo seleto e comprometido com valores éticos"},
    {"icon": "Network", "titulo": "Networking Estratégico", "descricao": "Conexões de alto nível que geram resultados"},
    {"icon": "TrendingUp", "titulo": "Crescimento Compartilhado", "descricao": "Sucesso mútuo através da colaboração"}
  ]
}'::jsonb),

-- HOME: Pilares (Features/Cards)
('home', 'features', 3, '{
  "titulo": "Nossos Pilares",
  "subtitulo": "Os fundamentos que guiam nossa comunidade de empresários",
  "cards": [
    {"icon": "Target", "titulo": "Missão", "descricao": "Conectar empresários estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios."},
    {"icon": "Eye", "titulo": "Visão", "descricao": "Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões e resultados."},
    {"icon": "Heart", "titulo": "Valores", "descricao": "Ética, integridade, colaboração genuína, excelência e respeito mútuo em todas as interações."}
  ]
}'::jsonb),

-- HOME: Seção Colaboração (Texto + Imagem)
('home', 'texto_imagem', 4, '{
  "titulo": "Crescimento Através da Colaboração",
  "descricao": "Nossos encontros estratégicos e ambiente de confiança proporcionam as condições ideais para que negócios aconteçam naturalmente entre pessoas comprometidas.",
  "imagem_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
  "imagem_lado": "direita",
  "features": [
    {"titulo": "Reuniões Estratégicas", "descricao": "Encontros mensais com foco em resultados e conexões"},
    {"titulo": "Parcerias e Oportunidades", "descricao": "Ambiente propício para geração de negócios reais"},
    {"titulo": "Conhecimento Compartilhado", "descricao": "Troca de experiências entre líderes empresariais"}
  ],
  "botao": {"texto": "Junte-se ao NCE", "link": "/seja-nucleado"}
}'::jsonb),

-- HOME: Embed Empresas
('home', 'embed', 5, '{
  "tipo": "empresas",
  "titulo": "Empresas do Núcleo",
  "subtitulo": "Conheça algumas das empresas que fazem parte da nossa comunidade",
  "limite": 3,
  "botao": {"texto": "Explorar Todas as Empresas", "link": "/empresas"}
}'::jsonb),

-- HOME: Embed Membros
('home', 'embed', 6, '{
  "tipo": "membros",
  "titulo": "Nucleados",
  "subtitulo": "Empresários de destaque que fazem parte do nosso núcleo",
  "limite": 4,
  "botao": {"texto": "Conheça Todos os Nucleados", "link": "/membros"}
}'::jsonb),

-- HOME: Embed Notícias
('home', 'embed', 7, '{
  "tipo": "noticias",
  "titulo": "Notícias e Ações",
  "subtitulo": "Acompanhe as novidades e acontecimentos do NCE",
  "limite": 3,
  "botao": {"texto": "Ver Todas as Notícias", "link": "/noticias"}
}'::jsonb),

-- HOME: Seção Comunidade (Lista de Benefícios)
('home', 'lista_beneficios', 8, '{
  "titulo": "A Força de Uma Comunidade Unida",
  "descricao": "Fazer parte do NCE significa ter acesso a uma rede de empresários comprometidos com o crescimento mútuo e a excelência nos negócios.",
  "imagem_url": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
  "imagem_lado": "esquerda",
  "itens": [
    "Acesso a uma rede exclusiva de empresários de alto nível",
    "Eventos e encontros mensais com networking qualificado",
    "Oportunidades reais de negócios entre membros",
    "Ambiente de confiança e colaboração mútua",
    "Crescimento profissional e pessoal contínuo"
  ],
  "botao": {"texto": "Junte-se ao NCE", "link": "/seja-nucleado"}
}'::jsonb),

-- HOME: CTA Final
('home', 'cta', 9, '{
  "titulo": "Pronto para fazer parte da elite empresarial?",
  "subtitulo": "Candidate-se agora e descubra como o NCE pode transformar sua rede de contatos e impulsionar seu negócio.",
  "botao_primario": {"texto": "Candidate-se Agora", "link": "/seja-nucleado"},
  "botao_secundario": {"texto": "Saiba Mais", "link": "/sobre"},
  "estilo": "escuro"
}'::jsonb),

-- ========================================
-- Dados iniciais - PÁGINA SOBRE
-- ========================================

-- SOBRE: Hero
('sobre', 'hero', 1, '{
  "badge": "Nossa História",
  "titulo": "Conheça o Núcleo do Empresário",
  "subtitulo": "Uma comunidade de líderes empresariais comprometidos com o crescimento mútuo, networking estratégico e excelência nos negócios.",
  "imagem_url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2090&auto=format&fit=crop"
}'::jsonb),

-- SOBRE: Pilares (Missão, Visão, Valores)
('sobre', 'features', 2, '{
  "titulo": "Nossa Essência",
  "subtitulo": "Os pilares fundamentais que guiam nossa comunidade",
  "cards": [
    {"icon": "Target", "titulo": "Missão", "descricao": "Conectar lideranças empresariais estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios qualificadas."},
    {"icon": "Eye", "titulo": "Visão", "descricao": "Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões e resultados gerados para seus membros."},
    {"icon": "Heart", "titulo": "Valores", "lista": ["Ética e Integridade", "Colaboração Genuína", "Excelência e Inovação", "Respeito Mútuo"]}
  ]
}'::jsonb),

-- SOBRE: Descrição (Texto + Cards)
('sobre', 'texto_imagem', 3, '{
  "titulo": "Uma comunidade de empresários de elite",
  "paragrafos": [
    "O Núcleo do Empresário nasceu da necessidade de criar um ambiente onde líderes empresariais pudessem se conectar de forma genuína, trocar experiências e gerar oportunidades de negócios reais.",
    "Diferente de grupos tradicionais, o NCE mantém um processo seletivo rigoroso para garantir que todos os membros compartilhem os mesmos valores e objetivos: crescimento, colaboração e excelência.",
    "Nossos encontros mensais, eventos exclusivos e ambiente de confiança proporcionam as condições ideais para que negócios aconteçam naturalmente entre pessoas comprometidas com o sucesso mútuo."
  ],
  "botao": {"texto": "Faça parte do NCE", "link": "/seja-nucleado"},
  "cards": [
    {"icon": "Network", "titulo": "Networking", "descricao": "Conexões estratégicas de alto nível.", "cor": "primary"},
    {"icon": "TrendingUp", "titulo": "Crescimento", "descricao": "Negócios que realmente acontecem."},
    {"icon": "Award", "titulo": "Excelência", "descricao": "Padrão elevado em todas as ações."},
    {"icon": "Shield", "titulo": "Confiança", "descricao": "Ambiente seguro para crescer.", "cor": "accent"}
  ]
}'::jsonb),

-- SOBRE: Objetivos Estratégicos
('sobre', 'lista_beneficios', 4, '{
  "titulo": "Objetivos Estratégicos",
  "subtitulo": "Trabalhamos diariamente para alcançar resultados extraordinários para nossa comunidade",
  "estilo": "numerado",
  "itens": [
    "Promover networking estratégico de alta qualidade entre empresários",
    "Facilitar parcerias comerciais e oportunidades de negócios",
    "Compartilhar conhecimentos e melhores práticas empresariais",
    "Fortalecer o desenvolvimento econômico regional",
    "Criar um ambiente de confiança e colaboração mútua"
  ]
}'::jsonb),

-- ========================================
-- Dados iniciais - PÁGINA SEJA NUCLEADO
-- ========================================

-- SEJA NUCLEADO: Hero
('seja-nucleado', 'hero', 1, '{
  "badge": "Processo Seletivo",
  "titulo": "Seja um Nucleado",
  "subtitulo": "Faça parte de uma comunidade exclusiva de empresários de alto nível. Candidate-se e descubra o que podemos construir juntos."
}'::jsonb),

-- SEJA NUCLEADO: Benefícios
('seja-nucleado', 'features', 2, '{
  "cards": [
    {"icon": "Users", "titulo": "Networking Premium", "descricao": "Acesso a empresários de alto nível"},
    {"icon": "Shield", "titulo": "Ambiente de Confiança", "descricao": "Grupo seleto e comprometido"},
    {"icon": "Award", "titulo": "Eventos Exclusivos", "descricao": "Encontros mensais e workshops"}
  ]
}'::jsonb),

-- SEJA NUCLEADO: Requisitos (Lista)
('seja-nucleado', 'lista_beneficios', 3, '{
  "titulo": "Requisitos para Participar",
  "itens": [
    "Ser empresário ou líder de negócio",
    "Comprometimento com os valores do grupo",
    "Disponibilidade para participar dos encontros",
    "Interesse genuíno em networking",
    "Postura ética e colaborativa"
  ],
  "nota": "Processo seletivo: Após o envio, sua candidatura será analisada pela nossa equipe. Retornaremos em até 7 dias úteis."
}'::jsonb),

-- SEJA NUCLEADO: Formulário (embed especial)
('seja-nucleado', 'embed', 4, '{
  "tipo": "formulario_candidatura",
  "titulo": "Formulário de Candidatura"
}'::jsonb);