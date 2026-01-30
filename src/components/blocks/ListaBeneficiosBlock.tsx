import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations';
import { SectionTitle } from '@/components/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { ListaBeneficiosContent } from '@/types/pageBlocks';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '@/lib/siteImages';

interface ListaBeneficiosBlockProps {
  content: ListaBeneficiosContent | unknown;
}

export function ListaBeneficiosBlock({ content }: ListaBeneficiosBlockProps) {
  const data = content as ListaBeneficiosContent;
  const isNumerado = data.estilo === 'numerado';
  const imageUrl = resolveImageUrl(data.imagem_url);
  const hasImage = !!imageUrl;
  
  // Layout com imagem
  if (hasImage) {
    const imagemPrimeiro = data.imagem_lado === 'esquerda';
    
    return (
      <section className="relative py-28 bg-secondary overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {imagemPrimeiro && (
              <FadeIn direction="right">
                <div className="relative">
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl" />
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
                  <img 
                    src={imageUrl} 
                    alt={data.titulo}
                    className="rounded-3xl shadow-image w-full relative z-10"
                  />
                </div>
              </FadeIn>
            )}
            
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
              
              <ul className="space-y-5 mb-10">
                {data.itens?.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              {data.botao && (
                <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-hero shadow-primary/20" asChild>
                  <Link to={data.botao.link}>
                    {data.botao.texto}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </FadeIn>
            
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
  
  // Layout sem imagem (lista numerada ou com checks)
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <SectionTitle 
          title={data.titulo} 
          subtitle={data.subtitulo}
        />
        
        <StaggerContainer className="max-w-4xl mx-auto" staggerDelay={0.1}>
          <div className="grid gap-4">
            {data.itens?.map((item, i) => (
              <StaggerItem key={i}>
                <Card className="group bg-card shadow-md border-0 hover:shadow-lg transition-shadow">
                  <CardContent className="flex items-center gap-6 p-6">
                    {isNumerado ? (
                      <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        {i + 1}
                      </span>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <span className="text-lg text-foreground">{item}</span>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
        
        {data.nota && (
          <div className="mt-8 max-w-4xl mx-auto p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground">{data.nota}</p>
          </div>
        )}
      </div>
    </section>
  );
}
