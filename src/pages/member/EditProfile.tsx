import { useState, useEffect } from 'react';
import { Loader2, Upload, User, MapPin, Calendar, Briefcase, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { uploadFile } from '@/lib/uploadFile';
import { useToast } from '@/hooks/use-toast';

export default function EditProfile() {
  const { profile, user, refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    bio: '',
    telefone: '',
    email: '',
    cargo: '',
    cidade: '',
    estado: '',
    website: '',
    data_nascimento: '',
    data_entrada: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  });

  useEffect(() => {
    if (profile) {
      const redes = (profile.redes_sociais as Record<string, string>) || {};
      const profileAny = profile as Record<string, unknown>;
      setFormData({
        nome: profile.nome || '',
        bio: profile.bio || '',
        telefone: profile.telefone || '',
        email: profile.email || '',
        cargo: (profileAny.cargo as string) || '',
        cidade: (profileAny.cidade as string) || '',
        estado: (profileAny.estado as string) || '',
        website: (profileAny.website as string) || '',
        data_nascimento: (profileAny.data_nascimento as string) || '',
        data_entrada: (profileAny.data_entrada as string) || '',
        instagram: redes.instagram || '',
        linkedin: redes.linkedin || '',
        facebook: redes.facebook || '',
      });
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !user) return;
    
    setIsLoading(true);
    const url = await uploadFile(file, 'avatars', user.id);
    if (url) {
      await updateProfile.mutateAsync({ id: profile.id, updates: { foto_url: url } });
      await refreshProfile();
      toast({ title: 'Foto atualizada!' });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsLoading(true);
    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        updates: {
          nome: formData.nome,
          bio: formData.bio,
          telefone: formData.telefone,
          email: formData.email,
          cargo: formData.cargo,
          cidade: formData.cidade,
          estado: formData.estado,
          website: formData.website,
          data_nascimento: formData.data_nascimento || null,
          data_entrada: formData.data_entrada || null,
          redes_sociais: {
            instagram: formData.instagram,
            linkedin: formData.linkedin,
            facebook: formData.facebook,
          },
        } as Record<string, unknown>,
      });
      await refreshProfile();
      toast({ title: 'Perfil atualizado com sucesso!' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meu Perfil
          </CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais que aparecerão no site do NCE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Foto de Perfil */}
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden ring-4 ring-primary/10">
                {profile?.foto_url ? (
                  <img src={profile.foto_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">{formData.nome?.charAt(0)}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                    <Upload className="h-4 w-4" /> Alterar foto de perfil
                  </div>
                </Label>
                <input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
              </div>
            </div>

            <Separator />

            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Informações Básicas
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo / Função</Label>
                  <Input id="cargo" placeholder="Ex: CEO, Diretor, Sócio..." value={formData.cargo} onChange={(e) => setFormData({...formData, cargo: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  placeholder="Conte um pouco sobre você, sua trajetória e experiência profissional..."
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                />
                <p className="text-xs text-muted-foreground">Esta informação será exibida publicamente no site.</p>
              </div>
            </div>

            <Separator />

            {/* Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Localização
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" placeholder="Sua cidade" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input id="estado" placeholder="Ex: PR, SP, SC..." value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Datas Importantes (interno) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Informações Internas
              </h3>
              <p className="text-sm text-muted-foreground">Estas informações são apenas para controle interno e não serão exibidas publicamente.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input 
                    id="data_nascimento" 
                    type="date" 
                    value={formData.data_nascimento} 
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_entrada">Data de Entrada no NCE</Label>
                  <Input 
                    id="data_entrada" 
                    type="date" 
                    value={formData.data_entrada} 
                    onChange={(e) => setFormData({...formData, data_entrada: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Redes Sociais e Website */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Redes Sociais e Website
              </h3>
              <div className="space-y-2">
                <Label htmlFor="website">Website Pessoal</Label>
                <Input id="website" type="url" placeholder="https://seusite.com" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="https://instagram.com/..." value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" placeholder="https://facebook.com/..." value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
