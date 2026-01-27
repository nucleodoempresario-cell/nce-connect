import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          dono:profiles!companies_dono_id_fkey(id, nome, foto_url)
        `)
        .eq('status', 'publicado')
        .order('nome');
      
      if (error) throw error;
      return data;
    },
  });
}

export function useAllCompanies() {
  return useQuery({
    queryKey: ['companies', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          dono:profiles!companies_dono_id_fkey(id, nome, foto_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          dono:profiles!companies_dono_id_fkey(id, nome, foto_url, bio, redes_sociais)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useMemberCompany(profileId: string) {
  return useQuery({
    queryKey: ['companies', 'member', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('dono_id', profileId)
        .eq('status', 'publicado')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!profileId,
  });
}

export function useMyCompany(profileId: string | undefined) {
  return useQuery({
    queryKey: ['companies', 'my', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('dono_id', profileId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Company | null;
    },
    enabled: !!profileId,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (company: CompanyInsert) => {
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates, skipApproval = false }: { id: string; updates: CompanyUpdate; skipApproval?: boolean }) => {
      // Check if company has auto_aprovacao enabled
      let newStatus: 'publicado' | 'pendente_aprovacao' = 'pendente_aprovacao';
      
      if (skipApproval) {
        // Admin is updating, keep current status
        const { data: current } = await supabase
          .from('companies')
          .select('status')
          .eq('id', id)
          .single();
        newStatus = current?.status as 'publicado' | 'pendente_aprovacao' || 'pendente_aprovacao';
      } else {
        // Check for auto_aprovacao
        const { data: company } = await supabase
          .from('companies')
          .select('auto_aprovacao, status')
          .eq('id', id)
          .single();
        
        if ((company as any)?.auto_aprovacao && company?.status === 'publicado') {
          newStatus = 'publicado';
        }
      }
      
      const { data, error } = await supabase
        .from('companies')
        .update({ ...updates, status: newStatus })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}
