import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { IconSelector } from './IconSelector';

export interface FeatureItem {
  icon?: string;
  titulo: string;
  descricao: string;
}

interface InternalFeatureItem {
  icon: string;
  titulo: string;
  descricao: string;
}

interface FeatureListEditorProps {
  value: FeatureItem[];
  onChange: (features: InternalFeatureItem[]) => void;
  showIcon?: boolean;
  maxItems?: number;
  itemLabel?: string;
}

export function FeatureListEditor({
  value,
  onChange,
  showIcon = true,
  maxItems = 5,
  itemLabel = 'Item',
}: FeatureListEditorProps) {
  const handleUpdate = (index: number, field: keyof InternalFeatureItem, newValue: string) => {
    const updated = [...value].map((item) => ({
      icon: item.icon || 'Star',
      titulo: item.titulo,
      descricao: item.descricao,
    }));
    updated[index] = { ...updated[index], [field]: newValue };
    onChange(updated);
  };

  const handleAdd = () => {
    if (value.length < maxItems) {
      const normalized = value.map(item => ({
        icon: item.icon || 'Star',
        titulo: item.titulo,
        descricao: item.descricao,
      }));
      onChange([...normalized, { icon: 'Star', titulo: '', descricao: '' }]);
    }
  };

  const handleRemove = (index: number) => {
    const normalized = value
      .filter((_, i) => i !== index)
      .map(item => ({
        icon: item.icon || 'Star',
        titulo: item.titulo,
        descricao: item.descricao,
      }));
    onChange(normalized);
  };

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <Card key={index} className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="text-muted-foreground mt-2">
              <GripVertical className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {itemLabel} {index + 1}
                </span>
              </div>
              
              {showIcon && (
                <div>
                  <Label className="text-xs">Ícone</Label>
                  <IconSelector 
                    value={item.icon || 'Star'} 
                    onChange={(icon) => handleUpdate(index, 'icon', icon)} 
                  />
                </div>
              )}
              
              <div>
                <Label className="text-xs">Título</Label>
                <Input
                  value={item.titulo}
                  onChange={(e) => handleUpdate(index, 'titulo', e.target.value)}
                  placeholder="Título do item"
                />
              </div>
              
              <div>
                <Label className="text-xs">Descrição</Label>
                <Textarea
                  value={item.descricao}
                  onChange={(e) => handleUpdate(index, 'descricao', e.target.value)}
                  placeholder="Descrição do item"
                  rows={2}
                />
              </div>
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      
      {value.length < maxItems && (
        <Button variant="outline" className="w-full" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar {itemLabel}
        </Button>
      )}
    </div>
  );
}
