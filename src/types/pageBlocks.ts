// Tipos para o sistema de Page Builder

export type BlockType = 
  | 'hero' 
  | 'features' 
  | 'texto_imagem' 
  | 'lista_beneficios' 
  | 'cta' 
  | 'cards_icone' 
  | 'texto_simples' 
  | 'galeria' 
  | 'divisor' 
  | 'embed'
  | 'configuracoes';

export interface PageBlock {
  id: string;
  pagina: string;
  tipo_bloco: BlockType;
  ordem: number;
  conteudo: BlockContent;
  visivel: boolean;
  created_at: string;
  updated_at: string;
}

// Union type para todos os tipos de conteúdo
export type BlockContent = 
  | HeroContent 
  | FeaturesContent 
  | TextoImagemContent 
  | ListaBeneficiosContent 
  | CtaContent 
  | CardsIconeContent 
  | TextoSimplesContent 
  | GaleriaContent 
  | DivisorContent 
  | EmbedContent;

// Tipos específicos de cada bloco
export interface ButtonConfig {
  texto: string;
  link: string;
}

export interface FeatureItem {
  icon?: string;
  titulo: string;
  descricao?: string;
  cor?: 'primary' | 'accent';
  lista?: string[];
}

export interface HeroContent {
  badge?: string;
  titulo: string;
  subtitulo?: string;
  botao_primario?: ButtonConfig;
  botao_secundario?: ButtonConfig;
  imagem_url?: string;
  estatistica?: {
    numero: string;
    label: string;
  };
}

export interface FeaturesContent {
  titulo?: string;
  subtitulo?: string;
  cards: FeatureItem[];
}

export interface TextoImagemContent {
  titulo: string;
  descricao?: string;
  paragrafos?: string[];
  imagem_url?: string;
  imagem_lado?: 'esquerda' | 'direita';
  features?: FeatureItem[];
  cards?: FeatureItem[];
  botao?: ButtonConfig;
}

export interface ListaBeneficiosContent {
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  imagem_url?: string;
  imagem_lado?: 'esquerda' | 'direita';
  itens: string[];
  estilo?: 'check' | 'numerado';
  nota?: string;
  botao?: ButtonConfig;
}

export interface CtaContent {
  titulo: string;
  subtitulo?: string;
  botao_primario?: ButtonConfig;
  botao_secundario?: ButtonConfig;
  estilo?: 'claro' | 'escuro';
}

export interface CardsIconeContent {
  titulo?: string;
  subtitulo?: string;
  cards: FeatureItem[];
  colunas?: 2 | 3 | 4 | 6;
}

export interface TextoSimplesContent {
  titulo?: string;
  conteudo: string; // HTML do editor WYSIWYG
}

export interface GaleriaContent {
  titulo?: string;
  imagens: {
    url: string;
    alt?: string;
    legenda?: string;
  }[];
  colunas?: 2 | 3 | 4;
}

export interface DivisorContent {
  estilo?: 'linha' | 'espaco';
  altura?: number;
}

export interface EmbedContent {
  tipo: 'empresas' | 'membros' | 'noticias' | 'formulario_candidatura';
  titulo?: string;
  subtitulo?: string;
  limite?: number;
  botao?: ButtonConfig;
}

// Metadados dos tipos de bloco para o seletor
export interface BlockTypeInfo {
  tipo: BlockType;
  nome: string;
  descricao: string;
  icon: string;
}

export const BLOCK_TYPES: BlockTypeInfo[] = [
  { tipo: 'hero', nome: 'Hero Banner', descricao: 'Banner principal com título, subtítulo e imagem', icon: 'Layout' },
  { tipo: 'features', nome: 'Cards de Features', descricao: 'Grid de cards com ícone, título e descrição', icon: 'Grid3X3' },
  { tipo: 'texto_imagem', nome: 'Texto + Imagem', descricao: 'Seção com texto de um lado e imagem do outro', icon: 'Image' },
  { tipo: 'lista_beneficios', nome: 'Lista de Benefícios', descricao: 'Lista com checkmarks ou números', icon: 'ListChecks' },
  { tipo: 'cta', nome: 'Call to Action', descricao: 'Chamada para ação com botões', icon: 'MousePointerClick' },
  { tipo: 'cards_icone', nome: 'Grid de Cards', descricao: 'Grid customizável de cards com ícones', icon: 'LayoutGrid' },
  { tipo: 'texto_simples', nome: 'Texto Rico', descricao: 'Bloco de texto com editor WYSIWYG', icon: 'FileText' },
  { tipo: 'galeria', nome: 'Galeria de Imagens', descricao: 'Grid de imagens com legendas', icon: 'Images' },
  { tipo: 'divisor', nome: 'Divisor', descricao: 'Linha separadora ou espaço', icon: 'Minus' },
  { tipo: 'embed', nome: 'Conteúdo Dinâmico', descricao: 'Lista de empresas, membros ou notícias', icon: 'Code' },
  { tipo: 'configuracoes', nome: 'Configurações Globais', descricao: 'Footer, redes sociais e informações do site', icon: 'Settings' },
];

// Nomes de páginas disponíveis
export const AVAILABLE_PAGES = [
  { id: 'home', nome: 'Página Inicial' },
  { id: 'sobre', nome: 'Sobre Nós' },
  { id: 'seja-nucleado', nome: 'Seja Nucleado' },
  { id: 'empresas', nome: 'Empresas' },
  { id: 'membros', nome: 'Membros' },
  { id: 'noticias', nome: 'Notícias' },
  { id: 'global', nome: 'Configurações Globais' },
] as const;

export type PageId = typeof AVAILABLE_PAGES[number]['id'];

// Tipo para configurações globais
export interface GlobalConfigContent {
  footer_descricao?: string;
  footer_instagram?: string;
  nome_site?: string;
  slogan?: string;
}
