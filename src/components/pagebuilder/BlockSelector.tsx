import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { BLOCK_TYPES, BlockType, PageId } from '@/types/pageBlocks';
import { useCreateBlock } from '@/hooks/usePageBlocks';
import * as LucideIcons from 'lucide-react';

interface BlockSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pagina: PageId;
  nextOrder: number;
}

const getBlockIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || LucideIcons.Box;
};

// Default content for each block type
const getDefaultContent = (tipo: BlockType) => {
  switch (tipo) {
    case 'hero':
      return {
        titulo: 'Título Principal',
        subtitulo: 'Subtítulo da seção hero',
      };
    case 'features':
      return {
        titulo: 'Título da Seção',
        cards: [
          { icon: 'Star', titulo: 'Card 1', descricao: 'Descrição do card 1' },
          { icon: 'Star', titulo: 'Card 2', descricao: 'Descrição do card 2' },
          { icon: 'Star', titulo: 'Card 3', descricao: 'Descrição do card 3' },
        ],
      };
    case 'texto_imagem':
      return {
        titulo: 'Título da Seção',
        descricao: 'Descrição do conteúdo...',
        imagem_lado: 'esquerda',
      };
    case 'lista_beneficios':
      return {
        titulo: 'Título da Lista',
        itens: ['Item 1', 'Item 2', 'Item 3'],
      };
    case 'cta':
      return {
        titulo: 'Chamada para Ação',
        subtitulo: 'Descrição do CTA',
        botao_primario: { texto: 'Ação Principal', link: '/' },
      };
    case 'cards_icone':
      return {
        titulo: 'Grid de Cards',
        cards: [
          { icon: 'Star', titulo: 'Card 1', descricao: 'Descrição' },
        ],
      };
    case 'texto_simples':
      return {
        titulo: 'Título',
        conteudo: '<p>Seu conteúdo aqui...</p>',
      };
    case 'galeria':
      return {
        titulo: 'Galeria',
        imagens: [],
      };
    case 'divisor':
      return {
        estilo: 'linha',
      };
    case 'embed':
      return {
        tipo: 'empresas',
        titulo: 'Título da Seção',
        limite: 3,
      };
    default:
      return {};
  }
};

export function BlockSelector({ open, onOpenChange, pagina, nextOrder }: BlockSelectorProps) {
  const createBlock = useCreateBlock();
  
  const handleSelect = async (tipo: BlockType) => {
    await createBlock.mutateAsync({
      pagina,
      tipo_bloco: tipo,
      ordem: nextOrder,
      conteudo: getDefaultContent(tipo) as unknown as import('@/types/pageBlocks').BlockContent,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Bloco</DialogTitle>
        </DialogHeader>
        
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {BLOCK_TYPES.map((blockType) => {
            const Icon = getBlockIcon(blockType.icon);
            return (
              <Card
                key={blockType.tipo}
                className="p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleSelect(blockType.tipo)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{blockType.nome}</h3>
                    <p className="text-sm text-muted-foreground">{blockType.descricao}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
