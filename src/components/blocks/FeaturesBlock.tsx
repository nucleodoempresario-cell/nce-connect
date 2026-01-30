import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/components/SectionTitle';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { FeaturesContent, FeatureItem } from '@/types/pageBlocks';
import * as LucideIcons from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const getIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || LucideIcons.Star;
};

interface FeaturesBlockProps {
  content: FeaturesContent | unknown;
}

export function FeaturesBlock({ content }: FeaturesBlockProps) {
  const data = content as FeaturesContent;
  
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        {(data.titulo || data.subtitulo) && (
          <SectionTitle 
            title={data.titulo || ''} 
            subtitle={data.subtitulo}
          />
        )}
        
        <StaggerContainer className="grid md:grid-cols-3 gap-10" staggerDelay={0.15}>
          {data.cards?.map((item: FeatureItem, index: number) => {
            const IconComponent = item.icon ? getIcon(item.icon) : null;
            return (
              <StaggerItem key={index}>
                <Card className="h-full bg-card shadow-elevated hover:shadow-hero border-0 transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-10">
                    {IconComponent && (
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 shadow-lg">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{item.titulo}</h3>
                    {item.descricao && (
                      <p className="text-muted-foreground leading-relaxed text-lg">{item.descricao}</p>
                    )}
                    {item.lista && (
                      <ul className="space-y-3 mt-4">
                        {item.lista.map((valor, i) => (
                          <li key={i} className="flex items-center gap-3 text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{valor}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
