import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionEditor } from './SectionEditor';
import { ImageUploader } from './ImageUploader';
import { FeatureListEditor } from './FeatureListEditor';
import { StringListEditor } from './StringListEditor';
import { 
  Home, Handshake, Target, Users as UsersIcon, Building2, 
  Newspaper, Heart, Megaphone 
} from 'lucide-react';
import { 
  useHomeHeroContent, 
  useHomeConfiancaContent,
  useHomePilaresContent,
  useHomeColaboracaoContent,
  useHomeSecaoEmpresasContent,
  useHomeSecaoMembrosContent,
  useHomeSecaoNoticiasContent,
  useHomeComunidadeContent,
  useHomeCtaContent,
} from '@/hooks/useContentTypes';
import { useUpdateSiteContent } from '@/hooks/useSiteContentMutations';

export function HomeContentEditor() {
  const updateContent = useUpdateSiteContent();

  // Hero Section
  const { data: heroData, isLoading: heroLoading } = useHomeHeroContent();
  const [hero, setHero] = useState<typeof heroData>(null);
  const [heroChanged, setHeroChanged] = useState(false);

  useEffect(() => {
    if (heroData && !hero) setHero(heroData);
  }, [heroData, hero]);

  // Confiança Section
  const { data: confiancaData, isLoading: confiancaLoading } = useHomeConfiancaContent();
  const [confianca, setConfianca] = useState<typeof confiancaData>(null);
  const [confiancaChanged, setConfiancaChanged] = useState(false);

  useEffect(() => {
    if (confiancaData && !confianca) setConfianca(confiancaData);
  }, [confiancaData, confianca]);

  // Pilares Section
  const { data: pilaresData, isLoading: pilaresLoading } = useHomePilaresContent();
  const [pilares, setPilares] = useState<typeof pilaresData>(null);
  const [pilaresChanged, setPilaresChanged] = useState(false);

  useEffect(() => {
    if (pilaresData && !pilares) setPilares(pilaresData);
  }, [pilaresData, pilares]);

  // Colaboração Section
  const { data: colaboracaoData, isLoading: colaboracaoLoading } = useHomeColaboracaoContent();
  const [colaboracao, setColaboracao] = useState<typeof colaboracaoData>(null);
  const [colaboracaoChanged, setColaboracaoChanged] = useState(false);

  useEffect(() => {
    if (colaboracaoData && !colaboracao) setColaboracao(colaboracaoData);
  }, [colaboracaoData, colaboracao]);

  // Seção Empresas
  const { data: secaoEmpresasData, isLoading: secaoEmpresasLoading } = useHomeSecaoEmpresasContent();
  const [secaoEmpresas, setSecaoEmpresas] = useState<typeof secaoEmpresasData>(null);
  const [secaoEmpresasChanged, setSecaoEmpresasChanged] = useState(false);

  useEffect(() => {
    if (secaoEmpresasData && !secaoEmpresas) setSecaoEmpresas(secaoEmpresasData);
  }, [secaoEmpresasData, secaoEmpresas]);

  // Seção Membros
  const { data: secaoMembrosData, isLoading: secaoMembrosLoading } = useHomeSecaoMembrosContent();
  const [secaoMembros, setSecaoMembros] = useState<typeof secaoMembrosData>(null);
  const [secaoMembrosChanged, setSecaoMembrosChanged] = useState(false);

  useEffect(() => {
    if (secaoMembrosData && !secaoMembros) setSecaoMembros(secaoMembrosData);
  }, [secaoMembrosData, secaoMembros]);

  // Seção Notícias
  const { data: secaoNoticiasData, isLoading: secaoNoticiasLoading } = useHomeSecaoNoticiasContent();
  const [secaoNoticias, setSecaoNoticias] = useState<typeof secaoNoticiasData>(null);
  const [secaoNoticiasChanged, setSecaoNoticiasChanged] = useState(false);

  useEffect(() => {
    if (secaoNoticiasData && !secaoNoticias) setSecaoNoticias(secaoNoticiasData);
  }, [secaoNoticiasData, secaoNoticias]);

  // Comunidade Section
  const { data: comunidadeData, isLoading: comunidadeLoading } = useHomeComunidadeContent();
  const [comunidade, setComunidade] = useState<typeof comunidadeData>(null);
  const [comunidadeChanged, setComunidadeChanged] = useState(false);

  useEffect(() => {
    if (comunidadeData && !comunidade) setComunidade(comunidadeData);
  }, [comunidadeData, comunidade]);

  // CTA Final
  const { data: ctaData, isLoading: ctaLoading } = useHomeCtaContent();
  const [cta, setCta] = useState<typeof ctaData>(null);
  const [ctaChanged, setCtaChanged] = useState(false);

  useEffect(() => {
    if (ctaData && !cta) setCta(ctaData);
  }, [ctaData, cta]);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <SectionEditor
        title="Hero Principal"
        icon={<Home className="h-5 w-5" />}
        isLoading={heroLoading}
        isSaving={updateContent.isPending}
        hasChanges={heroChanged}
        onSave={() => {
          if (hero) {
            updateContent.mutate({ tipo: 'home_hero', conteudo: hero });
            setHeroChanged(false);
          }
        }}
        defaultOpen
      >
        {hero && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge/Tag</Label>
                <Input 
                  value={hero.badge} 
                  onChange={(e) => {
                    setHero({ ...hero, badge: e.target.value });
                    setHeroChanged(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Estatística (número)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={hero.estatistica_numero} 
                    onChange={(e) => {
                      setHero({ ...hero, estatistica_numero: e.target.value });
                      setHeroChanged(true);
                    }}
                    placeholder="50+"
                    className="w-24"
                  />
                  <Input 
                    value={hero.estatistica_label} 
                    onChange={(e) => {
                      setHero({ ...hero, estatistica_label: e.target.value });
                      setHeroChanged(true);
                    }}
                    placeholder="Empresários"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Título Principal</Label>
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
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Botão Primário</Label>
                <Input 
                  value={hero.botao_primario} 
                  onChange={(e) => {
                    setHero({ ...hero, botao_primario: e.target.value });
                    setHeroChanged(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Botão Secundário</Label>
                <Input 
                  value={hero.botao_secundario} 
                  onChange={(e) => {
                    setHero({ ...hero, botao_secundario: e.target.value });
                    setHeroChanged(true);
                  }}
                />
              </div>
            </div>
            
            <ImageUploader
              label="Imagem do Hero"
              value={hero.imagem_url}
              onChange={(url) => {
                setHero({ ...hero, imagem_url: url });
                setHeroChanged(true);
              }}
            />
          </div>
        )}
      </SectionEditor>

      {/* Confiança Section */}
      <SectionEditor
        title="Seção Confiança"
        icon={<Handshake className="h-5 w-5" />}
        isLoading={confiancaLoading}
        isSaving={updateContent.isPending}
        hasChanges={confiancaChanged}
        onSave={() => {
          if (confianca) {
            updateContent.mutate({ tipo: 'home_confianca', conteudo: confianca });
            setConfiancaChanged(false);
          }
        }}
      >
        {confianca && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={confianca.titulo} 
                onChange={(e) => {
                  setConfianca({ ...confianca, titulo: e.target.value });
                  setConfiancaChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea 
                value={confianca.descricao} 
                onChange={(e) => {
                  setConfianca({ ...confianca, descricao: e.target.value });
                  setConfiancaChanged(true);
                }}
                rows={3}
              />
            </div>
            
            <ImageUploader
              label="Imagem"
              value={confianca.imagem_url}
              onChange={(url) => {
                setConfianca({ ...confianca, imagem_url: url });
                setConfiancaChanged(true);
              }}
            />
            
            <div className="space-y-2">
              <Label>Features (3 itens)</Label>
              <FeatureListEditor
                value={confianca.features}
                onChange={(features) => {
                  setConfianca({ ...confianca, features });
                  setConfiancaChanged(true);
                }}
                maxItems={3}
                itemLabel="Feature"
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Pilares Section */}
      <SectionEditor
        title="Pilares (Missão/Visão/Valores)"
        icon={<Target className="h-5 w-5" />}
        isLoading={pilaresLoading}
        isSaving={updateContent.isPending}
        hasChanges={pilaresChanged}
        onSave={() => {
          if (pilares) {
            updateContent.mutate({ tipo: 'home_pilares', conteudo: pilares });
            setPilaresChanged(false);
          }
        }}
      >
        {pilares && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título da Seção</Label>
                <Input 
                  value={pilares.titulo_secao} 
                  onChange={(e) => {
                    setPilares({ ...pilares, titulo_secao: e.target.value });
                    setPilaresChanged(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo da Seção</Label>
                <Input 
                  value={pilares.subtitulo_secao} 
                  onChange={(e) => {
                    setPilares({ ...pilares, subtitulo_secao: e.target.value });
                    setPilaresChanged(true);
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Cards (3 pilares)</Label>
              <FeatureListEditor
                value={pilares.cards}
                onChange={(cards) => {
                  setPilares({ ...pilares, cards });
                  setPilaresChanged(true);
                }}
                maxItems={3}
                itemLabel="Pilar"
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Colaboração Section */}
      <SectionEditor
        title="Seção Colaboração"
        icon={<UsersIcon className="h-5 w-5" />}
        isLoading={colaboracaoLoading}
        isSaving={updateContent.isPending}
        hasChanges={colaboracaoChanged}
        onSave={() => {
          if (colaboracao) {
            updateContent.mutate({ tipo: 'home_colaboracao', conteudo: colaboracao });
            setColaboracaoChanged(false);
          }
        }}
      >
        {colaboracao && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={colaboracao.titulo} 
                onChange={(e) => {
                  setColaboracao({ ...colaboracao, titulo: e.target.value });
                  setColaboracaoChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea 
                value={colaboracao.descricao} 
                onChange={(e) => {
                  setColaboracao({ ...colaboracao, descricao: e.target.value });
                  setColaboracaoChanged(true);
                }}
                rows={3}
              />
            </div>
            
            <ImageUploader
              label="Imagem"
              value={colaboracao.imagem_url}
              onChange={(url) => {
                setColaboracao({ ...colaboracao, imagem_url: url });
                setColaboracaoChanged(true);
              }}
            />
            
            <div className="space-y-2">
              <Label>Features</Label>
              <FeatureListEditor
                value={colaboracao.features.map(f => ({ ...f, icon: '' }))}
                onChange={(features) => {
                  setColaboracao({ 
                    ...colaboracao, 
                    features: features.map(f => ({ titulo: f.titulo, descricao: f.descricao }))
                  });
                  setColaboracaoChanged(true);
                }}
                showIcon={false}
                maxItems={4}
                itemLabel="Feature"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Texto do Botão CTA</Label>
              <Input 
                value={colaboracao.botao_texto} 
                onChange={(e) => {
                  setColaboracao({ ...colaboracao, botao_texto: e.target.value });
                  setColaboracaoChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Seção Empresas */}
      <SectionEditor
        title="Seção Empresas"
        icon={<Building2 className="h-5 w-5" />}
        isLoading={secaoEmpresasLoading}
        isSaving={updateContent.isPending}
        hasChanges={secaoEmpresasChanged}
        onSave={() => {
          if (secaoEmpresas) {
            updateContent.mutate({ tipo: 'home_secao_empresas', conteudo: secaoEmpresas });
            setSecaoEmpresasChanged(false);
          }
        }}
      >
        {secaoEmpresas && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={secaoEmpresas.titulo} 
                onChange={(e) => {
                  setSecaoEmpresas({ ...secaoEmpresas, titulo: e.target.value });
                  setSecaoEmpresasChanged(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={secaoEmpresas.subtitulo} 
                onChange={(e) => {
                  setSecaoEmpresas({ ...secaoEmpresas, subtitulo: e.target.value });
                  setSecaoEmpresasChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Seção Membros */}
      <SectionEditor
        title="Seção Membros"
        icon={<UsersIcon className="h-5 w-5" />}
        isLoading={secaoMembrosLoading}
        isSaving={updateContent.isPending}
        hasChanges={secaoMembrosChanged}
        onSave={() => {
          if (secaoMembros) {
            updateContent.mutate({ tipo: 'home_secao_membros', conteudo: secaoMembros });
            setSecaoMembrosChanged(false);
          }
        }}
      >
        {secaoMembros && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={secaoMembros.titulo} 
                onChange={(e) => {
                  setSecaoMembros({ ...secaoMembros, titulo: e.target.value });
                  setSecaoMembrosChanged(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={secaoMembros.subtitulo} 
                onChange={(e) => {
                  setSecaoMembros({ ...secaoMembros, subtitulo: e.target.value });
                  setSecaoMembrosChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Seção Notícias */}
      <SectionEditor
        title="Seção Notícias"
        icon={<Newspaper className="h-5 w-5" />}
        isLoading={secaoNoticiasLoading}
        isSaving={updateContent.isPending}
        hasChanges={secaoNoticiasChanged}
        onSave={() => {
          if (secaoNoticias) {
            updateContent.mutate({ tipo: 'home_secao_noticias', conteudo: secaoNoticias });
            setSecaoNoticiasChanged(false);
          }
        }}
      >
        {secaoNoticias && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={secaoNoticias.titulo} 
                onChange={(e) => {
                  setSecaoNoticias({ ...secaoNoticias, titulo: e.target.value });
                  setSecaoNoticiasChanged(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={secaoNoticias.subtitulo} 
                onChange={(e) => {
                  setSecaoNoticias({ ...secaoNoticias, subtitulo: e.target.value });
                  setSecaoNoticiasChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Comunidade Section */}
      <SectionEditor
        title="Seção Comunidade"
        icon={<Heart className="h-5 w-5" />}
        isLoading={comunidadeLoading}
        isSaving={updateContent.isPending}
        hasChanges={comunidadeChanged}
        onSave={() => {
          if (comunidade) {
            updateContent.mutate({ tipo: 'home_comunidade', conteudo: comunidade });
            setComunidadeChanged(false);
          }
        }}
      >
        {comunidade && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={comunidade.titulo} 
                onChange={(e) => {
                  setComunidade({ ...comunidade, titulo: e.target.value });
                  setComunidadeChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea 
                value={comunidade.descricao} 
                onChange={(e) => {
                  setComunidade({ ...comunidade, descricao: e.target.value });
                  setComunidadeChanged(true);
                }}
                rows={3}
              />
            </div>
            
            <ImageUploader
              label="Imagem"
              value={comunidade.imagem_url}
              onChange={(url) => {
                setComunidade({ ...comunidade, imagem_url: url });
                setComunidadeChanged(true);
              }}
            />
            
            <div className="space-y-2">
              <Label>Benefícios (lista)</Label>
              <StringListEditor
                value={comunidade.beneficios}
                onChange={(beneficios) => {
                  setComunidade({ ...comunidade, beneficios });
                  setComunidadeChanged(true);
                }}
                maxItems={6}
                placeholder="Digite um benefício..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input 
                value={comunidade.botao_texto} 
                onChange={(e) => {
                  setComunidade({ ...comunidade, botao_texto: e.target.value });
                  setComunidadeChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* CTA Final */}
      <SectionEditor
        title="CTA Final"
        icon={<Megaphone className="h-5 w-5" />}
        isLoading={ctaLoading}
        isSaving={updateContent.isPending}
        hasChanges={ctaChanged}
        onSave={() => {
          if (cta) {
            updateContent.mutate({ tipo: 'home_cta', conteudo: cta });
            setCtaChanged(false);
          }
        }}
      >
        {cta && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={cta.titulo} 
                onChange={(e) => {
                  setCta({ ...cta, titulo: e.target.value });
                  setCtaChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea 
                value={cta.subtitulo} 
                onChange={(e) => {
                  setCta({ ...cta, subtitulo: e.target.value });
                  setCtaChanged(true);
                }}
                rows={2}
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Botão Primário</Label>
                <Input 
                  value={cta.botao_primario} 
                  onChange={(e) => {
                    setCta({ ...cta, botao_primario: e.target.value });
                    setCtaChanged(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Botão Secundário</Label>
                <Input 
                  value={cta.botao_secundario} 
                  onChange={(e) => {
                    setCta({ ...cta, botao_secundario: e.target.value });
                    setCtaChanged(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </SectionEditor>
    </div>
  );
}
