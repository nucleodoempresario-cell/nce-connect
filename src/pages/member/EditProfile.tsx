import { useState, useEffect } from 'react';
import { Loader2, Upload, User, Calendar, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { MaskedInput } from '@/components/ui/masked-input';
import { SocialInput } from '@/components/ui/social-input';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { uploadFile } from '@/lib/uploadFile';
import { optimizeAvatar } from '@/lib/imageOptimizer';
import { normalizeAllSocialLinks } from '@/lib/socialLinks';
import { useToast } from '@/hooks/use-toast';

const VISIBILITY_FIELDS = [
  { key: 'bio', label: 'Biografia' },
  { key: 'cargo', label: 'Cargo / Função' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'E-mail' },
  { key: 'website', label: 'Website Pessoal' },
  { key: 'redes_sociais', label: 'Redes Sociais' },
];

const DEFAULT_VISIBILITY = {
  bio: true,
  telefone: true,
  email: true,
  cargo: true,
  website: true,
  redes_sociais: true,
};

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
    website: '',
    data_nascimento: '',
    data_entrada: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  });

  const [visibility, setVisibility] = useState<Record<string, boolean>>(DEFAULT_VISIBILITY);

  useEffect(() => {
    if (profile) {
      const redes = (profile.redes_sociais as Record<string, string>) || {};
      const profileAny = profile as Record<string, unknown>;
      const camposVisiveis = (profileAny.campos_visiveis as Record<string, boolean>) || DEFAULT_VISIBILITY;
      
      setFormData({
        nome: profile.nome || '',
        bio: profile.bio || '',
        telefone: profile.telefone || '',
        email: profile.email || '',
        cargo: (profileAny.cargo as string) || '',
        website: (profileAny.website as string) || '',
        data_nascimento: (profileAny.data_nascimento as string) || '',
        data_entrada: (profileAny.data_entrada as string) || '',
        instagram: redes.instagram || '',
        linkedin: redes.linkedin || '',
        facebook: redes.facebook || '',
      });
      
      setVisibility({ ...DEFAULT_VISIBILITY, ...camposVisiveis });
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !user) return;
    
    setIsLoading(true);
    try {
      // Optimize image before upload
      const optimizedFile = await optimizeAvatar(file);
      const url = await uploadFile(optimizedFile, 'avatars', user.id);
      if (url) {
        await updateProfile.mutateAsync({ id: profile.id, updates: { foto_url: url } });
        await refreshProfile();
        toast({ title: 'Foto atualizada!' });
      }
    } catch (error) {
      toast({ title: 'Erro ao enviar foto', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const normalizedSocial = normalizeAllSocialLinks({
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        facebook: formData.facebook,
      });

      await updateProfile.mutateAsync({
        id: profile.id,
        updates: {
          nome: formData.nome,
          bio: formData.bio,
          telefone: formData.telefone,
          email: formData.email,
          cargo: formData.cargo,
          website: formData.website,
          data_nascimento: formData.data_nascimento || null,
          data_entrada: formData.data_entrada || null,
          redes_sociais: normalizedSocial,
          campos_visiveis: visibility,
        } as Record<string, unknown>,
      });
      await refreshProfile();
      toast({ title: 'Perfil atualizado com sucesso!' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  const toggleVisibility = (key: string) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
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
                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. A imagem será otimizada automaticamente.</p>
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
                  <MaskedInput 
                    mask="phone"
                    id="telefone" 
                    placeholder="(00) 00000-0000" 
                    value={formData.telefone} 
                    onChange={(value) => setFormData({...formData, telefone: value})} 
                  />
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
              <p className="text-sm text-muted-foreground">Você pode inserir o link completo ou apenas o @usuário.</p>
              <div className="space-y-2">
                <Label htmlFor="website">Website Pessoal</Label>
                <Input id="website" type="url" placeholder="https://seusite.com" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <SocialInput 
                    platform="instagram"
                    id="instagram" 
                    value={formData.instagram} 
                    onChange={(value) => setFormData({...formData, instagram: value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <SocialInput 
                    platform="linkedin"
                    id="linkedin" 
                    value={formData.linkedin} 
                    onChange={(value) => setFormData({...formData, linkedin: value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <SocialInput 
                    platform="facebook"
                    id="facebook" 
                    value={formData.facebook} 
                    onChange={(value) => setFormData({...formData, facebook: value})} 
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Visibilidade do Perfil */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Visibilidade do Perfil
              </h3>
              <p className="text-sm text-muted-foreground">
                Escolha quais informações devem aparecer no seu perfil público. Desmarque os campos que não deseja exibir.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {VISIBILITY_FIELDS.map((field) => (
                  <div key={field.key} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`visibility-${field.key}`}
                      checked={visibility[field.key] ?? true}
                      onCheckedChange={() => toggleVisibility(field.key)}
                    />
                    <Label 
                      htmlFor={`visibility-${field.key}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {field.label}
                    </Label>
                  </div>
                ))}
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
