import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionEditor } from './SectionEditor';
import { ImageUploader } from './ImageUploader';
import { StringListEditor } from './StringListEditor';
import { Award, FileText } from 'lucide-react';
import { 
  useSobreHeroContent, 
  useSobreDescricaoContent,
} from '@/hooks/useContentTypes';
import { useInstitucionalContent } from '@/hooks/useSiteContent';
import { useUpdateSiteContent } from '@/hooks/useSiteContentMutations';

export function AboutContentEditor() {
  const updateContent = useUpdateSiteContent();

  // Hero Section
  const { data: heroData, isLoading: heroLoading } = useSobreHeroContent();
  const [hero, setHero] = useState<typeof heroData>(null);
  const [heroChanged, setHeroChanged] = useState(false);

  useEffect(() => {
    if (heroData && !hero) setHero(heroData);
  }, [heroData, hero]);

  // Descrição Section
  const { data: descricaoData, isLoading: descricaoLoading } = useSobreDescricaoContent();
  const [descricao, setDescricao] = useState<typeof descricaoData>(null);
  const [descricaoChanged, setDescricaoChanged] = useState(false);

  useEffect(() => {
    if (descricaoData && !descricao) setDescricao(descricaoData);
  }, [descricaoData, descricao]);

  // Institucional (existing)
  const { data: institucionalData, isLoading: institucionalLoading } = useInstitucionalContent();
  const [institucional, setInstitucional] = useState<typeof institucionalData>(null);
  const [institucionalChanged, setInstitucionalChanged] = useState(false);

  useEffect(() => {
    if (institucionalData && !institucional) setInstitucional(institucionalData);
  }, [institucionalData, institucional]);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <SectionEditor
        title="Hero da Página"
        icon={<Award className="h-5 w-5" />}
        isLoading={heroLoading}
        isSaving={updateContent.isPending}
        hasChanges={heroChanged}
        onSave={() => {
          if (hero) {
            updateContent.mutate({ tipo: 'sobre_hero', conteudo: hero });
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
            
            <ImageUploader
              label="Imagem"
              value={hero.imagem_url}
              onChange={(url) => {
                setHero({ ...hero, imagem_url: url });
                setHeroChanged(true);
              }}
            />
          </div>
        )}
      </SectionEditor>

      {/* Descrição Section */}
      <SectionEditor
        title="Descrição do NCE"
        icon={<FileText className="h-5 w-5" />}
        isLoading={descricaoLoading}
        isSaving={updateContent.isPending}
        hasChanges={descricaoChanged}
        onSave={() => {
          if (descricao) {
            updateContent.mutate({ tipo: 'sobre_descricao', conteudo: descricao });
            setDescricaoChanged(false);
          }
        }}
      >
        {descricao && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={descricao.titulo} 
                onChange={(e) => {
                  setDescricao({ ...descricao, titulo: e.target.value });
                  setDescricaoChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Parágrafos</Label>
              {descricao.paragrafos.map((p, i) => (
                <Textarea 
                  key={i}
                  value={p} 
                  onChange={(e) => {
                    const newParagrafos = [...descricao.paragrafos];
                    newParagrafos[i] = e.target.value;
                    setDescricao({ ...descricao, paragrafos: newParagrafos });
                    setDescricaoChanged(true);
                  }}
                  rows={3}
                  placeholder={`Parágrafo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Institucional Section */}
      <SectionEditor
        title="Missão, Visão e Valores"
        icon={<Award className="h-5 w-5" />}
        isLoading={institucionalLoading}
        isSaving={updateContent.isPending}
        hasChanges={institucionalChanged}
        onSave={() => {
          if (institucional) {
            updateContent.mutate({ tipo: 'institucional', conteudo: institucional });
            setInstitucionalChanged(false);
          }
        }}
      >
        {institucional && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Missão</Label>
              <Textarea 
                value={institucional.missao} 
                onChange={(e) => {
                  setInstitucional({ ...institucional, missao: e.target.value });
                  setInstitucionalChanged(true);
                }}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Visão</Label>
              <Textarea 
                value={institucional.visao} 
                onChange={(e) => {
                  setInstitucional({ ...institucional, visao: e.target.value });
                  setInstitucionalChanged(true);
                }}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valores</Label>
              <StringListEditor
                value={institucional.valores}
                onChange={(valores) => {
                  setInstitucional({ ...institucional, valores });
                  setInstitucionalChanged(true);
                }}
                maxItems={6}
                placeholder="Digite um valor..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Objetivos Estratégicos</Label>
              <StringListEditor
                value={institucional.objetivos}
                onChange={(objetivos) => {
                  setInstitucional({ ...institucional, objetivos });
                  setInstitucionalChanged(true);
                }}
                maxItems={6}
                placeholder="Digite um objetivo..."
              />
            </div>
          </div>
        )}
      </SectionEditor>
    </div>
  );
}
