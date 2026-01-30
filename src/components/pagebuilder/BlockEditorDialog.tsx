import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageBlock, BlockContent, BLOCK_TYPES } from '@/types/pageBlocks';
import { useUpdateBlock } from '@/hooks/usePageBlocks';
import { ImageUploader } from '@/components/admin/content/ImageUploader';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BlockEditorDialogProps {
  block: PageBlock;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockEditorDialog({ block, open, onOpenChange }: BlockEditorDialogProps) {
  const [content, setContent] = useState<Record<string, unknown>>(block.conteudo as Record<string, unknown>);
  const updateBlock = useUpdateBlock();
  
  useEffect(() => {
    setContent(block.conteudo as Record<string, unknown>);
  }, [block]);
  
  const blockType = BLOCK_TYPES.find((t) => t.tipo === block.tipo_bloco);
  
  const handleSave = async () => {
    await updateBlock.mutateAsync({
      id: block.id,
      conteudo: content as BlockContent,
    });
    onOpenChange(false);
  };
  
  const updateField = (key: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };
  
  const updateNestedField = (parentKey: string, childKey: string, value: unknown) => {
    setContent((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] as Record<string, unknown> || {}),
        [childKey]: value,
      },
    }));
  };
  
  const updateArrayItem = (key: string, index: number, field: string, value: unknown) => {
    setContent((prev) => {
      const arr = [...(prev[key] as unknown[] || [])];
      arr[index] = { ...(arr[index] as Record<string, unknown>), [field]: value };
      return { ...prev, [key]: arr };
    });
  };
  
  const addArrayItem = (key: string, defaultItem: Record<string, unknown>) => {
    setContent((prev) => ({
      ...prev,
      [key]: [...(prev[key] as unknown[] || []), defaultItem],
    }));
  };
  
  const removeArrayItem = (key: string, index: number) => {
    setContent((prev) => ({
      ...prev,
      [key]: (prev[key] as unknown[]).filter((_, i) => i !== index),
    }));
  };
  
  // Render fields based on block type
  const renderFields = () => {
    switch (block.tipo_bloco) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Badge (texto pequeno acima do título)</Label>
              <Input
                value={(content.badge as string) || ''}
                onChange={(e) => updateField('badge', e.target.value)}
                placeholder="Ex: Rede de Empresários"
              />
            </div>
            <div>
              <Label>Título Principal</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Textarea
                value={(content.subtitulo as string) || ''}
                onChange={(e) => updateField('subtitulo', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Imagem de Fundo</Label>
              <ImageUploader
                value={(content.imagem_url as string) || ''}
                onChange={(url) => updateField('imagem_url', url)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão Primário - Texto</Label>
                <Input
                  value={((content.botao_primario as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao_primario', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão Primário - Link</Label>
                <Input
                  value={((content.botao_primario as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao_primario', 'link', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão Secundário - Texto</Label>
                <Input
                  value={((content.botao_secundario as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao_secundario', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão Secundário - Link</Label>
                <Input
                  value={((content.botao_secundario as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao_secundario', 'link', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estatística - Número</Label>
                <Input
                  value={((content.estatistica as Record<string, string>)?.numero) || ''}
                  onChange={(e) => updateNestedField('estatistica', 'numero', e.target.value)}
                  placeholder="Ex: 50+"
                />
              </div>
              <div>
                <Label>Estatística - Label</Label>
                <Input
                  value={((content.estatistica as Record<string, string>)?.label) || ''}
                  onChange={(e) => updateNestedField('estatistica', 'label', e.target.value)}
                  placeholder="Ex: Empresários"
                />
              </div>
            </div>
          </div>
        );
        
      case 'features':
      case 'cards_icone':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título da Seção</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={(content.subtitulo as string) || ''}
                onChange={(e) => updateField('subtitulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Cards</Label>
              <div className="space-y-4 mt-2">
                {(content.cards as Record<string, string>[] || []).map((card, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Card {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('cards', index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      <Input
                        placeholder="Ícone (ex: Star, Target, Heart)"
                        value={card.icon || ''}
                        onChange={(e) => updateArrayItem('cards', index, 'icon', e.target.value)}
                      />
                      <Input
                        placeholder="Título"
                        value={card.titulo || ''}
                        onChange={(e) => updateArrayItem('cards', index, 'titulo', e.target.value)}
                      />
                      <Textarea
                        placeholder="Descrição"
                        value={card.descricao || ''}
                        onChange={(e) => updateArrayItem('cards', index, 'descricao', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('cards', { icon: 'Star', titulo: '', descricao: '' })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Card
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'texto_imagem':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={(content.descricao as string) || ''}
                onChange={(e) => updateField('descricao', e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label>Imagem</Label>
              <ImageUploader
                value={(content.imagem_url as string) || ''}
                onChange={(url) => updateField('imagem_url', url)}
              />
            </div>
            <div>
              <Label>Posição da Imagem</Label>
              <Select
                value={(content.imagem_lado as string) || 'esquerda'}
                onValueChange={(value) => updateField('imagem_lado', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esquerda">Esquerda</SelectItem>
                  <SelectItem value="direita">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Features / Destaques</Label>
              <div className="space-y-3 mt-2">
                {(content.features as Record<string, string>[] || []).map((feature, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Feature {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('features', index)}
                        className="text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Input
                        placeholder="Ícone (ex: Shield, Network)"
                        value={feature.icon || ''}
                        onChange={(e) => updateArrayItem('features', index, 'icon', e.target.value)}
                        className="h-9"
                      />
                      <Input
                        placeholder="Título"
                        value={feature.titulo || ''}
                        onChange={(e) => updateArrayItem('features', index, 'titulo', e.target.value)}
                        className="h-9"
                      />
                      <Input
                        placeholder="Descrição"
                        value={feature.descricao || ''}
                        onChange={(e) => updateArrayItem('features', index, 'descricao', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('features', { icon: '', titulo: '', descricao: '' })}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Feature
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão - Texto</Label>
                <Input
                  value={((content.botao as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão - Link</Label>
                <Input
                  value={((content.botao as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao', 'link', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'lista_beneficios':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={(content.subtitulo as string) || ''}
                onChange={(e) => updateField('subtitulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={(content.descricao as string) || ''}
                onChange={(e) => updateField('descricao', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Imagem (opcional)</Label>
              <ImageUploader
                value={(content.imagem_url as string) || ''}
                onChange={(url) => updateField('imagem_url', url)}
              />
            </div>
            <div>
              <Label>Estilo</Label>
              <Select
                value={(content.estilo as string) || 'check'}
                onValueChange={(value) => updateField('estilo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check">Com checkmarks</SelectItem>
                  <SelectItem value="numerado">Numerado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Itens da Lista</Label>
              <div className="space-y-2 mt-2">
                {(content.itens as string[] || []).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItens = [...(content.itens as string[])];
                        newItens[index] = e.target.value;
                        updateField('itens', newItens);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItens = (content.itens as string[]).filter((_, i) => i !== index);
                        updateField('itens', newItens);
                      }}
                      className="text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateField('itens', [...(content.itens as string[] || []), ''])}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </div>
            <div>
              <Label>Nota (opcional)</Label>
              <Textarea
                value={(content.nota as string) || ''}
                onChange={(e) => updateField('nota', e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão - Texto</Label>
                <Input
                  value={((content.botao as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão - Link</Label>
                <Input
                  value={((content.botao as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao', 'link', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Textarea
                value={(content.subtitulo as string) || ''}
                onChange={(e) => updateField('subtitulo', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Estilo</Label>
              <Select
                value={(content.estilo as string) || 'claro'}
                onValueChange={(value) => updateField('estilo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claro">Claro (fundo primário)</SelectItem>
                  <SelectItem value="escuro">Escuro (fundo escuro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão Primário - Texto</Label>
                <Input
                  value={((content.botao_primario as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao_primario', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão Primário - Link</Label>
                <Input
                  value={((content.botao_primario as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao_primario', 'link', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão Secundário - Texto</Label>
                <Input
                  value={((content.botao_secundario as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao_secundario', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão Secundário - Link</Label>
                <Input
                  value={((content.botao_secundario as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao_secundario', 'link', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'embed':
        return (
          <div className="space-y-4">
            <div>
              <Label>Tipo de Conteúdo</Label>
              <Select
                value={(content.tipo as string) || 'empresas'}
                onValueChange={(value) => updateField('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresas">Empresas</SelectItem>
                  <SelectItem value="membros">Membros</SelectItem>
                  <SelectItem value="noticias">Notícias</SelectItem>
                  <SelectItem value="formulario_candidatura">Formulário de Candidatura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título da Seção</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={(content.subtitulo as string) || ''}
                onChange={(e) => updateField('subtitulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Limite de itens</Label>
              <Input
                type="number"
                value={(content.limite as number) || 3}
                onChange={(e) => updateField('limite', parseInt(e.target.value) || 3)}
                min={1}
                max={12}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Botão - Texto</Label>
                <Input
                  value={((content.botao as Record<string, string>)?.texto) || ''}
                  onChange={(e) => updateNestedField('botao', 'texto', e.target.value)}
                />
              </div>
              <div>
                <Label>Botão - Link</Label>
                <Input
                  value={((content.botao as Record<string, string>)?.link) || ''}
                  onChange={(e) => updateNestedField('botao', 'link', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'texto_simples':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={(content.titulo as string) || ''}
                onChange={(e) => updateField('titulo', e.target.value)}
              />
            </div>
            <div>
              <Label>Conteúdo (HTML)</Label>
              <Textarea
                value={(content.conteudo as string) || ''}
                onChange={(e) => updateField('conteudo', e.target.value)}
                rows={8}
                placeholder="<p>Seu conteúdo aqui...</p>"
              />
            </div>
          </div>
        );
        
      case 'divisor':
        return (
          <div className="space-y-4">
            <div>
              <Label>Estilo</Label>
              <Select
                value={(content.estilo as string) || 'linha'}
                onValueChange={(value) => updateField('estilo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linha">Linha</SelectItem>
                  <SelectItem value="espaco">Espaço em branco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(content.estilo as string) === 'espaco' && (
              <div>
                <Label>Altura (multiplicador)</Label>
                <Input
                  type="number"
                  value={(content.altura as number) || 1}
                  onChange={(e) => updateField('altura', parseInt(e.target.value) || 1)}
                  min={1}
                  max={10}
                />
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Editor não disponível para este tipo de bloco.
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar: {blockType?.nome || block.tipo_bloco}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderFields()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updateBlock.isPending}>
            {updateBlock.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
