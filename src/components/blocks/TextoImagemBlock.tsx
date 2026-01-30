import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations';
import { TextoImagemContent, FeatureItem } from '@/types/pageBlocks';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '@/lib/siteImages';

const getIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || LucideIcons.Star;
};

interface TextoImagemBlockProps {
  content: TextoImagemContent | unknown;
}

export function TextoImagemBlock({ content }: TextoImagemBlockProps) {
  const data = content as TextoImagemContent;
  const imagemPrimeiro = data.imagem_lado === 'esquerda';
  const imageUrl = resolveImageUrl(data.imagem_url);
  
  return (
    <section className="relative py-28 bg-secondary overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className={`grid lg:grid-cols-2 gap-20 items-center ${imagemPrimeiro ? '' : 'lg:flex-row-reverse'}`}>
          {/* Image */}
          {imagemPrimeiro && imageUrl && (
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
                <img 
                  src={imageUrl} 
                  alt={data.titulo}
                  className="rounded-3xl shadow-image w-full relative z-10"
                />
              </div>
            </FadeIn>
          )}
          
          {/* Content */}
          <FadeIn direction={imagemPrimeiro ? "left" : "right"} delay={0.2}>
            <div className="h-1.5 w-20 bg-accent rounded-full mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
              {data.titulo}
            </h2>
            
            {data.descricao && (
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                {data.descricao}
              </p>
            )}
            
            {data.paragrafos && (
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                {data.paragrafos.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            
            {data.features && (
              <div className="space-y-8 mb-10">
                {data.features.map((feature: FeatureItem, index: number) => {
                  const IconComponent = feature.icon ? getIcon(feature.icon) : null;
                  return (
                    <div key={index} className="flex items-start gap-5">
                      {IconComponent ? (
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                      ) : (
                        <div className="w-1.5 h-full min-h-[60px] bg-accent rounded-full flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-1">{feature.titulo}</h3>
                        {feature.descricao && (
                          <p className="text-muted-foreground">{feature.descricao}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {data.botao && (
              <Button size="lg" className="mt-4 h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-hero shadow-primary/20" asChild>
                <Link to={data.botao.link}>
                  {data.botao.texto}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </FadeIn>
          
          {/* Image (when on right) */}
          {!imagemPrimeiro && imageUrl && (
            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-xl" />
                <img 
                  src={imageUrl} 
                  alt={data.titulo}
                  className="rounded-3xl shadow-image w-full relative z-10"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
