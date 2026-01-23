import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InstitucionalContent {
  missao: string;
  visao: string;
  valores: string[];
  objetivos: string[];
}

interface RequisitosContent {
  titulo: string;
  requisitos: string[];
}

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
}

export function useSiteContent() {
  const query = useQuery({
    queryKey: ['site_content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const getContent = (tipo: string) => {
    const item = query.data?.find((c) => c.tipo === tipo);
    return item?.conteudo as Record<string, unknown> | null;
  };

  return { ...query, getContent };
}

export function useInstitucionalContent() {
  return useQuery({
    queryKey: ['site_content', 'institucional'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('conteudo')
        .eq('tipo', 'institucional')
        .maybeSingle();
      
      if (error) throw error;
      return data?.conteudo as unknown as InstitucionalContent | null;
    },
  });
}

export function useRequisitosContent() {
  return useQuery({
    queryKey: ['site_content', 'requisitos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('conteudo')
        .eq('tipo', 'requisitos')
        .maybeSingle();
      
      if (error) throw error;
      return data?.conteudo as unknown as RequisitosContent | null;
    },
  });
}
