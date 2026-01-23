import { useState } from 'react';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplications, useUpdateApplication, useDeleteApplication } from '@/hooks/useApplications';
import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationStatus = Database['public']['Enums']['application_status'];

export default function ViewApplications() {
  const { data: applications, isLoading } = useApplications();
  const { data: questions } = useFormQuestions();
  const updateApplication = useUpdateApplication();
  const deleteApplication = useDeleteApplication();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplication.mutateAsync({ id, updates: { status } });
    toast({ title: 'Status atualizado' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta inscrição?')) {
      await deleteApplication.mutateAsync(id);
      toast({ title: 'Inscrição excluída' });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const statusColors: Record<ApplicationStatus, string> = {
    novo: 'bg-blue-100 text-blue-800',
    analisado: 'bg-yellow-100 text-yellow-800',
    aprovado: 'bg-green-100 text-green-800',
    rejeitado: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<ApplicationStatus, string> = {
    novo: 'Novo',
    analisado: 'Analisado',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Inscrições</h1>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.nome_candidato}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.empresa_nome || '-'}</TableCell>
                  <TableCell>{format(new Date(app.created_at), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Inscrição</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-muted-foreground">Nome</span><p className="font-medium">{selectedApp.nome_candidato}</p></div>
                <div><span className="text-sm text-muted-foreground">Email</span><p className="font-medium">{selectedApp.email}</p></div>
                <div><span className="text-sm text-muted-foreground">Telefone</span><p className="font-medium">{selectedApp.telefone || '-'}</p></div>
                <div><span className="text-sm text-muted-foreground">Empresa</span><p className="font-medium">{selectedApp.empresa_nome || '-'}</p></div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Respostas</h4>
                <div className="space-y-3">
                  {questions?.map((q) => {
                    const answer = (selectedApp.respostas as Record<string, string | boolean>)?.[q.id];
                    return (
                      <div key={q.id} className="bg-muted p-3 rounded-lg">
                        <span className="text-sm font-medium">{q.texto_pergunta}</span>
                        <p className="mt-1">{answer !== undefined ? (typeof answer === 'boolean' ? (answer ? 'Sim' : 'Não') : answer) : '-'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
