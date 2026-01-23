import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAllCompanies, useUpdateCompany } from '@/hooks/useCompanies';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function ManageCompanies() {
  const { data: companies, isLoading, refetch } = useAllCompanies();
  const { toast } = useToast();

  const handleApprove = async (id: string) => {
    await supabase.from('companies').update({ status: 'publicado' }).eq('id', id);
    refetch();
    toast({ title: 'Empresa aprovada!' });
  };

  const handleReject = async (id: string) => {
    await supabase.from('companies').update({ status: 'rejeitado' }).eq('id', id);
    refetch();
    toast({ title: 'Empresa rejeitada' });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const pendingCompanies = companies?.filter(c => c.status === 'pendente_aprovacao') || [];
  const publishedCompanies = companies?.filter(c => c.status === 'publicado') || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gerenciar Empresas</h1>

      {pendingCompanies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Pendentes de Aprovação
              <Badge variant="secondary">{pendingCompanies.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.nome}</TableCell>
                    <TableCell>{company.dono?.nome || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => handleApprove(company.id)}><Check className="h-4 w-4 mr-1" /> Aprovar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(company.id)}><X className="h-4 w-4 mr-1" /> Rejeitar</Button>
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
          <CardTitle>Empresas Publicadas ({publishedCompanies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Proprietário</TableHead>
                <TableHead>Site</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publishedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.nome}</TableCell>
                  <TableCell>{company.dono?.nome || '-'}</TableCell>
                  <TableCell>{company.site_url ? <a href={company.site_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visitar</a> : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
