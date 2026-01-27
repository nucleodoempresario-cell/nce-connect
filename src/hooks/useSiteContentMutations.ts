import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ tipo, conteudo }: { tipo: string; conteudo: any }) => {
      // First check if the record exists
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('tipo', tipo)
        .maybeSingle();
      
      let error;
      if (existing) {
        // Update existing record
        const result = await supabase
          .from('site_content')
          .update({ conteudo: conteudo as Json, updated_at: new Date().toISOString() })
          .eq('tipo', tipo);
        error = result.error;
      } else {
        // Insert new record
        const result = await supabase
          .from('site_content')
          .insert({ tipo, conteudo: conteudo as Json });
        error = result.error;
      }
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['site_content'] });
      queryClient.invalidateQueries({ queryKey: ['site_content', variables.tipo] });
      toast({ 
        title: 'Conteúdo salvo!', 
        description: 'As alterações foram publicadas no site.' 
      });
    },
    onError: () => {
      toast({ 
        title: 'Erro ao salvar', 
        description: 'Tente novamente.', 
        variant: 'destructive' 
      });
    },
  });
}

// Type definitions for content structures
export interface HomeHeroContent {
  badge: string;
  titulo: string;
  subtitulo: string;
  botao_primario: string;
  botao_secundario: string;
  imagem_url: string;
  estatistica_numero: string;
  estatistica_label: string;
}

export interface FeatureItem {
  icon: string;
  titulo: string;
  descricao: string;
}

export interface HomeConfiancaContent {
  titulo: string;
  descricao: string;
  imagem_url: string;
  features: FeatureItem[];
}

export interface HomePilaresContent {
  titulo_secao: string;
  subtitulo_secao: string;
  cards: FeatureItem[];
}

export interface CollaborationFeature {
  titulo: string;
  descricao: string;
}

export interface HomeColaboracaoContent {
  titulo: string;
  descricao: string;
  imagem_url: string;
  features: CollaborationFeature[];
  botao_texto: string;
}

export interface SectionTitleContent {
  titulo: string;
  subtitulo: string;
}

export interface HomeComunidadeContent {
  titulo: string;
  descricao: string;
  imagem_url: string;
  beneficios: string[];
  botao_texto: string;
}

export interface HomeCtaContent {
  titulo: string;
  subtitulo: string;
  botao_primario: string;
  botao_secundario: string;
}

export interface SobreHeroContent {
  badge: string;
  titulo: string;
  subtitulo: string;
  imagem_url: string;
}

export interface StatItem {
  valor: string;
  label: string;
  icon: string;
}

export interface SobreStatsContent {
  items: StatItem[];
}

export interface SobreDescricaoContent {
  titulo: string;
  paragrafos: string[];
}

export interface NucleadoHeroContent {
  badge: string;
  titulo: string;
  subtitulo: string;
}

export interface NucleadoBeneficiosContent {
  items: FeatureItem[];
}

export interface NucleadoSucessoContent {
  titulo: string;
  descricao: string;
}

export interface ListagemContent {
  badge: string;
  titulo: string;
  subtitulo: string;
}

export interface GlobalFooterContent {
  descricao: string;
  instagram_url: string;
}

export interface GlobalInfoContent {
  nome: string;
  slogan: string;
}
