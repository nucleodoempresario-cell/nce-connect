import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HeroContent, GlobalConfigContent } from '@/types/pageBlocks';

// Buscar conteúdo do hero de uma página de listagem
export function useListingPageHero(pagina: 'empresas' | 'membros' | 'noticias') {
  return useQuery({
    queryKey: ['page-blocks', pagina, 'hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_blocks')
        .select('conteudo')
        .eq('pagina', pagina)
        .eq('tipo_bloco', 'hero')
        .eq('visivel', true)
        .single();
      
      if (error) return null;
      return data?.conteudo as unknown as HeroContent;
    },
  });
}

// Buscar configurações globais
export function useGlobalConfig() {
  return useQuery({
    queryKey: ['page-blocks', 'global', 'configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_blocks')
        .select('conteudo')
        .eq('pagina', 'global')
        .eq('tipo_bloco', 'configuracoes')
        .single();
      
      if (error) return null;
      return data?.conteudo as unknown as GlobalConfigContent;
    },
  });
}
