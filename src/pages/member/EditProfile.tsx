import { useState, useEffect } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    instagram: '',
    linkedin: '',
    facebook: '',
  });

  useEffect(() => {
    if (profile) {
      const redes = (profile.redes_sociais as Record<string, string>) || {};
      setFormData({
        nome: profile.nome || '',
        bio: profile.bio || '',
        telefone: profile.telefone || '',
        email: profile.email || '',
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
          redes_sociais: {
            instagram: formData.instagram,
            linkedin: formData.linkedin,
            facebook: formData.facebook,
          },
        },
      });
      await refreshProfile();
      toast({ title: 'Perfil atualizado!' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-muted overflow-hidden">
              {profile?.foto_url ? (
                <img src={profile.foto_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">{formData.nome?.charAt(0)}</div>
              )}
            </div>
            <div>
              <Label htmlFor="photo" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Upload className="h-4 w-4" /> Alterar foto
                </div>
              </Label>
              <input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div><Label htmlFor="nome">Nome completo</Label><Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} /></div>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
            <div><Label htmlFor="telefone">Telefone</Label><Input id="telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} /></div>
          </div>

          <div><Label htmlFor="bio">Biografia</Label><Textarea id="bio" rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></div>

          <div className="grid md:grid-cols-3 gap-4">
            <div><Label htmlFor="instagram">Instagram</Label><Input id="instagram" placeholder="https://instagram.com/..." value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} /></div>
            <div><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} /></div>
            <div><Label htmlFor="facebook">Facebook</Label><Input id="facebook" placeholder="https://facebook.com/..." value={formData.facebook} onChange={(e) => setFormData({...formData, facebook: e.target.value})} /></div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
