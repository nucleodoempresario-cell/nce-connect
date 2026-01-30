import { DivisorContent } from '@/types/pageBlocks';

interface DivisorBlockProps {
  content: DivisorContent | unknown;
}

export function DivisorBlock({ content }: DivisorBlockProps) {
  const data = content as DivisorContent;
  const altura = data.altura || 1;
  
  if (data.estilo === 'espaco') {
    return <div style={{ height: `${altura * 20}px` }} />;
  }
  
  return (
    <div className="container py-8">
      <hr className="border-border" />
    </div>
  );
}
