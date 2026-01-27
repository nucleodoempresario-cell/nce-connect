import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, ArrowRight } from 'lucide-react';
import { useRecordAuditLog, type AuditLogEntry } from '@/hooks/useAuditLog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AuditHistoryProps {
  tabela: string;
  registroId: string;
}

function getActionLabel(acao: string) {
  switch (acao) {
    case 'INSERT': return { label: 'Criado', variant: 'default' as const };
    case 'UPDATE': return { label: 'Atualizado', variant: 'secondary' as const };
    case 'DELETE': return { label: 'Removido', variant: 'destructive' as const };
    default: return { label: acao, variant: 'outline' as const };
  }
}

function getChangedFields(entry: AuditLogEntry): string[] {
  if (!entry.dados_anteriores || !entry.dados_novos) return [];
  
  const changed: string[] = [];
  const previous = entry.dados_anteriores as Record<string, unknown>;
  const current = entry.dados_novos as Record<string, unknown>;
  
  for (const key of Object.keys(current)) {
    if (key === 'updated_at') continue;
    if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) {
      changed.push(key);
    }
  }
  
  return changed;
}

function formatFieldName(field: string): string {
  const names: Record<string, string> = {
    nome: 'Nome',
    email: 'Email',
    telefone: 'Telefone',
    bio: 'Bio',
    cargo: 'Cargo',
    cidade: 'Cidade',
    estado: 'Estado',
    status: 'Status',
    foto_url: 'Foto',
    logo_url: 'Logo',
    descricao_curta: 'Descrição curta',
    descricao_completa: 'Descrição completa',
    site_url: 'Site',
    endereco: 'Endereço',
    cep: 'CEP',
    ano_fundacao: 'Ano de fundação',
    numero_funcionarios: 'Funcionários',
    segmento: 'Segmento',
    produtos_servicos: 'Produtos/Serviços',
    redes_sociais: 'Redes sociais',
    campos_visiveis: 'Visibilidade',
    auto_aprovacao: 'Auto-aprovação',
  };
  return names[field] || field;
}

export function AuditHistory({ tabela, registroId }: AuditHistoryProps) {
  const { data: logs, isLoading } = useRecordAuditLog(tabela, registroId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando histórico...</div>;
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <History className="h-4 w-4" />
        Nenhuma alteração registrada
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <History className="h-4 w-4" />
        Histórico de Alterações
      </h4>
      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {logs.map((entry) => {
            const action = getActionLabel(entry.acao);
            const changedFields = getChangedFields(entry);
            
            return (
              <div key={entry.id} className="border-l-2 border-muted pl-3 py-1">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant={action.variant} className="text-xs">
                    {action.label}
                  </Badge>
                  <span className="text-muted-foreground">
                    {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                {changedFields.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Campos alterados: {changedFields.map(formatFieldName).join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
