import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { NewsCard } from "@/components/NewsCard";
import { CompanyCard } from "@/components/CompanyCard";
import { MemberCard } from "@/components/MemberCard";
import { SectionTitle } from "@/components/SectionTitle";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { useNews } from "@/hooks/useNews";
import { useCompanies } from "@/hooks/useCompanies";
import { useProfiles } from "@/hooks/useProfiles";
import { 
  Users, 
  Building2, 
  ArrowRight, 
  Target, 
  Handshake, 
  TrendingUp,
  Eye,
  Heart,
  CheckCircle,
  Shield,
  Lightbulb,
  Network
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: news } = useNews();
  const { data: companies } = useCompanies();
  const { data: members } = useProfiles();

  const recentNews = news?.slice(0, 3) || [];
  const featuredCompanies = companies?.slice(0, 3) || [];
  const featuredMembers = members?.slice(0, 4) || [];

  const pilares = [
    {
      icon: Target,
      title: "Missão",
      description: "Conectar empresários estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios.",
    },
    {
      icon: Eye,
      title: "Visão",
      description: "Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões e resultados.",
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Ética, integridade, colaboração genuína, excelência e respeito mútuo em todas as interações.",
    },
  ];

  const trustFeatures = [
    { icon: Shield, title: "Ambiente Seguro", description: "Grupo seleto e comprometido com valores éticos" },
    { icon: Network, title: "Networking Estratégico", description: "Conexões de alto nível que geram resultados" },
    { icon: TrendingUp, title: "Crescimento Compartilhado", description: "Sucesso mútuo através da colaboração" },
  ];

  const collaborationFeatures = [
    { title: "Reuniões Estratégicas", description: "Encontros mensais com foco em resultados e conexões" },
    { title: "Parcerias e Oportunidades", description: "Ambiente propício para geração de negócios reais" },
    { title: "Conhecimento Compartilhado", description: "Troca de experiências entre líderes empresariais" },
  ];

  const communityBenefits = [
    "Acesso a uma rede exclusiva de empresários de alto nível",
    "Eventos e encontros mensais com networking qualificado",
    "Oportunidades reais de negócios entre membros",
    "Ambiente de confiança e colaboração mútua",
    "Crescimento profissional e pessoal contínuo",
  ];

  return (
    <PageLayout>
      {/* Hero Section - 2 Columns Layout */}
      <section className="pt-28 pb-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Network className="h-4 w-4" />
                Rede de Empresários Multisetorial
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Conectando{" "}
                <span className="text-accent">Empresários</span>{" "}
                para o Sucesso
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Uma comunidade exclusiva de líderes empresariais comprometidos com o crescimento mútuo, 
                networking estratégico e excelência nos negócios.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button 
                  size="lg" 
                  className="h-12 px-8 bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link to="/empresas">
                    Explorar Oportunidades
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 px-8 border-primary text-primary hover:bg-primary/5"
                  asChild
                >
                  <Link to="/sobre">
                    Conheça o Núcleo
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1974&auto=format&fit=crop" 
                  alt="Reunião de empresários"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section - Fundado em Confiança */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop" 
                  alt="Handshake entre empresários"
                  className="rounded-2xl shadow-xl w-full"
                />
                {/* Decorative circles */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full -z-10" />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="h-1 w-16 bg-accent rounded-full mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Fundado em Confiança e Credibilidade
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                O Núcleo do Empresário nasceu da necessidade de criar um ambiente onde líderes 
                empresariais pudessem se conectar de forma genuína e gerar oportunidades reais.
              </p>
              
              <div className="space-y-6">
                {trustFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pilares Section */}
      <section className="py-20">
        <div className="container">
          <SectionTitle 
            title="Nossos Pilares" 
            subtitle="Os fundamentos que guiam nossa comunidade de empresários"
          />
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {pilares.map((item, index) => (
              <StaggerItem key={index}>
                <Card className="h-full bg-card shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="h-1 w-16 bg-accent rounded-full mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Crescimento Através da Colaboração
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Nossos encontros estratégicos e ambiente de confiança proporcionam as condições 
                ideais para que negócios aconteçam naturalmente entre pessoas comprometidas.
              </p>
              
              <div className="space-y-4">
                {collaborationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-1 h-full bg-accent rounded-full flex-shrink-0" />
                    <div className="border-l-4 border-accent pl-4">
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90" asChild>
                <Link to="/seja-nucleado">
                  Junte-se ao NCE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                  alt="Equipe colaborando"
                  className="rounded-2xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full -z-10" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      {featuredCompanies.length > 0 && (
        <section className="py-20">
          <div className="container">
            <SectionTitle 
              title="Empresas do Núcleo" 
              subtitle="Conheça algumas das empresas que fazem parte da nossa comunidade"
            />
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
              {featuredCompanies.map((company) => (
                <StaggerItem key={company.id}>
                  <CompanyCard
                    nome={company.nome}
                    logoUrl={company.logo_url}
                    descricaoCurta={company.descricao_curta}
                    onClick={() => navigate(`/empresas?id=${company.id}`)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/empresas">
                  Explorar Todas as Empresas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Members Section */}
      {featuredMembers.length > 0 && (
        <section className="py-20 bg-secondary">
          <div className="container">
            <SectionTitle 
              title="Nucleados" 
              subtitle="Empresários de destaque que fazem parte do nosso núcleo"
            />
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
              {featuredMembers.map((member) => (
                <StaggerItem key={member.id}>
                  <MemberCard
                    nome={member.nome}
                    fotoUrl={member.foto_url}
                    setor="Empresário"
                    onClick={() => navigate('/membros')}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/membros">
                  Conheça Todos os Nucleados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {recentNews.length > 0 && (
        <section className="py-20">
          <div className="container">
            <SectionTitle 
              title="Notícias e Ações" 
              subtitle="Acompanhe as novidades e acontecimentos do NCE"
            />
            
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {recentNews.map((article) => (
                <StaggerItem key={article.id}>
                  <NewsCard
                    titulo={article.titulo}
                    resumo={article.resumo}
                    imagemCapa={article.imagem_capa}
                    createdAt={article.created_at}
                    onClick={() => navigate(`/noticias/${article.id}`)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/noticias">
                  Ver Todas as Notícias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Community Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" 
                  alt="Comunidade de empresários"
                  className="rounded-2xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full -z-10" />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="h-1 w-16 bg-accent rounded-full mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Força de Uma Comunidade Unida
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Fazer parte do NCE significa ter acesso a uma rede de empresários comprometidos 
                com o crescimento mútuo e a excelência nos negócios.
              </p>
              
              <ul className="space-y-4 mb-8">
                {communityBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/seja-nucleado">
                  Junte-se ao NCE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 bg-slate-900">
        <div className="container">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para fazer parte da elite empresarial?
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Candidate-se agora e descubra como o NCE pode transformar sua rede de contatos 
              e impulsionar seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-10 text-lg border-white text-white hover:bg-white hover:text-slate-900"
                asChild
              >
                <Link to="/seja-nucleado">
                  Candidate-se Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 text-lg border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/sobre">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
