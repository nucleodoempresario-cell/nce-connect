import { useState, useMemo } from 'react';
import { Eye, Trash2, Loader2, Download, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApplications, useUpdateApplication, useDeleteApplication } from '@/hooks/useApplications';
import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/lib/exportCSV';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

const statusLabels: Record<ApplicationStatus, string> = {
  novo: 'Novo',
  analisado: 'Em Análise',
  aprovado: 'Aprovado',
  rejeitado: 'Reprovado',
};

const statusColors: Record<ApplicationStatus, string> = {
  novo: 'bg-blue-100 text-blue-800',
  analisado: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800',
};

export default function ViewApplications() {
  const { data: applications, isLoading } = useApplications();
  const { data: questions } = useFormQuestions();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = useMemo(() => {
    if (!applications) return [];
    return applications.filter(app => {
      const matchesStatus = statusFilter === 'todos' || app.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        app.nome_candidato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.empresa_nome || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchTerm]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApps.map(a => a.id)));
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplication.mutateAsync({ id, updates: { status } });
    toast({ title: 'Status atualizado' });
  };

  const handleBulkStatus = async (status: ApplicationStatus) => {
    if (selectedIds.size === 0) return;
    const promises = Array.from(selectedIds).map(id =>
      updateApplication.mutateAsync({ id, updates: { status } })
    );
    await Promise.all(promises);
    setSelectedIds(new Set());
    toast({ title: `${promises.length} inscrição(ões) atualizadas para "${statusLabels[status]}"` });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta inscrição?')) {
      await deleteApplication.mutateAsync(id);
      toast({ title: 'Inscrição excluída' });
    }
  };

  const handleExportSelected = () => {
    const idsToExport = selectedIds.size > 0 ? selectedIds : new Set(filteredApps.map(a => a.id));
    const appsToExport = (applications || []).filter(a => idsToExport.has(a.id));

    const rows = appsToExport.map(app => {
      const base: Record<string, unknown> = {
        Nome: app.nome_candidato,
        Email: app.email,
        Telefone: app.telefone || '',
        Empresa: app.empresa_nome || '',
        Status: statusLabels[app.status as ApplicationStatus] || app.status,
        Data: format(new Date(app.created_at), 'dd/MM/yyyy'),
      };
      // Add dynamic question answers
      if (questions) {
        questions.forEach(q => {
          const answer = (app.respostas as Record<string, string | boolean>)?.[q.id];
          base[q.texto_pergunta] = answer !== undefined
            ? (typeof answer === 'boolean' ? (answer ? 'Sim' : 'Não') : String(answer))
            : '';
        });
      }
      return base;
    });

    exportToCSV(rows, 'inscricoes');
    toast({ title: `${rows.length} inscrição(ões) exportadas` });
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inscrições</h1>
        <Badge variant="secondary">{applications?.length || 0} total</Badge>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">{selectedIds.size} selecionado(s)</span>
            <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleBulkStatus('aprovado')}>
              <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
            </Button>
            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleBulkStatus('rejeitado')}>
              <XCircle className="h-4 w-4 mr-1" /> Reprovar
            </Button>
            <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300 hover:bg-yellow-50" onClick={() => handleBulkStatus('analisado')}>
              Em Análise
            </Button>
          </div>
        )}

        <Button size="sm" variant="outline" onClick={handleExportSelected} className="ml-auto">
          <Download className="h-4 w-4 mr-1" />
          {selectedIds.size > 0 ? `Exportar (${selectedIds.size})` : 'Exportar Todos'}
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    checked={filteredApps.length > 0 && selectedIds.size === filteredApps.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Candidato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className={selectedIds.has(app.id) ? 'bg-muted/50' : ''}>
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedIds.has(app.id)}
                      onCheckedChange={() => toggleSelect(app.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{app.nome_candidato}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.empresa_nome || '-'}</TableCell>
                  <TableCell>{format(new Date(app.created_at), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}>
                      <SelectTrigger className="w-36 h-8">
                        <Badge className={`${statusColors[app.status as ApplicationStatus]} border-0 text-xs`}>
                          {statusLabels[app.status as ApplicationStatus]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right space-x-2 pr-6">
                    <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma inscrição encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog with scroll fix */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Detalhes da Inscrição</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-sm text-muted-foreground">Nome</span><p className="font-medium">{selectedApp.nome_candidato}</p></div>
                  <div><span className="text-sm text-muted-foreground">Email</span><p className="font-medium">{selectedApp.email}</p></div>
                  <div><span className="text-sm text-muted-foreground">Telefone</span><p className="font-medium">{selectedApp.telefone || '-'}</p></div>
                  <div><span className="text-sm text-muted-foreground">Empresa</span><p className="font-medium">{selectedApp.empresa_nome || '-'}</p></div>
                  <div><span className="text-sm text-muted-foreground">Data</span><p className="font-medium">{format(new Date(selectedApp.created_at), 'dd/MM/yyyy')}</p></div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="mt-1">
                      <Select value={selectedApp.status} onValueChange={(v) => {
                        handleStatusChange(selectedApp.id, v as ApplicationStatus);
                        setSelectedApp({ ...selectedApp, status: v as ApplicationStatus });
                      }}>
                        <SelectTrigger className="w-40 h-8">
                          <Badge className={`${statusColors[selectedApp.status as ApplicationStatus]} border-0 text-xs`}>
                            {statusLabels[selectedApp.status as ApplicationStatus]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Respostas</h4>
                  <div className="space-y-3">
                    {questions?.map((q) => {
                      const answer = (selectedApp.respostas as Record<string, string | boolean>)?.[q.id];
                      return (
                        <div key={q.id} className="bg-muted p-3 rounded-lg">
                          <span className="text-sm font-medium">{q.texto_pergunta}</span>
                          <p className="mt-1">{answer !== undefined ? (typeof answer === 'boolean' ? (answer ? 'Sim' : 'Não') : String(answer)) : '-'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
