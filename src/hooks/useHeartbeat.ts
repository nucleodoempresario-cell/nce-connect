import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Heartbeat {
  id: string;
  created_at: string;
  tipo: string;
  detalhes: {
    timestamp?: string;
    source?: string;
  };
}

export function useHeartbeat() {
  return useQuery({
    queryKey: ['system-heartbeat'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_heartbeat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Heartbeat[];
    },
  });
}

export function useLastHeartbeat() {
  return useQuery({
    queryKey: ['system-heartbeat', 'last'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_heartbeat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Heartbeat | null;
    },
  });
}

// Calcular próximo heartbeat (a cada 3 dias às 8h)
export function getNextHeartbeatDate(lastHeartbeat?: Heartbeat | null): Date {
  const now = new Date();
  
  if (!lastHeartbeat) {
    // Se não há heartbeat, o próximo será na próxima execução do cron (8h de hoje ou amanhã)
    const next = new Date(now);
    next.setHours(8, 0, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  }
  
  // Próximo é 3 dias após o último
  const last = new Date(lastHeartbeat.created_at);
  const next = new Date(last);
  next.setDate(next.getDate() + 3);
  next.setHours(8, 0, 0, 0);
  
  return next;
}

// Verificar se está em risco de pausa (mais de 5 dias sem atividade)
export function isAtRisk(lastHeartbeat?: Heartbeat | null): boolean {
  if (!lastHeartbeat) return true;
  
  const last = new Date(lastHeartbeat.created_at);
  const now = new Date();
  const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  
  return diffDays >= 5;
}
