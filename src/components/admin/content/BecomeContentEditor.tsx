import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionEditor } from './SectionEditor';
import { FeatureListEditor } from './FeatureListEditor';
import { StringListEditor } from './StringListEditor';
import { Star, Gift, CheckCircle } from 'lucide-react';
import { 
  useNucleadoHeroContent, 
  useNucleadoBeneficiosContent,
  useNucleadoSucessoContent,
} from '@/hooks/useContentTypes';
import { useRequisitosContent } from '@/hooks/useSiteContent';
import { useUpdateSiteContent } from '@/hooks/useSiteContentMutations';

export function BecomeContentEditor() {
  const updateContent = useUpdateSiteContent();

  // Hero Section
  const { data: heroData, isLoading: heroLoading } = useNucleadoHeroContent();
  const [hero, setHero] = useState<typeof heroData>(null);
  const [heroChanged, setHeroChanged] = useState(false);

  useEffect(() => {
    if (heroData && !hero) setHero(heroData);
  }, [heroData, hero]);

  // Benefícios Section
  const { data: beneficiosData, isLoading: beneficiosLoading } = useNucleadoBeneficiosContent();
  const [beneficios, setBeneficios] = useState<typeof beneficiosData>(null);
  const [beneficiosChanged, setBeneficiosChanged] = useState(false);

  useEffect(() => {
    if (beneficiosData && !beneficios) setBeneficios(beneficiosData);
  }, [beneficiosData, beneficios]);

  // Requisitos (existing)
  const { data: requisitosData, isLoading: requisitosLoading } = useRequisitosContent();
  const [requisitos, setRequisitos] = useState<typeof requisitosData>(null);
  const [requisitosChanged, setRequisitosChanged] = useState(false);

  useEffect(() => {
    if (requisitosData && !requisitos) setRequisitos(requisitosData);
  }, [requisitosData, requisitos]);

  // Sucesso Section
  const { data: sucessoData, isLoading: sucessoLoading } = useNucleadoSucessoContent();
  const [sucesso, setSucesso] = useState<typeof sucessoData>(null);
  const [sucessoChanged, setSucessoChanged] = useState(false);

  useEffect(() => {
    if (sucessoData && !sucesso) setSucesso(sucessoData);
  }, [sucessoData, sucesso]);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <SectionEditor
        title="Hero da Página"
        icon={<Star className="h-5 w-5" />}
        isLoading={heroLoading}
        isSaving={updateContent.isPending}
        hasChanges={heroChanged}
        onSave={() => {
          if (hero) {
            updateContent.mutate({ tipo: 'nucleado_hero', conteudo: hero });
            setHeroChanged(false);
          }
        }}
        defaultOpen
      >
        {hero && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input 
                value={hero.badge} 
                onChange={(e) => {
                  setHero({ ...hero, badge: e.target.value });
                  setHeroChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={hero.titulo} 
                onChange={(e) => {
                  setHero({ ...hero, titulo: e.target.value });
                  setHeroChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea 
                value={hero.subtitulo} 
                onChange={(e) => {
                  setHero({ ...hero, subtitulo: e.target.value });
                  setHeroChanged(true);
                }}
                rows={3}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Benefícios Section */}
      <SectionEditor
        title="Benefícios"
        icon={<Gift className="h-5 w-5" />}
        isLoading={beneficiosLoading}
        isSaving={updateContent.isPending}
        hasChanges={beneficiosChanged}
        onSave={() => {
          if (beneficios) {
            updateContent.mutate({ tipo: 'nucleado_beneficios', conteudo: beneficios });
            setBeneficiosChanged(false);
          }
        }}
      >
        {beneficios && (
          <div className="space-y-4">
            <Label>Cards de Benefícios (3 itens)</Label>
            <FeatureListEditor
              value={beneficios.items}
              onChange={(items) => {
                setBeneficios({ items });
                setBeneficiosChanged(true);
              }}
              maxItems={3}
              itemLabel="Benefício"
            />
          </div>
        )}
      </SectionEditor>

      {/* Requisitos Section */}
      <SectionEditor
        title="Requisitos para Participar"
        icon={<CheckCircle className="h-5 w-5" />}
        isLoading={requisitosLoading}
        isSaving={updateContent.isPending}
        hasChanges={requisitosChanged}
        onSave={() => {
          if (requisitos) {
            updateContent.mutate({ tipo: 'requisitos', conteudo: requisitos });
            setRequisitosChanged(false);
          }
        }}
      >
        {requisitos && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={requisitos.titulo} 
                onChange={(e) => {
                  setRequisitos({ ...requisitos, titulo: e.target.value });
                  setRequisitosChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Lista de Requisitos</Label>
              <StringListEditor
                value={requisitos.requisitos}
                onChange={(reqs) => {
                  setRequisitos({ ...requisitos, requisitos: reqs });
                  setRequisitosChanged(true);
                }}
                maxItems={8}
                placeholder="Digite um requisito..."
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Sucesso Section */}
      <SectionEditor
        title="Mensagem de Sucesso"
        icon={<CheckCircle className="h-5 w-5" />}
        isLoading={sucessoLoading}
        isSaving={updateContent.isPending}
        hasChanges={sucessoChanged}
        onSave={() => {
          if (sucesso) {
            updateContent.mutate({ tipo: 'nucleado_sucesso', conteudo: sucesso });
            setSucessoChanged(false);
          }
        }}
      >
        {sucesso && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={sucesso.titulo} 
                onChange={(e) => {
                  setSucesso({ ...sucesso, titulo: e.target.value });
                  setSucessoChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea 
                value={sucesso.descricao} 
                onChange={(e) => {
                  setSucesso({ ...sucesso, descricao: e.target.value });
                  setSucessoChanged(true);
                }}
                rows={3}
              />
            </div>
          </div>
        )}
      </SectionEditor>
    </div>
  );
}
