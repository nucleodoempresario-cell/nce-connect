import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageBlock, BLOCK_TYPES } from '@/types/pageBlocks';
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface BlockWrapperProps {
  block: PageBlock;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

const getBlockIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || LucideIcons.Box;
};

export function BlockWrapper({ block, onEdit, onDelete, onToggleVisibility }: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const blockType = BLOCK_TYPES.find((t) => t.tipo === block.tipo_bloco);
  const BlockIcon = blockType ? getBlockIcon(blockType.icon) : LucideIcons.Box;
  
  // Extract a preview/title from the block content
  const getBlockPreview = () => {
    const content = block.conteudo as Record<string, unknown>;
    if (content.titulo) return content.titulo as string;
    if (content.badge) return content.badge as string;
    if (content.tipo) return `Embed: ${content.tipo}`;
    return blockType?.nome || block.tipo_bloco;
  };
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${!block.visivel ? 'opacity-60 bg-muted' : ''}`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        
        {/* Block Icon */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BlockIcon className="h-5 w-5 text-primary" />
        </div>
        
        {/* Block Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              {blockType?.nome || block.tipo_bloco}
            </Badge>
            {!block.visivel && (
              <Badge variant="outline" className="text-xs">
                Oculto
              </Badge>
            )}
          </div>
          <p className="text-sm text-foreground truncate">
            {getBlockPreview()}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
            title={block.visivel ? 'Ocultar bloco' : 'Mostrar bloco'}
          >
            {block.visivel ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            title="Editar bloco"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Remover bloco"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
