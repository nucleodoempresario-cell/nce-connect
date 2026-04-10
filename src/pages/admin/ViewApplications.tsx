import { useState, useMemo, type ReactNode } from 'react';
import { Eye, Trash2, Loader2, Download, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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

function ApplicationInfoCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-2 text-sm font-medium break-words">{children}</div>
    </div>
  );
}

function formatAnswerValue(value: unknown, otherText?: unknown) {
  if (value === undefined || value === null || value === '') return '-';

  let normalized: string;

  if (typeof value === 'boolean') {
    normalized = value ? 'Sim' : 'Não';
  } else if (Array.isArray(value)) {
    normalized = value.map((item) => String(item)).join(', ');
  } else if (typeof value === 'object') {
    normalized = JSON.stringify(value);
  } else {
    normalized = String(value);
  }

  if (typeof otherText === 'string' && otherText.trim()) {
    return `${normalized}\nOutro: ${otherText.trim()}`;
  }

  return normalized;
}

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

    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'todos' || app.status === statusFilter;
      const matchesSearch =
        searchTerm === '' ||
        app.nome_candidato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.empresa_nome || '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchTerm]);

  const getFormattedAnswer = (application: Application, questionId: string) => {
    const respostas = application.respostas as Record<string, unknown>;
    return formatAnswerValue(respostas?.[questionId], respostas?.[`${questionId}__outro_text`]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (filteredApps.length > 0 && filteredApps.every((app) => selectedIds.has(app.id))) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredApps.forEach((app) => next.delete(app.id));
        return next;
      });
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredApps.forEach((app) => next.add(app.id));
      return next;
    });
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplication.mutateAsync({ id, updates: { status } });
    toast({ title: 'Status atualizado' });
  };

  const handleBulkStatus = async (status: ApplicationStatus) => {
    if (selectedIds.size === 0) return;

    const promises = Array.from(selectedIds).map((id) => updateApplication.mutateAsync({ id, updates: { status } }));
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
    const idsToExport = selectedIds.size > 0 ? selectedIds : new Set(filteredApps.map((app) => app.id));
    const appsToExport = (applications || []).filter((app) => idsToExport.has(app.id));

    const rows = appsToExport.map((app) => {
      const base: Record<string, unknown> = {
        Nome: app.nome_candidato,
        Email: app.email,
        Telefone: app.telefone || '',
        Empresa: app.empresa_nome || '',
        Status: statusLabels[app.status as ApplicationStatus] || app.status,
        Data: format(new Date(app.created_at), 'dd/MM/yyyy'),
      };

      if (questions) {
        questions.forEach((q) => {
          base[q.texto_pergunta] = getFormattedAnswer(app, q.id);
        });
      }

      return base;
    });

    exportToCSV(rows, 'inscricoes');
    toast({ title: `${rows.length} inscrição(ões) exportadas` });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const allFilteredSelected = filteredApps.length > 0 && filteredApps.every((app) => selectedIds.has(app.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inscrições</h1>
        <Badge variant="secondary">{applications?.length || 0} total</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedIds.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedIds.size} selecionado(s)</span>
            <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleBulkStatus('aprovado')}>
              <CheckCircle className="mr-1 h-4 w-4" /> Aprovar
            </Button>
            <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleBulkStatus('rejeitado')}>
              <XCircle className="mr-1 h-4 w-4" /> Reprovar
            </Button>
            <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300 hover:bg-yellow-50" onClick={() => handleBulkStatus('analisado')}>
              Em Análise
            </Button>
          </div>
        )}

        <Button size="sm" variant="outline" onClick={handleExportSelected} className="ml-auto">
          <Download className="mr-1 h-4 w-4" />
          {selectedIds.size > 0 ? `Exportar (${selectedIds.size})` : 'Exportar Todos'}
        </Button>
      </div>

      <Card>
        <CardContent className="px-0 pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">
                  <Checkbox checked={allFilteredSelected} onCheckedChange={toggleSelectAll} />
                </TableHead>
                <TableHead>Candidato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className={selectedIds.has(app.id) ? 'bg-muted/50' : ''}>
                  <TableCell className="pl-6">
                    <Checkbox checked={selectedIds.has(app.id)} onCheckedChange={() => toggleSelect(app.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{app.nome_candidato}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.empresa_nome || '-'}</TableCell>
                  <TableCell>{format(new Date(app.created_at), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Select value={app.status} onValueChange={(value) => handleStatusChange(app.id, value as ApplicationStatus)}>
                      <SelectTrigger className="h-8 w-36">
                        <Badge className={`${statusColors[app.status as ApplicationStatus]} border-0 text-xs`}>
                          {statusLabels[app.status as ApplicationStatus]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="space-x-2 pr-6 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    Nenhuma inscrição encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="flex h-[90vh] w-[min(96vw,1100px)] max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle>Detalhes da Inscrição</DialogTitle>
            <DialogDescription className="text-left">
              {selectedApp ? `${selectedApp.nome_candidato} • ${selectedApp.email}` : 'Veja os dados completos da inscrição.'}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <ApplicationInfoCard label="Nome">{selectedApp.nome_candidato}</ApplicationInfoCard>
                  <ApplicationInfoCard label="Email">{selectedApp.email}</ApplicationInfoCard>
                  <ApplicationInfoCard label="Telefone">{selectedApp.telefone || '-'}</ApplicationInfoCard>
                  <ApplicationInfoCard label="Empresa">{selectedApp.empresa_nome || '-'}</ApplicationInfoCard>
                  <ApplicationInfoCard label="Data">{format(new Date(selectedApp.created_at), 'dd/MM/yyyy')}</ApplicationInfoCard>
                  <ApplicationInfoCard label="Status">
                    <Select
                      value={selectedApp.status}
                      onValueChange={(value) => {
                        handleStatusChange(selectedApp.id, value as ApplicationStatus);
                        setSelectedApp({ ...selectedApp, status: value as ApplicationStatus });
                      }}
                    >
                      <SelectTrigger className="h-9 w-full max-w-[220px]">
                        <Badge className={`${statusColors[selectedApp.status as ApplicationStatus]} border-0 text-xs`}>
                          {statusLabels[selectedApp.status as ApplicationStatus]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ApplicationInfoCard>
                </div>

                <div className="space-y-3 border-t pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-base font-semibold">Respostas do formulário</h4>
                    <Badge variant="secondary">{questions?.length || 0} perguntas</Badge>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {questions?.map((q) => (
                      <div key={q.id} className="rounded-lg border bg-muted/40 p-4">
                        <span className="text-sm font-medium">{q.texto_pergunta}</span>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">
                          {getFormattedAnswer(selectedApp, q.id)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
