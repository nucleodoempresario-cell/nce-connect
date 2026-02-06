import { useState } from 'react';
import { Check, X, Loader2, ChevronDown, ChevronRight, Building2, ShieldCheck, Power, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAllCompanies } from '@/hooks/useCompanies';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { CompanyDetailPanel } from '@/components/admin/CompanyDetailPanel';

interface CompanyData {
  id: string;
  nome: string;
  logo_url: string | null;
  descricao_curta: string | null;
  descricao_completa: string | null;
  site_url: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  ano_fundacao: number | null;
  numero_funcionarios: string | null;
  segmento: string | null;
  produtos_servicos: string | null;
  status: string;
  auto_aprovacao: boolean;
  created_at: string;
  updated_at: string;
  dono?: { id: string; nome: string; foto_url: string | null } | null;
}

export default function ManageCompanies() {
  const { data: companies, isLoading, refetch } = useAllCompanies();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    await supabase.from('companies').update({ status: 'publicado' }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    toast({ title: 'Empresa aprovada!' });
  };

  const handleReject = async (id: string) => {
    await supabase.from('companies').update({ status: 'rejeitado' }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    toast({ title: 'Empresa rejeitada' });
  };

  const handleActivate = async (id: string) => {
    await supabase.from('companies').update({ status: 'publicado' }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    toast({ title: 'Empresa ativada!' });
  };

  const handleDeactivate = async (id: string) => {
    await supabase.from('companies').update({ status: 'rejeitado' }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['companies'] });
    toast({ title: 'Empresa desativada' });
  };

  const handleDeleteCompany = async (company: CompanyData) => {
    setDeletingId(company.id);
    try {
      const { error } = await supabase.from('companies').delete().eq('id', company.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({ title: 'Empresa excluída permanentemente!' });
      setExpandedId(null);
    } catch (error: any) {
      toast({ title: 'Erro ao excluir empresa', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const allCompanies = (companies || []).map(c => ({
    ...c,
    auto_aprovacao: (c as any).auto_aprovacao ?? false
  })) as CompanyData[];
  
  const pendingCompanies = allCompanies.filter(c => c.status === 'pendente_aprovacao');
  const publishedCompanies = allCompanies.filter(c => c.status === 'publicado');
  const rejectedCompanies = allCompanies.filter(c => c.status === 'rejeitado');

  const renderCompanyRow = (company: CompanyData, showActions: 'approve' | 'activate' | 'deactivate') => {
    const isExpanded = expandedId === company.id;
    const isDeleting = deletingId === company.id;

    return (
      <Collapsible key={company.id} open={isExpanded} onOpenChange={() => setExpandedId(isExpanded ? null : company.id)}>
        <TableRow className="cursor-pointer hover:bg-muted/50">
          <TableCell>
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={company.logo_url || undefined} className="object-cover" />
                  <AvatarFallback className="rounded-lg">
                    <Building2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">{company.nome}</span>
                  {company.auto_aprovacao && (
                    <Badge variant="outline" className="ml-2 text-xs text-primary">
                      <ShieldCheck className="h-3 w-3 mr-1" />Auto
                    </Badge>
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
          </TableCell>
          <TableCell>{company.segmento || '-'}</TableCell>
          <TableCell>
            {company.dono ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={company.dono.foto_url || undefined} />
                  <AvatarFallback>{company.dono.nome?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{company.dono.nome}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </TableCell>
          <TableCell>
            {company.cidade && company.estado 
              ? `${company.cidade}/${company.estado}` 
              : '-'}
          </TableCell>
          <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
            {showActions === 'approve' && (
              <>
                <Button size="sm" onClick={() => handleApprove(company.id)}>
                  <Check className="h-4 w-4 mr-1" /> Aprovar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleReject(company.id)}>
                  <X className="h-4 w-4 mr-1" /> Rejeitar
                </Button>
              </>
            )}
            {showActions === 'activate' && (
              <Button size="sm" onClick={() => handleActivate(company.id)}>
                <Power className="h-4 w-4 mr-1" /> Ativar
              </Button>
            )}
            {showActions === 'deactivate' && (
              <Button size="sm" variant="outline" onClick={() => handleDeactivate(company.id)}>
                <Power className="h-4 w-4 mr-1" /> Desativar
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir empresa permanentemente?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A empresa <strong>{company.nome}</strong> será removida permanentemente do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => handleDeleteCompany(company)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={5} className="p-0 border-0">
            <CollapsibleContent>
              <div className="p-4 bg-muted/30">
                <CompanyDetailPanel company={company} />
              </div>
            </CollapsibleContent>
          </TableCell>
        </TableRow>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Gerenciar Empresas
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendentes" className="gap-2">
            Pendentes
            {pendingCompanies.length > 0 && <Badge variant="secondary">{pendingCompanies.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="publicadas" className="gap-2">
            Publicadas
            <Badge variant="outline">{publishedCompanies.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejeitadas" className="gap-2">
            Rejeitadas
            <Badge variant="outline">{rejectedCompanies.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Empresas Pendentes de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCompanies.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma empresa pendente</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCompanies.map(company => renderCompanyRow(company, 'approve'))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publicadas">
          <Card>
            <CardHeader>
              <CardTitle>Empresas Publicadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publishedCompanies.map(company => renderCompanyRow(company, 'deactivate'))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejeitadas">
          <Card>
            <CardHeader>
              <CardTitle>Empresas Rejeitadas/Inativas</CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedCompanies.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma empresa rejeitada</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedCompanies.map(company => renderCompanyRow(company, 'activate'))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}