import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAllFormQuestions, useCreateFormQuestion, useDeleteFormQuestion } from '@/hooks/useFormQuestions';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type QuestionType = Database['public']['Enums']['question_type'];

export default function ManageForm() {
  const { data: questions, isLoading } = useAllFormQuestions();
  const createQuestion = useCreateFormQuestion();
  const deleteQuestion = useDeleteFormQuestion();
  const { toast } = useToast();

  const [newQuestion, setNewQuestion] = useState({
    texto_pergunta: '',
    tipo: 'texto_curto' as QuestionType,
    opcoes: '',
    obrigatoria: true,
  });

  const handleAdd = async () => {
    if (!newQuestion.texto_pergunta) return;
    
    const opcoes = newQuestion.tipo === 'multipla_escolha' 
      ? newQuestion.opcoes.split(',').map(o => o.trim()).filter(Boolean)
      : [];

    await createQuestion.mutateAsync({
      texto_pergunta: newQuestion.texto_pergunta,
      tipo: newQuestion.tipo,
      opcoes: opcoes,
      obrigatoria: newQuestion.obrigatoria,
      ordem: (questions?.length || 0) + 1,
    });

    setNewQuestion({ texto_pergunta: '', tipo: 'texto_curto', opcoes: '', obrigatoria: true });
    toast({ title: 'Pergunta adicionada!' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta pergunta?')) {
      await deleteQuestion.mutateAsync(id);
      toast({ title: 'Pergunta excluída' });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const typeLabels: Record<QuestionType, string> = {
    texto_curto: 'Texto curto',
    texto_longo: 'Texto longo',
    checkbox: 'Checkbox (Sim/Não)',
    multipla_escolha: 'Múltipla escolha',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Formulário de Inscrição</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Pergunta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Texto da pergunta</Label><Input value={newQuestion.texto_pergunta} onChange={(e) => setNewQuestion({...newQuestion, texto_pergunta: e.target.value})} placeholder="Digite a pergunta..." /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select value={newQuestion.tipo} onValueChange={(v) => setNewQuestion({...newQuestion, tipo: v as QuestionType})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch checked={newQuestion.obrigatoria} onCheckedChange={(c) => setNewQuestion({...newQuestion, obrigatoria: c})} />
              <Label>Obrigatória</Label>
            </div>
          </div>
          {newQuestion.tipo === 'multipla_escolha' && (
            <div><Label>Opções (separadas por vírgula)</Label><Input value={newQuestion.opcoes} onChange={(e) => setNewQuestion({...newQuestion, opcoes: e.target.value})} placeholder="Opção 1, Opção 2, Opção 3" /></div>
          )}
          <Button onClick={handleAdd} disabled={!newQuestion.texto_pergunta}><Plus className="h-4 w-4 mr-2" /> Adicionar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perguntas Existentes ({questions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions?.map((q, i) => (
              <div key={q.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">{i + 1}. {q.texto_pergunta}</span>
                  <div className="text-sm text-muted-foreground flex gap-2 mt-1">
                    <span>{typeLabels[q.tipo]}</span>
                    {q.obrigatoria && <span>• Obrigatória</span>}
                    {!q.ativo && <span className="text-yellow-600">• Inativa</span>}
                  </div>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
