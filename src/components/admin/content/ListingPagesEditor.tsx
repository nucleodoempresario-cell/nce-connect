import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionEditor } from './SectionEditor';
import { Building2, Users, Newspaper } from 'lucide-react';
import { 
  useListagemEmpresasContent, 
  useListagemMembrosContent,
  useListagemNoticiasContent,
} from '@/hooks/useContentTypes';
import { useUpdateSiteContent } from '@/hooks/useSiteContentMutations';

export function ListingPagesEditor() {
  const updateContent = useUpdateSiteContent();

  // Empresas
  const { data: empresasData, isLoading: empresasLoading } = useListagemEmpresasContent();
  const [empresas, setEmpresas] = useState<typeof empresasData>(null);
  const [empresasChanged, setEmpresasChanged] = useState(false);

  useEffect(() => {
    if (empresasData && !empresas) setEmpresas(empresasData);
  }, [empresasData, empresas]);

  // Membros
  const { data: membrosData, isLoading: membrosLoading } = useListagemMembrosContent();
  const [membros, setMembros] = useState<typeof membrosData>(null);
  const [membrosChanged, setMembrosChanged] = useState(false);

  useEffect(() => {
    if (membrosData && !membros) setMembros(membrosData);
  }, [membrosData, membros]);

  // Notícias
  const { data: noticiasData, isLoading: noticiasLoading } = useListagemNoticiasContent();
  const [noticias, setNoticias] = useState<typeof noticiasData>(null);
  const [noticiasChanged, setNoticiasChanged] = useState(false);

  useEffect(() => {
    if (noticiasData && !noticias) setNoticias(noticiasData);
  }, [noticiasData, noticias]);

  return (
    <div className="space-y-4">
      {/* Empresas Page */}
      <SectionEditor
        title="Página de Empresas"
        icon={<Building2 className="h-5 w-5" />}
        isLoading={empresasLoading}
        isSaving={updateContent.isPending}
        hasChanges={empresasChanged}
        onSave={() => {
          if (empresas) {
            updateContent.mutate({ tipo: 'listagem_empresas', conteudo: empresas });
            setEmpresasChanged(false);
          }
        }}
        defaultOpen
      >
        {empresas && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input 
                value={empresas.badge} 
                onChange={(e) => {
                  setEmpresas({ ...empresas, badge: e.target.value });
                  setEmpresasChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={empresas.titulo} 
                onChange={(e) => {
                  setEmpresas({ ...empresas, titulo: e.target.value });
                  setEmpresasChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={empresas.subtitulo} 
                onChange={(e) => {
                  setEmpresas({ ...empresas, subtitulo: e.target.value });
                  setEmpresasChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Membros Page */}
      <SectionEditor
        title="Página de Membros"
        icon={<Users className="h-5 w-5" />}
        isLoading={membrosLoading}
        isSaving={updateContent.isPending}
        hasChanges={membrosChanged}
        onSave={() => {
          if (membros) {
            updateContent.mutate({ tipo: 'listagem_membros', conteudo: membros });
            setMembrosChanged(false);
          }
        }}
      >
        {membros && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input 
                value={membros.badge} 
                onChange={(e) => {
                  setMembros({ ...membros, badge: e.target.value });
                  setMembrosChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={membros.titulo} 
                onChange={(e) => {
                  setMembros({ ...membros, titulo: e.target.value });
                  setMembrosChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={membros.subtitulo} 
                onChange={(e) => {
                  setMembros({ ...membros, subtitulo: e.target.value });
                  setMembrosChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Notícias Page */}
      <SectionEditor
        title="Página de Notícias"
        icon={<Newspaper className="h-5 w-5" />}
        isLoading={noticiasLoading}
        isSaving={updateContent.isPending}
        hasChanges={noticiasChanged}
        onSave={() => {
          if (noticias) {
            updateContent.mutate({ tipo: 'listagem_noticias', conteudo: noticias });
            setNoticiasChanged(false);
          }
        }}
      >
        {noticias && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Badge</Label>
              <Input 
                value={noticias.badge} 
                onChange={(e) => {
                  setNoticias({ ...noticias, badge: e.target.value });
                  setNoticiasChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Título</Label>
              <Input 
                value={noticias.titulo} 
                onChange={(e) => {
                  setNoticias({ ...noticias, titulo: e.target.value });
                  setNoticiasChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input 
                value={noticias.subtitulo} 
                onChange={(e) => {
                  setNoticias({ ...noticias, subtitulo: e.target.value });
                  setNoticiasChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>
    </div>
  );
}
