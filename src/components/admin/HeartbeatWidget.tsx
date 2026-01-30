import { Heart, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLastHeartbeat, getNextHeartbeatDate, isAtRisk } from '@/hooks/useHeartbeat';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function HeartbeatWidget() {
  const { data: lastHeartbeat, isLoading } = useLastHeartbeat();
  
  if (isLoading) return null;
  
  const atRisk = isAtRisk(lastHeartbeat);
  const nextHeartbeat = getNextHeartbeatDate(lastHeartbeat);
  const hasHeartbeat = !!lastHeartbeat;
  
  const tooltipContent = (
    <div className="text-xs space-y-1">
      <p><strong>Último ping:</strong> {hasHeartbeat 
        ? formatDistanceToNow(new Date(lastHeartbeat.created_at), { addSuffix: true, locale: ptBR })
        : 'Nenhum'}</p>
      <p><strong>Próximo:</strong> {format(nextHeartbeat, "dd/MM 'às' HH:mm", { locale: ptBR })}</p>
      {atRisk && <p className="text-destructive">⚠️ Risco de pausa após 7 dias sem atividade</p>}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`cursor-help text-xs ${atRisk 
              ? 'border-destructive/50 text-destructive' 
              : 'border-muted text-muted-foreground'}`}
          >
            {atRisk ? (
              <AlertTriangle className="h-3 w-3 mr-1" />
            ) : (
              <Heart className="h-3 w-3 mr-1" />
            )}
            {atRisk ? 'DB Inativo' : 'DB OK'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
