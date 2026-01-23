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
