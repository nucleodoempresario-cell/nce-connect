import React, { useState } from 'react';
import { Check, X, Loader2, ChevronDown, ChevronRight, UserCog, ShieldCheck, Power, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { useAllProfiles, useUpdateProfile } from '@/hooks/useProfiles';
import { useAllCompanies } from '@/hooks/useCompanies';
import { useAdmins, useAddAdmin, useRemoveAdmin } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { UserDetailPanel } from '@/components/admin/UserDetailPanel';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ManageUsers() {
  const { data: profiles, isLoading, refetch } = useAllProfiles();
  const { data: companies } = useAllCompanies();
  const { data: admins } = useAdmins();
  const updateProfile = useUpdateProfile();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pendentes');

  const getAdminUserIds = () => admins?.map(a => a.user_id) || [];
  const isUserAdmin = (userId: string) => getAdminUserIds().includes(userId);

  const getUserCompany = (profileId: string) => {
    return companies?.find(c => c.dono_id === profileId);
  };

  const handleApprove = async (profile: Profile) => {
    await updateProfile.mutateAsync({ id: profile.id, updates: { status: 'ativo' } });
    toast({ title: 'Usuário aprovado!' });
  };

  const handleReject = async (profile: Profile) => {
    await updateProfile.mutateAsync({ id: profile.id, updates: { status: 'inativo' } });
    // Cascade: deactivate company
    const company = getUserCompany(profile.id);
    if (company) {
      await supabase.from('companies').update({ status: 'rejeitado' }).eq('id', company.id);
    }
    toast({ title: 'Usuário rejeitado e empresa desativada' });
    refetch();
  };

  const handleActivate = async (profile: Profile) => {
    await updateProfile.mutateAsync({ id: profile.id, updates: { status: 'ativo' } });
    toast({ title: 'Usuário ativado!' });
  };

  const handleDeactivate = async (profile: Profile) => {
    await updateProfile.mutateAsync({ id: profile.id, updates: { status: 'inativo' } });
    // Cascade: deactivate company
    const company = getUserCompany(profile.id);
    if (company) {
      await supabase.from('companies').update({ status: 'rejeitado' }).eq('id', company.id);
    }
    toast({ title: 'Usuário desativado e empresa desativada' });
    refetch();
  };

  const handleToggleAdmin = async (profile: Profile) => {
    try {
      if (isUserAdmin(profile.user_id)) {
        await removeAdmin.mutateAsync(profile.user_id);
        toast({ title: 'Permissão de admin removida' });
      } else {
        await addAdmin.mutateAsync(profile.user_id);
        toast({ title: 'Usuário agora é administrador!' });
      }
    } catch (error: any) {
      toast({ title: error.message || 'Erro ao alterar permissões', variant: 'destructive' });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const pendingProfiles = profiles?.filter(p => p.status === 'pendente') || [];
  const activeProfiles = profiles?.filter(p => p.status === 'ativo') || [];
  const inactiveProfiles = profiles?.filter(p => p.status === 'inativo') || [];
  const adminProfiles = activeProfiles.filter(p => isUserAdmin(p.user_id));

  const renderUserRow = (profile: Profile, showActions: 'approve' | 'activate' | 'deactivate' | 'admin') => {
    const isExpanded = expandedId === profile.id;
    const userCompany = getUserCompany(profile.id);
    const isAdmin = isUserAdmin(profile.user_id);

    return (
      <React.Fragment key={profile.id}>
        <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(isExpanded ? null : profile.id)}>
          <TableCell>
            <div className="flex items-center gap-3">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.foto_url || undefined} />
                <AvatarFallback>{profile.nome?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">{profile.nome}</span>
                {isAdmin && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    <ShieldCheck className="h-3 w-3 mr-1" />Admin
                  </Badge>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell>{profile.email}</TableCell>
          <TableCell>
            {userCompany ? (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userCompany.nome}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </TableCell>
          <TableCell>{format(new Date(profile.created_at), 'dd/MM/yyyy')}</TableCell>
          <TableCell className="text-right space-x-2">
            {showActions === 'approve' && (
              <>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleApprove(profile); }}>
                  <Check className="h-4 w-4 mr-1" /> Aprovar
                </Button>
                <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleReject(profile); }}>
                  <X className="h-4 w-4 mr-1" /> Rejeitar
                </Button>
              </>
            )}
            {showActions === 'activate' && (
              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleActivate(profile); }}>
                <Power className="h-4 w-4 mr-1" /> Ativar
              </Button>
            )}
            {showActions === 'deactivate' && (
              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDeactivate(profile); }}>
                <Power className="h-4 w-4 mr-1" /> Desativar
              </Button>
            )}
            {showActions === 'admin' && isAdmin && (
              <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleToggleAdmin(profile); }}>
                <ShieldCheck className="h-4 w-4 mr-1" /> Remover Admin
              </Button>
            )}
          </TableCell>
        </TableRow>
        <AnimatePresence>
          {isExpanded && (
            <TableRow>
              <TableCell colSpan={5} className="p-0 border-0">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-muted/30">
                    <UserDetailPanel 
                      profile={profile} 
                      isAdmin={isAdmin}
                      onToggleAdmin={() => handleToggleAdmin(profile)}
                      canToggleAdmin={profile.status === 'ativo'}
                    />
                  </div>
                </motion.div>
              </TableCell>
            </TableRow>
          )}
        </AnimatePresence>
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <UserCog className="h-8 w-8" />
          Gerenciar Usuários
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendentes" className="gap-2">
            Pendentes
            {pendingProfiles.length > 0 && <Badge variant="secondary">{pendingProfiles.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ativos" className="gap-2">
            Ativos
            <Badge variant="outline">{activeProfiles.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inativos" className="gap-2">
            Inativos
            <Badge variant="outline">{inactiveProfiles.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="admins" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Admins
            <Badge variant="outline">{adminProfiles.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Pendentes de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProfiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum usuário pendente</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProfiles.map(profile => renderUserRow(profile, 'approve'))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ativos">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Desde</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProfiles.map(profile => renderUserRow(profile, 'deactivate'))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inativos">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              {inactiveProfiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum usuário inativo</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inactiveProfiles.map(profile => renderUserRow(profile, 'activate'))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Administradores do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Admin Desde</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminProfiles.map(profile => renderUserRow(profile, 'admin'))}
                </TableBody>
              </Table>

              {activeProfiles.filter(p => !isUserAdmin(p.user_id)).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Adicionar Novo Administrador</h4>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {activeProfiles
                      .filter(p => !isUserAdmin(p.user_id))
                      .map(profile => (
                        <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.foto_url || undefined} />
                              <AvatarFallback>{profile.nome?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{profile.nome}</span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleToggleAdmin(profile)}>
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
