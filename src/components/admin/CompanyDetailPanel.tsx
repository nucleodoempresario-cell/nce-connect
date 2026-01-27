import { useState } from 'react';
import { format } from 'date-fns';
import { Building2, Mail, Phone, MapPin, Globe, Calendar, Users, Edit, Save, X, ShieldCheck, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuditHistory } from './AuditHistory';
import { MaskedInput } from '@/components/ui/masked-input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Company {
  id: string;
  nome: string;
  logo_url: string | null;
  descricao_curta: string | null;
  descricao_completa: string | null;
  site_url: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  ano_fundacao: number | null;
  numero_funcionarios: string | null;
  segmento: string | null;
  produtos_servicos: string | null;
  status: string;
  auto_aprovacao: boolean;
  created_at: string;
  updated_at: string;
  dono?: { id: string; nome: string; foto_url: string | null } | null;
}

interface CompanyDetailPanelProps {
  company: Company;
  onClose?: () => void;
}

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const employeeRanges = [
  '1-10 funcionários',
  '11-50 funcionários',
  '51-200 funcionários',
  '201-500 funcionários',
  '500+ funcionários'
];

export function CompanyDetailPanel({ company, onClose }: CompanyDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(company);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          nome: formData.nome,
          descricao_curta: formData.descricao_curta,
          descricao_completa: formData.descricao_completa,
          site_url: formData.site_url,
          telefone: formData.telefone,
          email: formData.email,
          endereco: formData.endereco,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          ano_fundacao: formData.ano_fundacao,
          numero_funcionarios: formData.numero_funcionarios,
          segmento: formData.segmento,
          produtos_servicos: formData.produtos_servicos,
          auto_aprovacao: formData.auto_aprovacao,
        })
        .eq('id', company.id);
      
      if (error) throw error;
      
      toast({ title: 'Empresa atualizada com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsEditing(false);
    } catch (error) {
      toast({ title: 'Erro ao atualizar empresa', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAutoApproval = async () => {
    try {
      const newValue = !formData.auto_aprovacao;
      await supabase
        .from('companies')
        .update({ auto_aprovacao: newValue })
        .eq('id', company.id);
      
      setFormData({ ...formData, auto_aprovacao: newValue });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({ 
        title: newValue 
          ? 'Auto-aprovação ativada' 
          : 'Auto-aprovação desativada' 
      });
    } catch (error) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    }
  };

  const statusColors = {
    publicado: 'bg-green-100 text-green-800',
    rejeitado: 'bg-red-100 text-red-800',
    pendente_aprovacao: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={company.logo_url || undefined} className="object-cover" />
              <AvatarFallback className="rounded-lg text-lg">
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{company.nome}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusColors[company.status as keyof typeof statusColors] || 'bg-gray-100'}>
                  {company.status === 'pendente_aprovacao' ? 'Pendente' : company.status}
                </Badge>
                {formData.auto_aprovacao && (
                  <Badge variant="outline" className="text-primary border-primary">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Auto-aprovação
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-1" /> Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setFormData(company);
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
        {/* Proprietário */}
        {company.dono && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={company.dono.foto_url || undefined} />
              <AvatarFallback>{company.dono.nome?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{company.dono.nome}</p>
              <p className="text-xs text-muted-foreground">Proprietário</p>
            </div>
          </div>
        )}

        {/* Informações Básicas */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Building2 className="h-4 w-4" /> Nome</Label>
            {isEditing ? (
              <Input value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            ) : (
              <p className="text-sm">{company.nome}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> Segmento</Label>
            {isEditing ? (
              <Input value={formData.segmento || ''} onChange={(e) => setFormData({ ...formData, segmento: e.target.value })} />
            ) : (
              <p className="text-sm">{company.segmento || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Mail className="h-4 w-4" /> Email</Label>
            {isEditing ? (
              <Input value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            ) : (
              <p className="text-sm">{company.email || '-'}</p>
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
              <p className="text-sm">{company.telefone || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Globe className="h-4 w-4" /> Website</Label>
            {isEditing ? (
              <Input value={formData.site_url || ''} onChange={(e) => setFormData({ ...formData, site_url: e.target.value })} />
            ) : (
              <p className="text-sm">{company.site_url || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Ano de Fundação</Label>
            {isEditing ? (
              <Input 
                type="number" 
                value={formData.ano_fundacao || ''} 
                onChange={(e) => setFormData({ ...formData, ano_fundacao: e.target.value ? parseInt(e.target.value) : null })} 
              />
            ) : (
              <p className="text-sm">{company.ano_fundacao || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Users className="h-4 w-4" /> Funcionários</Label>
            {isEditing ? (
              <Select 
                value={formData.numero_funcionarios || ''} 
                onValueChange={(value) => setFormData({ ...formData, numero_funcionarios: value })}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {employeeRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm">{company.numero_funcionarios || '-'}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Endereço */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço</Label>
              {isEditing ? (
                <Input value={formData.endereco || ''} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
              ) : (
                <p className="text-sm">{company.endereco || '-'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Cidade</Label>
              {isEditing ? (
                <Input value={formData.cidade || ''} onChange={(e) => setFormData({ ...formData, cidade: e.target.value })} />
              ) : (
                <p className="text-sm">{company.cidade || '-'}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="space-y-2 flex-1">
                <Label>Estado</Label>
                {isEditing ? (
                  <Select 
                    value={formData.estado || ''} 
                    onValueChange={(value) => setFormData({ ...formData, estado: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map(uf => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">{company.estado || '-'}</p>
                )}
              </div>
              
              <div className="space-y-2 w-32">
                <Label>CEP</Label>
                {isEditing ? (
                  <MaskedInput 
                    mask="cep" 
                    value={formData.cep || ''} 
                    onChange={(value) => setFormData({ ...formData, cep: value })} 
                  />
                ) : (
                  <p className="text-sm">{company.cep || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Descrições */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Descrições
          </h4>
          
          <div className="space-y-2">
            <Label>Descrição Curta</Label>
            {isEditing ? (
              <Textarea 
                value={formData.descricao_curta || ''} 
                onChange={(e) => setFormData({ ...formData, descricao_curta: e.target.value })}
                rows={2}
              />
            ) : (
              <p className="text-sm">{company.descricao_curta || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Descrição Completa</Label>
            {isEditing ? (
              <Textarea 
                value={formData.descricao_completa || ''} 
                onChange={(e) => setFormData({ ...formData, descricao_completa: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{company.descricao_completa || '-'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Produtos e Serviços</Label>
            {isEditing ? (
              <Textarea 
                value={formData.produtos_servicos || ''} 
                onChange={(e) => setFormData({ ...formData, produtos_servicos: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{company.produtos_servicos || '-'}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Auto-aprovação */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="font-medium">Auto-aprovação de Alterações</p>
            <p className="text-sm text-muted-foreground">
              Quando ativado, alterações feitas pelo proprietário são aprovadas automaticamente
            </p>
          </div>
          <Switch 
            checked={formData.auto_aprovacao} 
            onCheckedChange={handleToggleAutoApproval}
          />
        </div>

        <Separator />

        {/* Audit History */}
        <AuditHistory tabela="companies" registroId={company.id} />
      </CardContent>
    </Card>
  );
}
