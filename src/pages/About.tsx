import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, CheckCircle, Users, TrendingUp, Handshake, Award, ArrowRight, Network, Shield } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/SectionTitle';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useInstitucionalContent } from '@/hooks/useSiteContent';

export default function About() {
  const { data: content } = useInstitucionalContent();

  const stats = [
    { value: "50+", label: "Empresários Ativos", icon: Users },
    { value: "100+", label: "Eventos Realizados", icon: Award },
    { value: "R$500M+", label: "Faturamento Combinado", icon: TrendingUp },
    { value: "10+", label: "Anos de História", icon: Handshake },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Award className="h-4 w-4" />
                Nossa História
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Conheça o{" "}
                <span className="text-accent">Núcleo do Empresário</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Uma comunidade de líderes empresariais comprometidos com o crescimento mútuo, 
                networking estratégico e excelência nos negócios.
              </p>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2090&auto=format&fit=crop" 
                  alt="Equipe NCE"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {stats.map(({ value, label, icon: Icon }, index) => (
              <StaggerItem key={index}>
                <Card className="bg-card shadow-lg border-0 text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container">
          <SectionTitle 
            title="Nossa Essência" 
            subtitle="Os pilares fundamentais que guiam nossa comunidade"
          />
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            <StaggerItem>
              <Card className="h-full bg-card shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Missão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {content?.missao || 'Conectar lideranças empresariais estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios qualificadas.'}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full bg-card shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Visão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {content?.visao || 'Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões e resultados gerados para seus membros.'}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full bg-card shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Valores</h2>
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
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="h-1 w-16 bg-accent rounded-full mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Uma comunidade de{' '}
                <span className="text-primary">empresários de elite</span>
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
              <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90" asChild>
                <Link to="/seja-nucleado">
                  Faça parte do NCE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <ScaleIn delay={0.1}>
                  <Card className="p-6 bg-primary text-primary-foreground border-0">
                    <Network className="h-8 w-8 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Networking</h3>
                    <p className="text-primary-foreground/80 text-sm">Conexões estratégicas de alto nível.</p>
                  </Card>
                </ScaleIn>
                <ScaleIn delay={0.2}>
                  <Card className="p-6 bg-card border-0 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-accent mb-4" />
                    <h3 className="font-bold text-lg mb-2 text-foreground">Crescimento</h3>
                    <p className="text-muted-foreground text-sm">Negócios que realmente acontecem.</p>
                  </Card>
                </ScaleIn>
                <ScaleIn delay={0.3}>
                  <Card className="p-6 bg-card border-0 shadow-lg">
                    <Award className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold text-lg mb-2 text-foreground">Excelência</h3>
                    <p className="text-muted-foreground text-sm">Padrão elevado em todas as ações.</p>
                  </Card>
                </ScaleIn>
                <ScaleIn delay={0.4}>
                  <Card className="p-6 bg-accent text-accent-foreground border-0">
                    <Shield className="h-8 w-8 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Confiança</h3>
                    <p className="text-accent-foreground/80 text-sm">Ambiente seguro para crescer.</p>
                  </Card>
                </ScaleIn>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="py-20">
        <div className="container">
          <SectionTitle 
            title="Objetivos Estratégicos" 
            subtitle="Trabalhamos diariamente para alcançar resultados extraordinários para nossa comunidade"
          />
          
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
                  <Card className="group bg-card shadow-md border-0 hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-center gap-6 p-6">
                      <span className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        {i + 1}
                      </span>
                      <span className="text-lg text-foreground">{objetivo}</span>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </PageLayout>
  );
}
