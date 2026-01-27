import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Generic hook for any content type
export function useContentByType<T>(tipo: string) {
  return useQuery({
    queryKey: ['site_content', tipo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('conteudo')
        .eq('tipo', tipo)
        .maybeSingle();
      
      if (error) throw error;
      return data?.conteudo as unknown as T | null;
    },
  });
}

// Specific hooks for each content type
export function useHomeHeroContent() {
  return useContentByType<{
    badge: string;
    titulo: string;
    subtitulo: string;
    botao_primario: string;
    botao_secundario: string;
    imagem_url: string;
    estatistica_numero: string;
    estatistica_label: string;
  }>('home_hero');
}

export function useHomeConfiancaContent() {
  return useContentByType<{
    titulo: string;
    descricao: string;
    imagem_url: string;
    features: Array<{ icon: string; titulo: string; descricao: string }>;
  }>('home_confianca');
}

export function useHomePilaresContent() {
  return useContentByType<{
    titulo_secao: string;
    subtitulo_secao: string;
    cards: Array<{ icon: string; titulo: string; descricao: string }>;
  }>('home_pilares');
}

export function useHomeColaboracaoContent() {
  return useContentByType<{
    titulo: string;
    descricao: string;
    imagem_url: string;
    features: Array<{ titulo: string; descricao: string }>;
    botao_texto: string;
  }>('home_colaboracao');
}

export function useHomeSecaoEmpresasContent() {
  return useContentByType<{ titulo: string; subtitulo: string }>('home_secao_empresas');
}

export function useHomeSecaoMembrosContent() {
  return useContentByType<{ titulo: string; subtitulo: string }>('home_secao_membros');
}

export function useHomeSecaoNoticiasContent() {
  return useContentByType<{ titulo: string; subtitulo: string }>('home_secao_noticias');
}

export function useHomeComunidadeContent() {
  return useContentByType<{
    titulo: string;
    descricao: string;
    imagem_url: string;
    beneficios: string[];
    botao_texto: string;
  }>('home_comunidade');
}

export function useHomeCtaContent() {
  return useContentByType<{
    titulo: string;
    subtitulo: string;
    botao_primario: string;
    botao_secundario: string;
  }>('home_cta');
}

export function useSobreHeroContent() {
  return useContentByType<{
    badge: string;
    titulo: string;
    subtitulo: string;
    imagem_url: string;
  }>('sobre_hero');
}

export function useSobreStatsContent() {
  return useContentByType<{
    items: Array<{ valor: string; label: string; icon: string }>;
  }>('sobre_stats');
}

export function useSobreDescricaoContent() {
  return useContentByType<{
    titulo: string;
    paragrafos: string[];
  }>('sobre_descricao');
}

export function useNucleadoHeroContent() {
  return useContentByType<{
    badge: string;
    titulo: string;
    subtitulo: string;
  }>('nucleado_hero');
}

export function useNucleadoBeneficiosContent() {
  return useContentByType<{
    items: Array<{ icon: string; titulo: string; descricao: string }>;
  }>('nucleado_beneficios');
}

export function useNucleadoSucessoContent() {
  return useContentByType<{
    titulo: string;
    descricao: string;
  }>('nucleado_sucesso');
}

export function useListagemEmpresasContent() {
  return useContentByType<{
    badge: string;
    titulo: string;
    subtitulo: string;
  }>('listagem_empresas');
}

export function useListagemMembrosContent() {
  return useContentByType<{
    badge: string;
    titulo: string;
    subtitulo: string;
  }>('listagem_membros');
}

export function useListagemNoticiasContent() {
  return useContentByType<{
    badge: string;
    titulo: string;
    subtitulo: string;
  }>('listagem_noticias');
}

export function useGlobalFooterContent() {
  return useContentByType<{
    descricao: string;
    instagram_url: string;
  }>('global_footer');
}

export function useGlobalInfoContent() {
  return useContentByType<{
    nome: string;
    slogan: string;
  }>('global_info');
}
