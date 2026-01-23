import { Users, Building2, Newspaper, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllProfiles } from '@/hooks/useProfiles';
import { useAllCompanies } from '@/hooks/useCompanies';
import { useAllNews } from '@/hooks/useNews';
import { useApplications } from '@/hooks/useApplications';

export default function AdminDashboard() {
  const { data: profiles } = useAllProfiles();
  const { data: companies } = useAllCompanies();
  const { data: news } = useAllNews();
  const { data: applications } = useApplications();

  const pendingUsers = profiles?.filter(p => p.status === 'pendente').length || 0;
  const pendingCompanies = companies?.filter(c => c.status === 'pendente_aprovacao').length || 0;
  const newApplications = applications?.filter(a => a.status === 'novo').length || 0;

  const stats = [
    { label: 'Usuários Ativos', value: profiles?.filter(p => p.status === 'ativo').length || 0, icon: Users, pending: pendingUsers, pendingLabel: 'pendentes' },
    { label: 'Empresas', value: companies?.filter(c => c.status === 'publicado').length || 0, icon: Building2, pending: pendingCompanies, pendingLabel: 'pendentes' },
    { label: 'Notícias', value: news?.filter(n => n.publicado).length || 0, icon: Newspaper },
    { label: 'Inscrições', value: applications?.length || 0, icon: ClipboardList, pending: newApplications, pendingLabel: 'novas' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, pending, pendingLabel }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
              {pending !== undefined && pending > 0 && (
                <p className="text-sm text-yellow-600 mt-1">{pending} {pendingLabel}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
