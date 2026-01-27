import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface StringListEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  maxItems?: number;
  placeholder?: string;
  label?: string;
}

export function StringListEditor({
  value,
  onChange,
  maxItems = 10,
  placeholder = 'Digite um item...',
}: StringListEditorProps) {
  const handleUpdate = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  const handleAdd = () => {
    if (value.length < maxItems) {
      onChange([...value, '']);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            value={item}
            onChange={(e) => handleUpdate(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            onClick={() => handleRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {value.length < maxItems && (
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      )}
    </div>
  );
}
