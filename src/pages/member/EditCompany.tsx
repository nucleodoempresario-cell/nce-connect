import { useState, useEffect } from 'react';
import { Loader2, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useMyCompany, useCreateCompany, useUpdateCompany } from '@/hooks/useCompanies';
import { uploadFile } from '@/lib/uploadFile';
import { useToast } from '@/hooks/use-toast';

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
    site_url: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  });

  useEffect(() => {
    if (company) {
      const redes = (company.redes_sociais as Record<string, string>) || {};
      setFormData({
        nome: company.nome || '',
        descricao_curta: company.descricao_curta || '',
        descricao_completa: company.descricao_completa || '',
        site_url: company.site_url || '',
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
        site_url: formData.site_url,
        redes_sociais: { instagram: formData.instagram, linkedin: formData.linkedin, facebook: formData.facebook },
      };

      if (company) {
        await updateCompany.mutateAsync({ id: company.id, updates: data });
      } else {
        await createCompany.mutateAsync({ ...data, dono_id: profile.id });
      }
      toast({ title: 'Empresa salva!', description: 'Aguardando aprovação do administrador.' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  if (loadingCompany) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const statusIcons = {
    publicado: <CheckCircle className="h-4 w-4 text-green-500" />,
    pendente_aprovacao: <Clock className="h-4 w-4 text-yellow-500" />,
    rejeitado: <AlertCircle className="h-4 w-4 text-red-500" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Minha Empresa
          {company && (
            <span className="flex items-center gap-2 text-sm font-normal">
              {statusIcons[company.status]}
              {company.status === 'publicado' ? 'Publicada' : company.status === 'pendente_aprovacao' ? 'Pendente' : 'Rejeitada'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {company?.status === 'pendente_aprovacao' && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>Suas alterações estão aguardando aprovação do administrador.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {company && (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                {company.logo_url ? (
                  <img src={company.logo_url} alt="" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">{formData.nome?.charAt(0)}</span>
                )}
              </div>
              <div>
                <Label htmlFor="logo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Upload className="h-4 w-4" /> Alterar logo
                  </div>
                </Label>
                <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
            </div>
          )}

          <div><Label htmlFor="nome">Nome da Empresa *</Label><Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required /></div>
          <div><Label htmlFor="descricao_curta">Descrição curta</Label><Input id="descricao_curta" value={formData.descricao_curta} onChange={(e) => setFormData({...formData, descricao_curta: e.target.value})} placeholder="Uma frase sobre sua empresa" /></div>
          <div><Label htmlFor="descricao_completa">Descrição completa</Label><Textarea id="descricao_completa" rows={4} value={formData.descricao_completa} onChange={(e) => setFormData({...formData, descricao_completa: e.target.value})} /></div>
          <div><Label htmlFor="site_url">Site</Label><Input id="site_url" type="url" value={formData.site_url} onChange={(e) => setFormData({...formData, site_url: e.target.value})} placeholder="https://..." /></div>

          <div className="grid md:grid-cols-3 gap-4">
            <div><Label htmlFor="instagram">Instagram</Label><Input id="instagram" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} /></div>
            <div><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} /></div>
            <div><Label htmlFor="facebook">Facebook</Label><Input id="facebook" value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} /></div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {company ? 'Salvar Alterações' : 'Cadastrar Empresa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
