import { TextoSimplesContent } from '@/types/pageBlocks';
import { FadeIn } from '@/components/animations';

interface TextoSimplesBlockProps {
  content: TextoSimplesContent | unknown;
}

export function TextoSimplesBlock({ content }: TextoSimplesBlockProps) {
  const data = content as TextoSimplesContent;
  
  return (
    <section className="py-16">
      <div className="container">
        <FadeIn className="max-w-4xl mx-auto">
          {data.titulo && (
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {data.titulo}
            </h2>
          )}
          <div 
            className="prose prose-lg max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: data.conteudo }}
          />
        </FadeIn>
      </div>
    </section>
  );
}
