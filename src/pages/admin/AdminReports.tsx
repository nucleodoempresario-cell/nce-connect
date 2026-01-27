import { BarChart3, Users, Building2, Download, Loader2, TrendingUp, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAllProfiles } from '@/hooks/useProfiles';
import { useAllCompanies } from '@/hooks/useCompanies';
import { exportToCSV } from '@/lib/exportCSV';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function AdminReports() {
  const { data: profiles, isLoading: loadingProfiles } = useAllProfiles();
  const { data: companies, isLoading: loadingCompanies } = useAllCompanies();

  if (loadingProfiles || loadingCompanies) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Profile stats
  const profilesByStatus = [
    { name: 'Ativos', value: profiles?.filter(p => p.status === 'ativo').length || 0 },
    { name: 'Pendentes', value: profiles?.filter(p => p.status === 'pendente').length || 0 },
    { name: 'Inativos', value: profiles?.filter(p => p.status === 'inativo').length || 0 },
  ].filter(item => item.value > 0);

  const profilesByYear = profiles?.reduce((acc, p) => {
    if (p.data_entrada) {
      const year = new Date(p.data_entrada).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>) || {};

  const profilesByYearData = Object.entries(profilesByYear)
    .map(([year, count]) => ({ ano: year, membros: count }))
    .sort((a, b) => parseInt(a.ano) - parseInt(b.ano));

  const profilesByState = profiles?.reduce((acc, p) => {
    if (p.estado) {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const profilesByStateData = Object.entries(profilesByState)
    .map(([state, count]) => ({ estado: state, membros: count }))
    .sort((a, b) => b.membros - a.membros)
    .slice(0, 10);

  // Company stats
  const companiesByStatus = [
    { name: 'Publicadas', value: companies?.filter(c => c.status === 'publicado').length || 0 },
    { name: 'Pendentes', value: companies?.filter(c => c.status === 'pendente_aprovacao').length || 0 },
    { name: 'Rejeitadas', value: companies?.filter(c => c.status === 'rejeitado').length || 0 },
  ].filter(item => item.value > 0);

  const companiesBySegment = companies?.reduce((acc, c) => {
    const segmento = c.segmento || 'Não informado';
    acc[segmento] = (acc[segmento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const companiesBySegmentData = Object.entries(companiesBySegment)
    .map(([segment, count]) => ({ segmento: segment, empresas: count }))
    .sort((a, b) => b.empresas - a.empresas)
    .slice(0, 8);

  const companiesByEmployees = companies?.reduce((acc, c) => {
    const range = c.numero_funcionarios || 'Não informado';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const companiesByEmployeesData = Object.entries(companiesByEmployees)
    .map(([range, count]) => ({ faixa: range.replace(' funcionários', ''), empresas: count }))
    .sort((a, b) => b.empresas - a.empresas);

  const handleExportProfiles = () => {
    if (!profiles) return;
    const exportData = profiles.map(p => ({
      nome: p.nome,
      email: p.email,
      telefone: p.telefone,
      cargo: p.cargo,
      cidade: p.cidade,
      estado: p.estado,
      status: p.status,
      data_nascimento: p.data_nascimento,
      data_entrada: p.data_entrada,
      created_at: p.created_at,
    }));
    exportToCSV(exportData, 'nucleados');
  };

  const handleExportCompanies = () => {
    if (!companies) return;
    const exportData = companies.map(c => ({
      nome: c.nome,
      segmento: c.segmento,
      email: c.email,
      telefone: c.telefone,
      site_url: c.site_url,
      endereco: c.endereco,
      cidade: c.cidade,
      estado: c.estado,
      cep: c.cep,
      ano_fundacao: c.ano_fundacao,
      numero_funcionarios: c.numero_funcionarios,
      status: c.status,
      proprietario: c.dono?.nome,
      created_at: c.created_at,
    }));
    exportToCSV(exportData, 'empresas');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Relatórios
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportProfiles}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Nucleados
          </Button>
          <Button variant="outline" onClick={handleExportCompanies}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Empresas
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nucleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {profiles?.filter(p => p.status === 'ativo').length || 0} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {companies?.filter(c => c.status === 'publicado').length || 0} publicadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(profiles?.filter(p => p.status === 'pendente').length || 0) + 
               (companies?.filter(c => c.status === 'pendente_aprovacao').length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segmentos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(companiesBySegment).length}</div>
            <p className="text-xs text-muted-foreground">Diferentes segmentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Nucleados por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={profilesByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {profilesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresas por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={companiesByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {companiesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Membros por Ano de Entrada
            </CardTitle>
            <CardDescription>Evolução do número de nucleados</CardDescription>
          </CardHeader>
          <CardContent>
            {profilesByYearData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={profilesByYearData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="membros" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sem dados de data de entrada</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Empresas por Segmento
            </CardTitle>
            <CardDescription>Top 8 segmentos</CardDescription>
          </CardHeader>
          <CardContent>
            {companiesBySegmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={companiesBySegmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="segmento" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="empresas" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sem dados de segmento</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Nucleados por Estado
            </CardTitle>
            <CardDescription>Top 10 estados</CardDescription>
          </CardHeader>
          <CardContent>
            {profilesByStateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={profilesByStateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="estado" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="membros" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sem dados de estado</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Empresas por Número de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {companiesByEmployeesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={companiesByEmployeesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="faixa" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="empresas" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">Sem dados de funcionários</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
