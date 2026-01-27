import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SectionEditor } from './SectionEditor';
import { Settings, Instagram } from 'lucide-react';
import { 
  useGlobalFooterContent, 
  useGlobalInfoContent,
} from '@/hooks/useContentTypes';
import { useUpdateSiteContent } from '@/hooks/useSiteContentMutations';

export function GlobalSettingsEditor() {
  const updateContent = useUpdateSiteContent();

  // Footer
  const { data: footerData, isLoading: footerLoading } = useGlobalFooterContent();
  const [footer, setFooter] = useState<typeof footerData>(null);
  const [footerChanged, setFooterChanged] = useState(false);

  useEffect(() => {
    if (footerData && !footer) setFooter(footerData);
  }, [footerData, footer]);

  // Global Info
  const { data: infoData, isLoading: infoLoading } = useGlobalInfoContent();
  const [info, setInfo] = useState<typeof infoData>(null);
  const [infoChanged, setInfoChanged] = useState(false);

  useEffect(() => {
    if (infoData && !info) setInfo(infoData);
  }, [infoData, info]);

  return (
    <div className="space-y-4">
      {/* Global Info */}
      <SectionEditor
        title="Informações Gerais"
        icon={<Settings className="h-5 w-5" />}
        isLoading={infoLoading}
        isSaving={updateContent.isPending}
        hasChanges={infoChanged}
        onSave={() => {
          if (info) {
            updateContent.mutate({ tipo: 'global_info', conteudo: info });
            setInfoChanged(false);
          }
        }}
        defaultOpen
      >
        {info && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Núcleo</Label>
              <Input 
                value={info.nome} 
                onChange={(e) => {
                  setInfo({ ...info, nome: e.target.value });
                  setInfoChanged(true);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Slogan</Label>
              <Input 
                value={info.slogan} 
                onChange={(e) => {
                  setInfo({ ...info, slogan: e.target.value });
                  setInfoChanged(true);
                }}
              />
            </div>
          </div>
        )}
      </SectionEditor>

      {/* Footer */}
      <SectionEditor
        title="Rodapé"
        icon={<Instagram className="h-5 w-5" />}
        isLoading={footerLoading}
        isSaving={updateContent.isPending}
        hasChanges={footerChanged}
        onSave={() => {
          if (footer) {
            updateContent.mutate({ tipo: 'global_footer', conteudo: footer });
            setFooterChanged(false);
          }
        }}
      >
        {footer && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descrição do NCE</Label>
              <Textarea 
                value={footer.descricao} 
                onChange={(e) => {
                  setFooter({ ...footer, descricao: e.target.value });
                  setFooterChanged(true);
                }}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Link do Instagram</Label>
              <Input 
                value={footer.instagram_url} 
                onChange={(e) => {
                  setFooter({ ...footer, instagram_url: e.target.value });
                  setFooterChanged(true);
                }}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        )}
      </SectionEditor>
    </div>
  );
}
