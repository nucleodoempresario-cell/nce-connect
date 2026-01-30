import { Heart, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLastHeartbeat, getNextHeartbeatDate, isAtRisk } from '@/hooks/useHeartbeat';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function HeartbeatWidget() {
  const { data: lastHeartbeat, isLoading } = useLastHeartbeat();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    );
  }
  
  const atRisk = isAtRisk(lastHeartbeat);
  const nextHeartbeat = getNextHeartbeatDate(lastHeartbeat);
  const hasHeartbeat = !!lastHeartbeat;
  
  return (
    <Card className={atRisk ? 'border-destructive/50' : 'border-green-500/50'}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Heart className={`h-4 w-4 ${atRisk ? 'text-destructive' : 'text-green-500'}`} />
          Status do Sistema
        </CardTitle>
        {atRisk ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Risco de Pausa
          </Badge>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600">
            <CheckCircle className="h-3 w-3" />
            Ativo
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Último heartbeat</p>
            {hasHeartbeat ? (
              <p className="font-medium">
                {formatDistanceToNow(new Date(lastHeartbeat.created_at), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum registro ainda</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Próximo: {format(nextHeartbeat, "dd/MM 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          
          {atRisk && (
            <p className="text-xs text-destructive">
              ⚠️ O Supabase pode pausar após 7 dias sem atividade no banco.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
