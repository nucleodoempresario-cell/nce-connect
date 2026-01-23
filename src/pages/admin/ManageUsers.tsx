import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAllProfiles, useUpdateProfile } from '@/hooks/useProfiles';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ManageUsers() {
  const { data: profiles, isLoading } = useAllProfiles();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const handleApprove = async (id: string) => {
    await updateProfile.mutateAsync({ id, updates: { status: 'ativo' } });
    toast({ title: 'Usuário aprovado!' });
  };

  const handleReject = async (id: string) => {
    await updateProfile.mutateAsync({ id, updates: { status: 'inativo' } });
    toast({ title: 'Usuário rejeitado' });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const pendingProfiles = profiles?.filter(p => p.status === 'pendente') || [];
  const activeProfiles = profiles?.filter(p => p.status === 'ativo') || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>

      {pendingProfiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pendentes de Aprovação
              <Badge variant="secondary">{pendingProfiles.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.nome}</TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{format(new Date(profile.created_at), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => handleApprove(profile.id)}><Check className="h-4 w-4 mr-1" /> Aprovar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(profile.id)}><X className="h-4 w-4 mr-1" /> Rejeitar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usuários Ativos ({activeProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Desde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.nome}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{format(new Date(profile.created_at), 'dd/MM/yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
