import { useState } from 'react';
import { Plus, Trash2, Loader2, Pencil, GripVertical, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAllFormQuestions, useCreateFormQuestion, useUpdateFormQuestion, useDeleteFormQuestion } from '@/hooks/useFormQuestions';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type QuestionType = Database['public']['Enums']['question_type'];
type FormQuestion = Database['public']['Tables']['form_questions']['Row'];

const typeLabels: Record<QuestionType, string> = {
  texto_curto: 'Texto curto',
  texto_longo: 'Texto longo',
  checkbox: 'Checkbox (Sim/Não)',
  multipla_escolha: 'Múltipla escolha',
};

interface SortableQuestionProps {
  question: FormQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableQuestion({ question, index, onEdit, onDelete }: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-background rounded">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1 min-w-0">
        <span className="font-medium">{index + 1}. {question.texto_pergunta}</span>
        <div className="text-sm text-muted-foreground flex gap-2 mt-1 flex-wrap">
          <span>{typeLabels[question.tipo]}</span>
          {question.obrigatoria && <span className="text-primary">• Obrigatória</span>}
          {!question.ativo && <span className="text-yellow-600">• Inativa</span>}
          {question.tipo === 'multipla_escolha' && question.opcoes && (
            <span className="text-xs">• {(question.opcoes as string[]).length} opções</span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function ManageForm() {
  const { data: questions, isLoading } = useAllFormQuestions();
  const createQuestion = useCreateFormQuestion();
  const updateQuestion = useUpdateFormQuestion();
  const deleteQuestion = useDeleteFormQuestion();
  const { toast } = useToast();

  const [newQuestion, setNewQuestion] = useState({
    texto_pergunta: '',
    tipo: 'texto_curto' as QuestionType,
    opcoes: '',
    obrigatoria: true,
  });

  const [editingQuestion, setEditingQuestion] = useState<FormQuestion | null>(null);
  const [editForm, setEditForm] = useState({
    texto_pergunta: '',
    tipo: 'texto_curto' as QuestionType,
    opcoes: '',
    obrigatoria: true,
    ativo: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleEdit = (question: FormQuestion) => {
    setEditingQuestion(question);
    setEditForm({
      texto_pergunta: question.texto_pergunta,
      tipo: question.tipo,
      opcoes: question.tipo === 'multipla_escolha' && question.opcoes 
        ? (question.opcoes as string[]).join(', ') 
        : '',
      obrigatoria: question.obrigatoria,
      ativo: question.ativo,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingQuestion || !editForm.texto_pergunta) return;
    
    const opcoes = editForm.tipo === 'multipla_escolha' 
      ? editForm.opcoes.split(',').map(o => o.trim()).filter(Boolean)
      : [];

    await updateQuestion.mutateAsync({
      id: editingQuestion.id,
      updates: {
        texto_pergunta: editForm.texto_pergunta,
        tipo: editForm.tipo,
        opcoes: opcoes,
        obrigatoria: editForm.obrigatoria,
        ativo: editForm.ativo,
      },
    });

    setEditingQuestion(null);
    toast({ title: 'Pergunta atualizada!' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta pergunta?')) {
      await deleteQuestion.mutateAsync(id);
      toast({ title: 'Pergunta excluída' });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && questions) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);
      
      const reordered = arrayMove(questions, oldIndex, newIndex);
      
      // Update ordem for all affected questions
      for (let i = 0; i < reordered.length; i++) {
        if (reordered[i].ordem !== i + 1) {
          await updateQuestion.mutateAsync({
            id: reordered[i].id,
            updates: { ordem: i + 1 },
          });
        }
      }
      
      toast({ title: 'Ordem atualizada!' });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Formulário de Inscrição</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Pergunta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Texto da pergunta</Label>
            <Input 
              value={newQuestion.texto_pergunta} 
              onChange={(e) => setNewQuestion({...newQuestion, texto_pergunta: e.target.value})} 
              placeholder="Digite a pergunta..." 
            />
          </div>
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
            <div>
              <Label>Opções (separadas por vírgula)</Label>
              <Input 
                value={newQuestion.opcoes} 
                onChange={(e) => setNewQuestion({...newQuestion, opcoes: e.target.value})} 
                placeholder="Opção 1, Opção 2, Opção 3" 
              />
            </div>
          )}
          <Button onClick={handleAdd} disabled={!newQuestion.texto_pergunta || createQuestion.isPending}>
            {createQuestion.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Adicionar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perguntas Existentes ({questions?.length || 0})</CardTitle>
          <p className="text-sm text-muted-foreground">Arraste para reordenar as perguntas</p>
        </CardHeader>
        <CardContent>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={questions?.map(q => q.id) || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {questions?.map((q, i) => (
                  <SortableQuestion 
                    key={q.id} 
                    question={q} 
                    index={i}
                    onEdit={() => handleEdit(q)}
                    onDelete={() => handleDelete(q.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {(!questions || questions.length === 0) && (
            <p className="text-center text-muted-foreground py-8">Nenhuma pergunta cadastrada</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pergunta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Texto da pergunta</Label>
              <Input 
                value={editForm.texto_pergunta} 
                onChange={(e) => setEditForm({...editForm, texto_pergunta: e.target.value})} 
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={editForm.tipo} onValueChange={(v) => setEditForm({...editForm, tipo: v as QuestionType})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editForm.tipo === 'multipla_escolha' && (
              <div>
                <Label>Opções (separadas por vírgula)</Label>
                <Input 
                  value={editForm.opcoes} 
                  onChange={(e) => setEditForm({...editForm, opcoes: e.target.value})} 
                  placeholder="Opção 1, Opção 2, Opção 3" 
                />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={editForm.obrigatoria} onCheckedChange={(c) => setEditForm({...editForm, obrigatoria: c})} />
                <Label>Obrigatória</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editForm.ativo} onCheckedChange={(c) => setEditForm({...editForm, ativo: c})} />
                <Label>Ativa</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editForm.texto_pergunta || updateQuestion.isPending}>
              {updateQuestion.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
