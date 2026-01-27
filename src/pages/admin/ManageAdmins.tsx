import { useState } from 'react';
import { ShieldCheck, ShieldOff, Loader2, UserPlus, Crown, ChevronDown, ChevronRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllProfiles } from '@/hooks/useProfiles';
import { useAdmins, useAddAdmin, useRemoveAdmin } from '@/hooks/useUserRoles';
import { 
  useAllAdminPermissions, 
  useUserPermissions,
  useGrantPermission, 
  useRevokePermission,
  useGrantAllPermissions,
  useRevokeAllPermissions,
  PERMISSION_LABELS, 
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
  type AdminPermission 
} from '@/hooks/usePermissions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminCardProps {
  admin: {
    user_id: string;
    created_at: string;
  };
  profile: {
    id: string;
    nome: string;
    email: string | null;
    foto_url: string | null;
  } | undefined;
  isOnlyAdmin: boolean;
}

function AdminCard({ admin, profile, isOnlyAdmin }: AdminCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: permissions = [] } = useUserPermissions(admin.user_id);
  const grantPermission = useGrantPermission();
  const revokePermission = useRevokePermission();
  const grantAll = useGrantAllPermissions();
  const revokeAll = useRevokeAllPermissions();
  const removeAdmin = useRemoveAdmin();
  const { toast } = useToast();

  const isSuperAdmin = permissions.includes('admins_manage');
  const hasAllPermissions = ALL_PERMISSIONS.every(p => permissions.includes(p));

  const handleTogglePermission = async (permission: AdminPermission, enabled: boolean) => {
    try {
      if (enabled) {
        await grantPermission.mutateAsync({ userId: admin.user_id, permission });
      } else {
        await revokePermission.mutateAsync({ userId: admin.user_id, permission });
      }
      toast({ title: enabled ? 'Permissão concedida' : 'Permissão removida' });
    } catch (error) {
      toast({ title: 'Erro ao alterar permissão', variant: 'destructive' });
    }
  };

  const handleMakeSuperAdmin = async () => {
    try {
      await grantAll.mutateAsync(admin.user_id);
      toast({ title: 'Agora é Super Admin com todas as permissões' });
    } catch (error) {
      toast({ title: 'Erro ao conceder permissões', variant: 'destructive' });
    }
  };

  const handleRemoveAllPermissions = async () => {
    try {
      await revokeAll.mutateAsync(admin.user_id);
      toast({ title: 'Todas as permissões foram removidas' });
    } catch (error) {
      toast({ title: 'Erro ao remover permissões', variant: 'destructive' });
    }
  };

  const handleRemoveAdmin = async () => {
    if (isOnlyAdmin) {
      toast({ title: 'Não é possível remover o único administrador', variant: 'destructive' });
      return;
    }
    
    if (confirm('Tem certeza que deseja remover este administrador?')) {
      try {
        await removeAdmin.mutateAsync(admin.user_id);
        toast({ title: 'Administrador removido' });
      } catch (error) {
        toast({ title: 'Erro ao remover administrador', variant: 'destructive' });
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile?.foto_url || undefined} />
                  <AvatarFallback>{profile?.nome?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{profile?.nome || 'Sem nome'}</CardTitle>
                {isSuperAdmin && (
                      <Badge className="bg-primary/80 text-primary-foreground">
                        <Crown className="h-3 w-3 mr-1" />
                        Super Admin
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{profile?.email}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {permissions.length} permissões
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Desde {format(new Date(admin.created_at), 'dd/MM/yyyy')}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="border-t pt-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-6">
              {!hasAllPermissions && (
                <Button 
                  size="sm" 
                  onClick={handleMakeSuperAdmin}
                  disabled={grantAll.isPending}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Tornar Super Admin
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRemoveAllPermissions}
                disabled={revokeAll.isPending}
              >
                <ShieldOff className="h-4 w-4 mr-2" />
                Remover Todas Permissões
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleRemoveAdmin}
                disabled={isOnlyAdmin || removeAdmin.isPending}
              >
                <ShieldOff className="h-4 w-4 mr-2" />
                Remover Admin
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Permission Groups */}
            <div className="space-y-6">
              {Object.entries(PERMISSION_GROUPS).map(([key, group]) => (
                <div key={key}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">{group.label}</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.permissions.map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <Label 
                          htmlFor={`${admin.user_id}-${permission}`} 
                          className="text-sm cursor-pointer flex-1"
                        >
                          {PERMISSION_LABELS[permission]}
                        </Label>
                        <Switch
                          id={`${admin.user_id}-${permission}`}
                          checked={permissions.includes(permission)}
                          onCheckedChange={(checked) => handleTogglePermission(permission, checked)}
                          disabled={grantPermission.isPending || revokePermission.isPending}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function ManageAdmins() {
  const { data: profiles, isLoading: loadingProfiles } = useAllProfiles();
  const { data: admins, isLoading: loadingAdmins } = useAdmins();
  const addAdmin = useAddAdmin();
  const grantAll = useGrantAllPermissions();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const getProfile = (userId: string) => {
    return profiles?.find(p => p.user_id === userId);
  };

  const activeNonAdmins = profiles?.filter(
    p => p.status === 'ativo' && !admins?.some(a => a.user_id === p.user_id)
  ) || [];

  const handleAddAdmin = async () => {
    if (!selectedUserId) return;
    
    try {
      await addAdmin.mutateAsync(selectedUserId);
      // Grant all permissions to new admin by default
      await grantAll.mutateAsync(selectedUserId);
      toast({ title: 'Administrador adicionado com todas as permissões!' });
      setSelectedUserId('');
    } catch (error: any) {
      toast({ title: error.message || 'Erro ao adicionar administrador', variant: 'destructive' });
    }
  };

  if (loadingProfiles || loadingAdmins) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings2 className="h-8 w-8" />
            Controle de Administradores
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os administradores do sistema e suas permissões de acesso
          </p>
        </div>
      </div>

      {/* Add New Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Novo Administrador
          </CardTitle>
          <CardDescription>
            Selecione um membro ativo para torná-lo administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Selecione um membro..." />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {activeNonAdmins.map((profile) => (
                  <SelectItem key={profile.user_id} value={profile.user_id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={profile.foto_url || undefined} />
                        <AvatarFallback>{profile.nome?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{profile.nome}</span>
                      <span className="text-muted-foreground">- {profile.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddAdmin} disabled={!selectedUserId || addAdmin.isPending}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Adicionar Admin
            </Button>
          </div>
          {activeNonAdmins.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Não há membros ativos disponíveis para adicionar como admin.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Admins */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Administradores Atuais ({admins?.length || 0})
        </h2>
        
        <div className="space-y-4">
          {admins?.map((admin) => (
            <AdminCard
              key={admin.user_id}
              admin={admin}
              profile={getProfile(admin.user_id)}
              isOnlyAdmin={admins.length === 1}
            />
          ))}
        </div>
      </div>

      {/* Permission Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda de Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PERMISSION_GROUPS).map(([key, group]) => (
              <div key={key} className="space-y-2">
                <h4 className="font-medium text-primary">{group.label}</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {group.permissions.map((permission) => (
                    <li key={permission} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {PERMISSION_LABELS[permission]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Crown className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Super Admin</p>
              <p className="text-muted-foreground">
                Usuários com a permissão "Gerenciar Administradores" têm acesso total a todas as funcionalidades 
                do sistema, incluindo a capacidade de adicionar e remover outros administradores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
