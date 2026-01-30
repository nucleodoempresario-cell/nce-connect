import { PageBlock } from '@/types/pageBlocks';
import { HeroBlock } from './HeroBlock';
import { FeaturesBlock } from './FeaturesBlock';
import { TextoImagemBlock } from './TextoImagemBlock';
import { ListaBeneficiosBlock } from './ListaBeneficiosBlock';
import { CtaBlock } from './CtaBlock';
import { EmbedBlock } from './EmbedBlock';
import { TextoSimplesBlock } from './TextoSimplesBlock';
import { DivisorBlock } from './DivisorBlock';

interface BlockRendererProps {
  block: PageBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { tipo_bloco, conteudo } = block;

  switch (tipo_bloco) {
    case 'hero':
      return <HeroBlock content={conteudo} />;
    case 'features':
      return <FeaturesBlock content={conteudo} />;
    case 'texto_imagem':
      return <TextoImagemBlock content={conteudo} />;
    case 'lista_beneficios':
      return <ListaBeneficiosBlock content={conteudo} />;
    case 'cta':
      return <CtaBlock content={conteudo} />;
    case 'cards_icone':
      return <FeaturesBlock content={conteudo} />;
    case 'texto_simples':
      return <TextoSimplesBlock content={conteudo} />;
    case 'divisor':
      return <DivisorBlock content={conteudo} />;
    case 'embed':
      return <EmbedBlock content={conteudo} />;
    default:
      return null;
  }
}
