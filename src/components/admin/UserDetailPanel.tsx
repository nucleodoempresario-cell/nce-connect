import { useState } from 'react';
import { format } from 'date-fns';
import { User, Mail, Phone, Briefcase, MapPin, Calendar, Globe, Edit, Save, X, ShieldCheck, ShieldOff, KeyRound, Copy, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuditHistory } from './AuditHistory';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { useToast } from '@/hooks/use-toast';
import { MaskedInput } from '@/components/ui/masked-input';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserDetailPanelProps {
  profile: Profile;
  isAdmin?: boolean;
  onToggleAdmin?: () => void;
  canToggleAdmin?: boolean;
  onClose?: () => void;
}

export function UserDetailPanel({ 
  profile, 
  isAdmin, 
  onToggleAdmin, 
  canToggleAdmin,
  onClose 
}: UserDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ 
        id: profile.id, 
        updates: {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          bio: formData.bio,
          cargo: formData.cargo,
          cidade: formData.cidade,
          estado: formData.estado,
          website: formData.website,
          data_nascimento: formData.data_nascimento,
          data_entrada: formData.data_entrada,
        }
      });
      toast({ title: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
    } catch (error) {
      toast({ title: 'Erro ao atualizar perfil', variant: 'destructive' });
    }
  };

  const statusColors = {
    ativo: 'bg-green-100 text-green-800',
    inativo: 'bg-red-100 text-red-800',
    pendente: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.foto_url || undefined} />
              <AvatarFallback className="text-lg">{profile.nome?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{profile.nome}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusColors[profile.status]}>
                  {profile.status}
                </Badge>
                {isAdmin && (
                  <Badge variant="outline" className="text-primary border-primary">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
                  <Save className="h-4 w-4 mr-1" /> Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}>
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
            )}
            {onClose && (
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><User className="h-4 w-4" /> Nome</Label>
            {isEditing ? (
              <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            ) : (
              <p className="text-sm">{profile.nome}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Mail className="h-4 w-4" /> Email</Label>
            {isEditing ? (
              <Input value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            ) : (
              <p className="text-sm">{profile.email || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Phone className="h-4 w-4" /> Telefone</Label>
            {isEditing ? (
              <MaskedInput 
                mask="phone" 
                value={formData.telefone || ''} 
                onChange={(value) => setFormData({ ...formData, telefone: value })} 
              />
            ) : (
              <p className="text-sm">{profile.telefone || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> Cargo</Label>
            {isEditing ? (
              <Input value={formData.cargo || ''} onChange={(e) => setFormData({ ...formData, cargo: e.target.value })} />
            ) : (
              <p className="text-sm">{profile.cargo || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Cidade/Estado</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input placeholder="Cidade" value={formData.cidade || ''} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} />
                <Input placeholder="UF" className="w-20" value={formData.estado || ''} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} />
              </div>
            ) : (
              <p className="text-sm">{[profile.cidade, profile.estado].filter(Boolean).join(' - ') || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Globe className="h-4 w-4" /> Website</Label>
            {isEditing ? (
              <Input value={formData.website || ''} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
            ) : (
              <p className="text-sm">{profile.website || '-'}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Informações Internas */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Informações Internas
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              {isEditing ? (
                <Input 
                  type="date" 
                  value={formData.data_nascimento || ''} 
                  onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })} 
                />
              ) : (
                <p className="text-sm">
                  {profile.data_nascimento 
                    ? format(new Date(profile.data_nascimento + 'T00:00:00'), 'dd/MM/yyyy') 
                    : '-'}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Data de Entrada no Núcleo</Label>
              {isEditing ? (
                <Input 
                  type="date" 
                  value={formData.data_entrada || ''} 
                  onChange={(e) => setFormData({ ...formData, data_entrada: e.target.value })} 
                />
              ) : (
                <p className="text-sm">
                  {profile.data_entrada 
                    ? format(new Date(profile.data_entrada), 'dd/MM/yyyy') 
                    : '-'}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Cadastro</Label>
              <p className="text-sm">{format(new Date(profile.created_at), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Última Atualização</Label>
              <p className="text-sm">{format(new Date(profile.updated_at), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {(profile.bio || isEditing) && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label>Bio</Label>
              {isEditing ? (
                <Textarea 
                  value={formData.bio || ''} 
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
              )}
            </div>
          </>
        )}

        {/* Password Reset */}
        <Separator />
        <AdminPasswordReset userId={profile.user_id} userName={profile.nome} />

        {/* Admin Control */}
        {canToggleAdmin && onToggleAdmin && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Permissão de Administrador</p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Este usuário tem acesso ao painel administrativo' : 'Este usuário não é administrador'}
                </p>
              </div>
              <Button 
                variant={isAdmin ? 'destructive' : 'default'} 
                size="sm" 
                onClick={onToggleAdmin}
              >
                {isAdmin ? (
                  <><ShieldOff className="h-4 w-4 mr-1" /> Remover Admin</>
                ) : (
                  <><ShieldCheck className="h-4 w-4 mr-1" /> Tornar Admin</>
                )}
              </Button>
            </div>
          </>
        )}

        <Separator />

        {/* Audit History */}
        <AuditHistory tabela="profiles" registroId={profile.id} />
      </CardContent>
    </Card>
  );
}

function AdminPasswordReset({ userId, userName }: { userId: string; userName: string }) {
  const [tempPassword, setTempPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(password);
  };

  const handleResetPassword = async () => {
    if (!tempPassword || tempPassword.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { user_id: userId, new_password: tempPassword },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setGeneratedPassword(tempPassword);
      setTempPassword('');
      toast({ title: 'Senha temporária definida com sucesso!' });
    } catch (error: any) {
      toast({ title: 'Erro ao redefinir senha', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({ title: 'Senha copiada!' });
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <KeyRound className="h-4 w-4" />
        Redefinir Senha
      </h4>
      <p className="text-sm text-muted-foreground">
        Gere uma senha temporária para {userName}. Informe a senha ao usuário para que ele possa acessar o sistema.
      </p>
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Senha temporária</Label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="Digite ou gere uma senha"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={generateRandomPassword}>
          Gerar
        </Button>
        <Button type="button" size="sm" onClick={handleResetPassword} disabled={isLoading || !tempPassword}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <KeyRound className="h-4 w-4 mr-1" />}
          Definir
        </Button>
      </div>
      {generatedPassword && (
        <div className="flex items-center gap-2 p-3 bg-accent/50 border border-accent rounded-md">
          <p className="text-sm flex-1">
            Senha definida: <code className="font-mono bg-accent px-2 py-0.5 rounded">{generatedPassword}</code>
          </p>
          <Button variant="ghost" size="sm" onClick={copyPassword}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
