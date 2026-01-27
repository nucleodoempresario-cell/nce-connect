import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  id: string;
  tabela: string;
  registro_id: string;
  usuario_id: string | null;
  acao: string;
  dados_anteriores: Record<string, unknown> | null;
  dados_novos: Record<string, unknown> | null;
  created_at: string;
}

export function useAuditLog(tabela?: string, registroId?: string) {
  return useQuery({
    queryKey: ['audit_log', tabela, registroId],
    queryFn: async () => {
      let query = supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (tabela) {
        query = query.eq('tabela', tabela);
      }
      
      if (registroId) {
        query = query.eq('registro_id', registroId);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: true,
  });
}

export function useRecordAuditLog(tabela: string, registroId: string) {
  return useQuery({
    queryKey: ['audit_log', tabela, registroId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .eq('tabela', tabela)
        .eq('registro_id', registroId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!registroId,
  });
}
