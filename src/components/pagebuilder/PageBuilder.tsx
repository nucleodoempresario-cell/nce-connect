import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageBlock, PageId, AVAILABLE_PAGES } from '@/types/pageBlocks';
import { useAllPageBlocks, useReorderBlocks, useDeleteBlock, useToggleBlockVisibility } from '@/hooks/usePageBlocks';
import { BlockWrapper } from './BlockWrapper';
import { BlockSelector } from './BlockSelector';
import { BlockEditorDialog } from './BlockEditorDialog';
import { Plus } from 'lucide-react';

interface PageBuilderProps {
  initialPage?: PageId;
}

export function PageBuilder({ initialPage = 'home' }: PageBuilderProps) {
  const [selectedPage, setSelectedPage] = useState<PageId>(initialPage);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  
  const { data: blocks, isLoading } = useAllPageBlocks(selectedPage);
  const reorderBlocks = useReorderBlocks();
  const deleteBlock = useDeleteBlock();
  const toggleVisibility = useToggleBlockVisibility();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id && blocks) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const newOrder = arrayMove(blocks, oldIndex, newIndex);
      
      reorderBlocks.mutate({
        pagina: selectedPage,
        orderedIds: newOrder.map((b) => b.id),
      });
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este bloco?')) {
      deleteBlock.mutate(id);
    }
  };
  
  const handleToggleVisibility = (id: string, visivel: boolean) => {
    toggleVisibility.mutate({ id, visivel: !visivel });
  };
  
  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_PAGES.map((page) => (
          <Button
            key={page.id}
            variant={selectedPage === page.id ? 'default' : 'outline'}
            onClick={() => setSelectedPage(page.id)}
          >
            {page.nome}
          </Button>
        ))}
      </div>
      
      {/* Blocks List */}
      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : blocks && blocks.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
                  <BlockWrapper
                    key={block.id}
                    block={block}
                    onEdit={() => setEditingBlock(block)}
                    onDelete={() => handleDelete(block.id)}
                    onToggleVisibility={() => handleToggleVisibility(block.id, block.visivel)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum bloco nesta página ainda.</p>
            <p className="text-sm">Clique em "Adicionar Bloco" para começar.</p>
          </div>
        )}
        
        {/* Add Block Button */}
        <Button
          onClick={() => setSelectorOpen(true)}
          className="w-full mt-6"
          variant="outline"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Adicionar Bloco
        </Button>
      </Card>
      
      {/* Block Selector Modal */}
      <BlockSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        pagina={selectedPage}
        nextOrder={(blocks?.length || 0) + 1}
      />
      
      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditorDialog
          block={editingBlock}
          open={!!editingBlock}
          onOpenChange={(open) => !open && setEditingBlock(null)}
        />
      )}
    </div>
  );
}
