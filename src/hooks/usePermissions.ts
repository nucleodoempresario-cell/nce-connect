import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AdminPermission = 
  | 'users_view'
  | 'users_edit'
  | 'users_approve'
  | 'users_delete'
  | 'companies_view'
  | 'companies_edit'
  | 'companies_approve'
  | 'companies_delete'
  | 'news_view'
  | 'news_edit'
  | 'news_delete'
  | 'applications_view'
  | 'applications_edit'
  | 'applications_delete'
  | 'forms_manage'
  | 'reports_view'
  | 'admins_manage';

export const ALL_PERMISSIONS: AdminPermission[] = [
  'users_view',
  'users_edit',
  'users_approve',
  'users_delete',
  'companies_view',
  'companies_edit',
  'companies_approve',
  'companies_delete',
  'news_view',
  'news_edit',
  'news_delete',
  'applications_view',
  'applications_edit',
  'applications_delete',
  'forms_manage',
  'reports_view',
  'admins_manage',
];

export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  users_view: 'Visualizar Usuários',
  users_edit: 'Editar Usuários',
  users_approve: 'Aprovar Usuários',
  users_delete: 'Excluir Usuários',
  companies_view: 'Visualizar Empresas',
  companies_edit: 'Editar Empresas',
  companies_approve: 'Aprovar Empresas',
  companies_delete: 'Excluir Empresas',
  news_view: 'Visualizar Notícias',
  news_edit: 'Editar Notícias',
  news_delete: 'Excluir Notícias',
  applications_view: 'Visualizar Inscrições',
  applications_edit: 'Editar Inscrições',
  applications_delete: 'Excluir Inscrições',
  forms_manage: 'Gerenciar Formulário',
  reports_view: 'Visualizar Relatórios',
  admins_manage: 'Gerenciar Administradores (Super Admin)',
};

export const PERMISSION_GROUPS = {
  usuarios: {
    label: 'Usuários',
    permissions: ['users_view', 'users_edit', 'users_approve', 'users_delete'] as AdminPermission[],
  },
  empresas: {
    label: 'Empresas',
    permissions: ['companies_view', 'companies_edit', 'companies_approve', 'companies_delete'] as AdminPermission[],
  },
  noticias: {
    label: 'Notícias',
    permissions: ['news_view', 'news_edit', 'news_delete'] as AdminPermission[],
  },
  inscricoes: {
    label: 'Inscrições',
    permissions: ['applications_view', 'applications_edit', 'applications_delete'] as AdminPermission[],
  },
  outros: {
    label: 'Outros',
    permissions: ['forms_manage', 'reports_view', 'admins_manage'] as AdminPermission[],
  },
};

interface AdminPermissionRow {
  id: string;
  user_id: string;
  permission: AdminPermission;
  created_at: string;
  granted_by: string | null;
}

// Get all permissions for all admins
export function useAllAdminPermissions() {
  return useQuery({
    queryKey: ['admin_permissions', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AdminPermissionRow[];
    },
  });
}

// Get permissions for current user
export function useMyPermissions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['admin_permissions', 'my', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('permission')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(p => p.permission as AdminPermission);
    },
    enabled: !!user?.id,
  });
}

// Get permissions for specific user
export function useUserPermissions(userId: string | null) {
  return useQuery({
    queryKey: ['admin_permissions', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('permission')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data.map(p => p.permission as AdminPermission);
    },
    enabled: !!userId,
  });
}

// Check if current user has permission
export function useHasPermission(permission: AdminPermission) {
  const { data: myPermissions, isLoading } = useMyPermissions();
  const { isAdmin } = useAuth();
  
  // Super admin check: if user has admins_manage, they have all permissions
  const hasSuperAdmin = myPermissions?.includes('admins_manage');
  
  // If no permissions are set but user is admin, they have full access (legacy support)
  const hasLegacyAccess = isAdmin && myPermissions?.length === 0;
  
  const hasPermission = hasSuperAdmin || hasLegacyAccess || myPermissions?.includes(permission) || false;
  
  return { hasPermission, isLoading };
}

// Grant permission to user
export function useGrantPermission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ userId, permission }: { userId: string; permission: AdminPermission }) => {
      const { error } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: userId,
          permission: permission,
          granted_by: user?.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_permissions'] });
    },
  });
}

// Revoke permission from user
export function useRevokePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, permission }: { userId: string; permission: AdminPermission }) => {
      const { error } = await supabase
        .from('admin_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('permission', permission);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_permissions'] });
    },
  });
}

// Grant all permissions (make super admin)
export function useGrantAllPermissions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const permissions = ALL_PERMISSIONS.map(permission => ({
        user_id: userId,
        permission: permission,
        granted_by: user?.id,
      }));
      
      const { error } = await supabase
        .from('admin_permissions')
        .upsert(permissions, { onConflict: 'user_id,permission' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_permissions'] });
    },
  });
}

// Revoke all permissions from user
export function useRevokeAllPermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('admin_permissions')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_permissions'] });
    },
  });
}
