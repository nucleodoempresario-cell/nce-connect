import { useState } from 'react';
import { CalendarDays, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, getMonth, getDate, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { exportToCSV } from '@/lib/exportCSV';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface BirthdayPeriodReportProps {
  profiles: Profile[] | undefined;
}

export function BirthdayPeriodReport({ profiles }: BirthdayPeriodReportProps) {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

  const getBirthdaysInPeriod = () => {
    if (!profiles) return [];

    const startMonth = getMonth(startDate);
    const startDay = getDate(startDate);
    const endMonth = getMonth(endDate);
    const endDay = getDate(endDate);

    return profiles
      .filter(p => {
        if (!p.data_nascimento || p.status !== 'ativo') return false;
        
        const birthDate = new Date(p.data_nascimento + 'T00:00:00');
        const birthMonth = getMonth(birthDate);
        const birthDay = getDate(birthDate);

        // Handle same month range
        if (startMonth === endMonth) {
          return birthMonth === startMonth && birthDay >= startDay && birthDay <= endDay;
        }

        // Handle cross-year period (e.g., December to February)
        if (startMonth > endMonth) {
          return (
            (birthMonth === startMonth && birthDay >= startDay) ||
            (birthMonth > startMonth) ||
            (birthMonth < endMonth) ||
            (birthMonth === endMonth && birthDay <= endDay)
          );
        }

        // Handle normal period within the same year
        return (
          (birthMonth === startMonth && birthDay >= startDay) ||
          (birthMonth > startMonth && birthMonth < endMonth) ||
          (birthMonth === endMonth && birthDay <= endDay)
        );
      })
      .map(p => ({
        ...p,
        birthMonth: getMonth(new Date(p.data_nascimento + 'T00:00:00')),
        birthDay: getDate(new Date(p.data_nascimento + 'T00:00:00')),
      }))
      .sort((a, b) => {
        if (a.birthMonth !== b.birthMonth) return a.birthMonth - b.birthMonth;
        return a.birthDay - b.birthDay;
      });
  };

  const birthdaysInPeriod = getBirthdaysInPeriod();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleExport = () => {
    if (birthdaysInPeriod.length === 0) return;
    
    const exportData = birthdaysInPeriod.map(p => ({
      nome: p.nome,
      email: p.email,
      telefone: p.telefone,
      cargo: p.cargo,
      data_nascimento: p.data_nascimento,
      cidade: p.cidade,
      estado: p.estado,
    }));
    
    exportToCSV(exportData, `aniversariantes_${format(startDate, 'dd-MM')}_a_${format(endDate, 'dd-MM')}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Aniversariantes do Período
            </CardTitle>
            <CardDescription>
              Selecione o período para consultar aniversariantes
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={birthdaysInPeriod.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">De:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {format(startDate, 'dd/MM', { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Até:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {format(endDate, 'dd/MM', { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {birthdaysInPeriod.length} aniversariante{birthdaysInPeriod.length !== 1 ? 's' : ''} encontrado{birthdaysInPeriod.length !== 1 ? 's' : ''}
        </div>

        {birthdaysInPeriod.length > 0 ? (
          <div className="rounded-md border max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Contato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {birthdaysInPeriod.map(profile => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile.foto_url || undefined} alt={profile.nome} />
                          <AvatarFallback className="text-xs">{getInitials(profile.nome)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{profile.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {profile.cargo || '-'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(profile.data_nascimento + 'T00:00:00'), 'dd/MM')}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {profile.email || profile.telefone || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nenhum aniversariante no período selecionado
          </p>
        )}
      </CardContent>
    </Card>
  );
}
