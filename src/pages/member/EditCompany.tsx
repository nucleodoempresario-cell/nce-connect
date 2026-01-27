import { useState, useEffect } from 'react';
import { Loader2, Upload, AlertCircle, CheckCircle, Clock, Building2, MapPin, Phone, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useMyCompany, useCreateCompany, useUpdateCompany } from '@/hooks/useCompanies';
import { uploadFile } from '@/lib/uploadFile';
import { useToast } from '@/hooks/use-toast';

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const NUMERO_FUNCIONARIOS = [
  'Apenas eu',
  '2-5 funcionários',
  '6-10 funcionários',
  '11-50 funcionários',
  '51-100 funcionários',
  '101-500 funcionários',
  'Mais de 500 funcionários'
];

export default function EditCompany() {
  const { profile } = useAuth();
  const { data: company, isLoading: loadingCompany } = useMyCompany(profile?.id);
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao_curta: '',
    descricao_completa: '',
    segmento: '',
    site_url: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    ano_fundacao: '',
    numero_funcionarios: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  });

  useEffect(() => {
    if (company) {
      const redes = (company.redes_sociais as Record<string, string>) || {};
      const companyAny = company as Record<string, unknown>;
      setFormData({
        nome: company.nome || '',
        descricao_curta: company.descricao_curta || '',
        descricao_completa: company.descricao_completa || '',
        segmento: (companyAny.segmento as string) || '',
        site_url: company.site_url || '',
        telefone: (companyAny.telefone as string) || '',
        email: (companyAny.email as string) || '',
        endereco: (companyAny.endereco as string) || '',
        cidade: (companyAny.cidade as string) || '',
        estado: (companyAny.estado as string) || '',
        cep: (companyAny.cep as string) || '',
        ano_fundacao: (companyAny.ano_fundacao as number)?.toString() || '',
        numero_funcionarios: (companyAny.numero_funcionarios as string) || '',
        instagram: redes.instagram || '',
        linkedin: redes.linkedin || '',
        facebook: redes.facebook || '',
      });
    }
  }, [company]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;
    
    setIsLoading(true);
    const url = await uploadFile(file, 'company-logos', company.id);
    if (url) {
      await updateCompany.mutateAsync({ id: company.id, updates: { logo_url: url } });
      toast({ title: 'Logo atualizado!' });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const data = {
        nome: formData.nome,
        descricao_curta: formData.descricao_curta,
        descricao_completa: formData.descricao_completa,
        segmento: formData.segmento,
        site_url: formData.site_url,
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
        ano_fundacao: formData.ano_fundacao ? parseInt(formData.ano_fundacao) : null,
        numero_funcionarios: formData.numero_funcionarios,
        redes_sociais: { instagram: formData.instagram, linkedin: formData.linkedin, facebook: formData.facebook },
      };

      if (company) {
        await updateCompany.mutateAsync({ id: company.id, updates: data });
      } else {
        await createCompany.mutateAsync({ ...data, dono_id: profile.id });
      }
      toast({ title: 'Empresa salva com sucesso!', description: 'Aguardando aprovação do administrador.' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  if (loadingCompany) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const statusConfig = {
    publicado: { icon: <CheckCircle className="h-4 w-4 text-primary" />, label: 'Publicada', bg: 'bg-primary/10' },
    pendente_aprovacao: { icon: <Clock className="h-4 w-4 text-accent" />, label: 'Pendente', bg: 'bg-accent/10' },
    rejeitado: { icon: <AlertCircle className="h-4 w-4 text-destructive" />, label: 'Rejeitada', bg: 'bg-destructive/10' },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Minha Empresa
            </span>
            {company && (
              <span className={`flex items-center gap-2 text-sm font-normal px-3 py-1 rounded-full ${statusConfig[company.status].bg}`}>
                {statusConfig[company.status].icon}
                {statusConfig[company.status].label}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Gerencie as informações da sua empresa que aparecerão no site do NCE
          </CardDescription>
        </CardHeader>
        <CardContent>
          {company?.status === 'pendente_aprovacao' && (
            <Alert className="mb-6 border-accent/50 bg-accent/10">
              <Clock className="h-4 w-4" />
              <AlertDescription>Suas alterações estão aguardando aprovação do administrador.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo */}
            {company && (
              <>
                <div className="flex items-center gap-6">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden flex items-center justify-center ring-4 ring-primary/10">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt="" className="max-w-full max-h-full object-contain p-2" />
                    ) : (
                      <span className="text-4xl font-bold text-muted-foreground">{formData.nome?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                        <Upload className="h-4 w-4" /> Alterar logo da empresa
                      </div>
                    </Label>
                    <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <p className="text-xs text-muted-foreground">PNG ou JPG. Preferencialmente fundo transparente.</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Informações Básicas
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa *</Label>
                  <Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="segmento">Segmento de Atuação</Label>
                  <Input id="segmento" placeholder="Ex: Tecnologia, Saúde, Varejo..." value={formData.segmento} onChange={(e) => setFormData({...formData, segmento: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao_curta">Descrição curta</Label>
                <Input id="descricao_curta" value={formData.descricao_curta} onChange={(e) => setFormData({...formData, descricao_curta: e.target.value})} placeholder="Uma frase que resume sua empresa" maxLength={150} />
                <p className="text-xs text-muted-foreground">{formData.descricao_curta.length}/150 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao_completa">Descrição completa</Label>
                <Textarea 
                  id="descricao_completa" 
                  rows={5} 
                  value={formData.descricao_completa} 
                  onChange={(e) => setFormData({...formData, descricao_completa: e.target.value})} 
                  placeholder="Conte a história da sua empresa, seus valores, diferenciais e o que vocês fazem..."
                />
              </div>
            </div>

            <Separator />

            {/* Dados da Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Dados da Empresa
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ano_fundacao">Ano de Fundação</Label>
                  <Input 
                    id="ano_fundacao" 
                    type="number" 
                    min="1900" 
                    max={new Date().getFullYear()} 
                    placeholder="Ex: 2010" 
                    value={formData.ano_fundacao} 
                    onChange={(e) => setFormData({...formData, ano_fundacao: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero_funcionarios">Número de Funcionários</Label>
                  <Select value={formData.numero_funcionarios} onValueChange={(value) => setFormData({...formData, numero_funcionarios: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {NUMERO_FUNCIONARIOS.map((num) => (
                        <SelectItem key={num} value={num}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contato
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone_empresa">Telefone</Label>
                  <Input id="telefone_empresa" placeholder="(00) 0000-0000" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_empresa">E-mail</Label>
                  <Input id="email_empresa" type="email" placeholder="contato@empresa.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Endereço
              </h3>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Rua, número, bairro..." value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade_empresa">Cidade</Label>
                  <Input id="cidade_empresa" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado_empresa">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BRASIL.map((uf) => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" value={formData.cep} onChange={(e) => setFormData({...formData, cep: e.target.value})} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Site e Redes Sociais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Site e Redes Sociais
              </h3>
              <div className="space-y-2">
                <Label htmlFor="site_url">Website</Label>
                <Input id="site_url" type="url" value={formData.site_url} onChange={(e) => setFormData({...formData, site_url: e.target.value})} placeholder="https://www.suaempresa.com.br" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_empresa">Instagram</Label>
                  <Input id="instagram_empresa" placeholder="https://instagram.com/..." value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_empresa">LinkedIn</Label>
                  <Input id="linkedin_empresa" placeholder="https://linkedin.com/company/..." value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_empresa">Facebook</Label>
                  <Input id="facebook_empresa" placeholder="https://facebook.com/..." value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {company ? 'Salvar Alterações' : 'Cadastrar Empresa'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
