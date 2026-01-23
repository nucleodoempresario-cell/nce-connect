import { motion } from 'framer-motion';
import { Target, Eye, Heart, CheckCircle, Users, Award, Sparkles } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useInstitucionalContent } from '@/hooks/useSiteContent';

export default function About() {
  const { data: content } = useInstitucionalContent();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="container relative z-10">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm text-white/80">Nossa História</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Conheça o{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Núcleo do Empresário
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-white/70 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Uma comunidade de líderes empresariais comprometidos com o crescimento mútuo, 
            networking estratégico e excelência nos negócios.
          </motion.p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container">
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-emerald-500" />
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Missão</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {content?.missao || 'Conectar lideranças empresariais estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios qualificadas.'}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Eye className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Visão</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {content?.visao || 'Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões e resultados gerados para seus membros.'}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Valores</h2>
                  </div>
                  <ul className="space-y-3">
                    {(content?.valores || ['Ética e Integridade', 'Colaboração Genuína', 'Excelência e Inovação', 'Respeito Mútuo']).map((valor, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{valor}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* About Description */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                Quem Somos
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Uma comunidade de 
                <span className="text-primary"> empresários de elite</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  O Núcleo do Empresário nasceu da necessidade de criar um ambiente onde líderes 
                  empresariais pudessem se conectar de forma genuína, trocar experiências e 
                  gerar oportunidades de negócios reais.
                </p>
                <p>
                  Diferente de grupos tradicionais, o NCE mantém um processo seletivo rigoroso 
                  para garantir que todos os membros compartilhem os mesmos valores e objetivos: 
                  crescimento, colaboração e excelência.
                </p>
                <p>
                  Nossos encontros mensais, eventos exclusivos e ambiente de confiança 
                  proporcionam as condições ideais para que negócios aconteçam naturalmente 
                  entre pessoas comprometidas com o sucesso mútuo.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ScaleIn delay={0.1}>
                    <Card className="p-6 bg-gradient-to-br from-primary to-emerald-600 text-white border-0">
                      <div className="text-4xl font-bold mb-2">50+</div>
                      <p className="text-white/80">Empresários Ativos</p>
                    </Card>
                  </ScaleIn>
                  <ScaleIn delay={0.2}>
                    <Card className="p-6 border-0 shadow-lg">
                      <div className="text-4xl font-bold text-foreground mb-2">100+</div>
                      <p className="text-muted-foreground">Eventos Realizados</p>
                    </Card>
                  </ScaleIn>
                </div>
                <div className="space-y-4 pt-8">
                  <ScaleIn delay={0.3}>
                    <Card className="p-6 border-0 shadow-lg">
                      <div className="text-4xl font-bold text-foreground mb-2">R$500M+</div>
                      <p className="text-muted-foreground">Faturamento Combinado</p>
                    </Card>
                  </ScaleIn>
                  <ScaleIn delay={0.4}>
                    <Card className="p-6 bg-slate-900 text-white border-0">
                      <div className="text-4xl font-bold mb-2">10+</div>
                      <p className="text-white/80">Anos de História</p>
                    </Card>
                  </ScaleIn>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="py-20">
        <div className="container">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Nossos Objetivos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Objetivos Estratégicos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trabalhamos diariamente para alcançar resultados extraordinários para nossa comunidade.
            </p>
          </FadeIn>
          
          <StaggerContainer className="max-w-4xl mx-auto" staggerDelay={0.1}>
            <div className="grid gap-4">
              {(content?.objetivos || [
                'Promover networking estratégico de alta qualidade entre empresários',
                'Facilitar parcerias comerciais e oportunidades de negócios',
                'Compartilhar conhecimentos e melhores práticas empresariais',
                'Fortalecer o desenvolvimento econômico regional',
                'Criar um ambiente de confiança e colaboração mútua'
              ]).map((objetivo, i) => (
                <StaggerItem key={i}>
                  <div className="group flex items-center gap-6 p-6 bg-card rounded-xl border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                    <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      {i + 1}
                    </span>
                    <span className="text-lg text-foreground">{objetivo}</span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </PageLayout>
  );
}
