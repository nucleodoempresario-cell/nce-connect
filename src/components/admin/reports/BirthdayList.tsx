import { Cake, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, getMonth, getDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface BirthdayListProps {
  profiles: Profile[] | undefined;
}

export function BirthdayList({ profiles }: BirthdayListProps) {
  const currentMonth = new Date().getMonth();
  const currentDay = getDate(new Date());

  const birthdaysThisMonth = profiles
    ?.filter(p => {
      if (!p.data_nascimento || p.status !== 'ativo') return false;
      const birthMonth = getMonth(new Date(p.data_nascimento + 'T00:00:00'));
      return birthMonth === currentMonth;
    })
    .map(p => ({
      ...p,
      birthDay: getDate(new Date(p.data_nascimento + 'T00:00:00')),
    }))
    .sort((a, b) => a.birthDay - b.birthDay) || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cake className="h-5 w-5 text-primary" />
          Aniversariantes do Mês
        </CardTitle>
        <CardDescription>
          {format(new Date(), 'MMMM yyyy', { locale: ptBR })} - {birthdaysThisMonth.length} aniversariante{birthdaysThisMonth.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {birthdaysThisMonth.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {birthdaysThisMonth.map(profile => {
              const isToday = profile.birthDay === currentDay;
              const isPast = profile.birthDay < currentDay;
              
              return (
                <div
                  key={profile.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isToday 
                      ? 'bg-primary/10 border-primary/30' 
                      : isPast 
                        ? 'bg-muted/50 opacity-60' 
                        : 'bg-background'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.foto_url || undefined} alt={profile.nome} />
                    <AvatarFallback>{getInitials(profile.nome)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{profile.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.cargo || 'Membro'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={isToday ? 'default' : 'outline'} className="gap-1">
                      {isToday && <Gift className="h-3 w-3" />}
                      {format(new Date(profile.data_nascimento + 'T00:00:00'), 'dd/MM')}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nenhum aniversariante este mês
          </p>
        )}
      </CardContent>
    </Card>
  );
}
