import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroContent } from '@/types/pageBlocks';
import { Network, Users, ArrowRight } from 'lucide-react';

interface HeroBlockProps {
  content: HeroContent | unknown;
}

export function HeroBlock({ content }: HeroBlockProps) {
  const data = content as HeroContent;
  
  return (
    <section className="relative pt-32 pb-28 bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-2xl" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {data.badge && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 shadow-lg shadow-primary/5">
                <Network className="h-4 w-4" />
                {data.badge}
              </div>
            )}
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1]">
              {data.titulo?.split(" ").slice(0, 1).join(" ")}{" "}
              <span className="text-accent relative">
                {data.titulo?.split(" ").slice(1, 2).join(" ")}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 2 298 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent/30"/>
                </svg>
              </span>{" "}
              {data.titulo?.split(" ").slice(2).join(" ")}
            </h1>
            
            {data.subtitulo && (
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                {data.subtitulo}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {data.botao_primario && (
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-hero shadow-primary/20"
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
                  className="h-14 px-10 text-lg border-2 border-primary text-primary hover:bg-primary/5"
                  asChild
                >
                  <Link to={data.botao_secundario.link}>
                    {data.botao_secundario.texto}
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
          
          {data.imagem_url && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Decorative elements behind image */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent/20 rounded-3xl blur-xl" />
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary/15 rounded-3xl blur-xl" />
              <div className="absolute top-1/2 -left-4 w-24 h-24 bg-primary/30 rounded-full blur-lg" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-image">
                <img 
                  src={data.imagem_url} 
                  alt="Hero"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-foreground/5 to-transparent" />
              </div>
              
              {/* Floating accent card */}
              {data.estatistica && (
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-hero p-5 border border-border/50"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{data.estatistica.numero}</div>
                      <div className="text-sm text-muted-foreground">{data.estatistica.label}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
