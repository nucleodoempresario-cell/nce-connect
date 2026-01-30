import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations';
import { CtaContent } from '@/types/pageBlocks';
import { ArrowRight } from 'lucide-react';

interface CtaBlockProps {
  content: CtaContent | unknown;
}

export function CtaBlock({ content }: CtaBlockProps) {
  const data = content as CtaContent;
  const isEscuro = data.estilo === 'escuro';
  
  if (isEscuro) {
    return (
      <section className="py-28 bg-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              {data.titulo}
            </h2>
            {data.subtitulo && (
              <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
                {data.subtitulo}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {data.botao_primario && (
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-hero"
                  asChild
                >
                  <Link to={data.botao_primario.link}>
                    {data.botao_primario.texto}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              {data.botao_secundario && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-16 px-12 text-lg border-2 border-white/40 text-white hover:bg-white hover:text-slate-900 transition-all"
                  asChild
                >
                  <Link to={data.botao_secundario.link}>
                    {data.botao_secundario.texto}
                  </Link>
                </Button>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }
  
  // Versão clara
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/20 rounded-full blur-2xl" />
      
      <div className="container relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            {data.titulo}
          </h2>
          {data.subtitulo && (
            <p className="text-lg text-primary-foreground/80 mb-8">
              {data.subtitulo}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {data.botao_primario && (
              <Button 
                size="lg" 
                variant="secondary"
                className="h-12 px-8"
                asChild
              >
                <Link to={data.botao_primario.link}>
                  {data.botao_primario.texto}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            {data.botao_secundario && (
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to={data.botao_secundario.link}>
                  {data.botao_secundario.texto}
                </Link>
              </Button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
