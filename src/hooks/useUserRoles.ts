import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface AdminWithProfile {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  profile: {
    id: string;
    nome: string;
    email: string | null;
    foto_url: string | null;
  } | null;
}

export function useAdmins() {
  return useQuery({
    queryKey: ['user_roles', 'admins'],
    queryFn: async () => {
      // First get all admin roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');
      
      if (rolesError) throw rolesError;
      
      // Then get profiles for each admin
      const adminsWithProfiles: AdminWithProfile[] = [];
      
      for (const role of roles || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, nome, email, foto_url')
          .eq('user_id', role.user_id)
          .maybeSingle();
        
        adminsWithProfiles.push({
          ...role,
          profile,
        });
      }
      
      return adminsWithProfiles;
    },
  });
}

export function useUserRole(userId: string) {
  return useQuery({
    queryKey: ['user_roles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data?.map(r => r.role) || [];
    },
    enabled: !!userId,
  });
}

export function useAddAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Check if already admin
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (existing) {
        throw new Error('Usuário já é administrador');
      }
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
    },
  });
}

export function useRemoveAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Check if this is the last admin
      const { data: admins } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin');
      
      if (admins && admins.length <= 1) {
        throw new Error('Não é possível remover o último administrador');
      }
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_roles'] });
    },
  });
}
