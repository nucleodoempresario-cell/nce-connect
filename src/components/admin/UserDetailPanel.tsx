import { useState } from 'react';
import { format } from 'date-fns';
import { User, Mail, Phone, Briefcase, MapPin, Calendar, Globe, Edit, Save, X, ShieldCheck, ShieldOff } from 'lucide-react';
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
                    ? format(new Date(profile.data_nascimento), 'dd/MM/yyyy') 
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
