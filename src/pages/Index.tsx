import { Link } from "react-router-dom";
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
  useHomeHeroContent,
  useHomeConfiancaContent,
  useHomePilaresContent,
  useHomeColaboracaoContent,
  useHomeSecaoEmpresasContent,
  useHomeSecaoMembrosContent,
  useHomeSecaoNoticiasContent,
  useHomeComunidadeContent,
  useHomeCtaContent,
} from "@/hooks/useContentTypes";
import * as LucideIcons from "lucide-react";
import { 
  Users, 
  ArrowRight, 
  Target, 
  Eye,
  Heart,
  CheckCircle,
  Shield,
  Network
} from "lucide-react";

// Helper to get Lucide icon by name
const getIcon = (iconName: string): React.ComponentType<{ className?: string }> => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || LucideIcons.Star;
};

const Index = () => {
  const { data: news } = useNews();
  const { data: companies } = useCompanies();
  const { data: members } = useProfiles();
  
  // Dynamic content from database
  const { data: heroContent } = useHomeHeroContent();
  const { data: confiancaContent } = useHomeConfiancaContent();
  const { data: pilaresContent } = useHomePilaresContent();
  const { data: colaboracaoContent } = useHomeColaboracaoContent();
  const { data: secaoEmpresasContent } = useHomeSecaoEmpresasContent();
  const { data: secaoMembrosContent } = useHomeSecaoMembrosContent();
  const { data: secaoNoticiasContent } = useHomeSecaoNoticiasContent();
  const { data: comunidadeContent } = useHomeComunidadeContent();
  const { data: ctaContent } = useHomeCtaContent();

  const recentNews = news?.slice(0, 3) || [];
  const featuredCompanies = companies?.slice(0, 3) || [];
  const featuredMembers = members?.slice(0, 4) || [];

  // Default content with fallbacks
  const hero = {
    badge: heroContent?.badge || "Rede de Empresários Multisetorial",
    titulo: heroContent?.titulo || "Conectando Empresários para o Sucesso",
    subtitulo: heroContent?.subtitulo || "Uma comunidade exclusiva de líderes empresariais comprometidos com o crescimento mútuo, networking estratégico e excelência nos negócios.",
    botao_primario: heroContent?.botao_primario || "Explorar Oportunidades",
    botao_secundario: heroContent?.botao_secundario || "Conheça o Núcleo",
    imagem_url: heroContent?.imagem_url || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1974&auto=format&fit=crop",
    estatistica_numero: heroContent?.estatistica_numero || "50+",
    estatistica_label: heroContent?.estatistica_label || "Empresários",
  };

  const confianca = {
    titulo: confiancaContent?.titulo || "Fundado em Confiança e Credibilidade",
    descricao: confiancaContent?.descricao || "O Núcleo do Empresário nasceu da necessidade de criar um ambiente onde líderes empresariais pudessem se conectar de forma genuína e gerar oportunidades reais.",
    imagem_url: confiancaContent?.imagem_url || "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop",
    features: confiancaContent?.features || [
      { icon: "Shield", titulo: "Ambiente Seguro", descricao: "Grupo seleto e comprometido com valores éticos" },
      { icon: "Network", titulo: "Networking Estratégico", descricao: "Conexões de alto nível que geram resultados" },
      { icon: "TrendingUp", titulo: "Crescimento Compartilhado", descricao: "Sucesso mútuo através da colaboração" },
    ],
  };

  const pilares = {
    titulo_secao: pilaresContent?.titulo_secao || "Nossos Pilares",
    subtitulo_secao: pilaresContent?.subtitulo_secao || "Os fundamentos que guiam nossa comunidade de empresários",
    cards: pilaresContent?.cards || [
      { icon: "Target", titulo: "Missão", descricao: "Conectar empresários estrategicamente para fortalecer o desenvolvimento econômico regional e gerar oportunidades de negócios." },
      { icon: "Eye", titulo: "Visão", descricao: "Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões e resultados." },
      { icon: "Heart", titulo: "Valores", descricao: "Ética, integridade, colaboração genuína, excelência e respeito mútuo em todas as interações." },
    ],
  };

  const colaboracao = {
    titulo: colaboracaoContent?.titulo || "Crescimento Através da Colaboração",
    descricao: colaboracaoContent?.descricao || "Nossos encontros estratégicos e ambiente de confiança proporcionam as condições ideais para que negócios aconteçam naturalmente entre pessoas comprometidas.",
    imagem_url: colaboracaoContent?.imagem_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    features: colaboracaoContent?.features || [
      { titulo: "Reuniões Estratégicas", descricao: "Encontros mensais com foco em resultados e conexões" },
      { titulo: "Parcerias e Oportunidades", descricao: "Ambiente propício para geração de negócios reais" },
      { titulo: "Conhecimento Compartilhado", descricao: "Troca de experiências entre líderes empresariais" },
    ],
    botao_texto: colaboracaoContent?.botao_texto || "Junte-se ao NCE",
  };

  const secaoEmpresas = {
    titulo: secaoEmpresasContent?.titulo || "Empresas do Núcleo",
    subtitulo: secaoEmpresasContent?.subtitulo || "Conheça algumas das empresas que fazem parte da nossa comunidade",
  };

  const secaoMembros = {
    titulo: secaoMembrosContent?.titulo || "Nucleados",
    subtitulo: secaoMembrosContent?.subtitulo || "Empresários de destaque que fazem parte do nosso núcleo",
  };

  const secaoNoticias = {
    titulo: secaoNoticiasContent?.titulo || "Notícias e Ações",
    subtitulo: secaoNoticiasContent?.subtitulo || "Acompanhe as novidades e acontecimentos do NCE",
  };

  const comunidade = {
    titulo: comunidadeContent?.titulo || "A Força de Uma Comunidade Unida",
    descricao: comunidadeContent?.descricao || "Fazer parte do NCE significa ter acesso a uma rede de empresários comprometidos com o crescimento mútuo e a excelência nos negócios.",
    imagem_url: comunidadeContent?.imagem_url || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    beneficios: comunidadeContent?.beneficios || [
      "Acesso a uma rede exclusiva de empresários de alto nível",
      "Eventos e encontros mensais com networking qualificado",
      "Oportunidades reais de negócios entre membros",
      "Ambiente de confiança e colaboração mútua",
      "Crescimento profissional e pessoal contínuo",
    ],
    botao_texto: comunidadeContent?.botao_texto || "Junte-se ao NCE",
  };

  const cta = {
    titulo: ctaContent?.titulo || "Pronto para fazer parte da elite empresarial?",
    subtitulo: ctaContent?.subtitulo || "Candidate-se agora e descubra como o NCE pode transformar sua rede de contatos e impulsionar seu negócio.",
    botao_primario: ctaContent?.botao_primario || "Candidate-se Agora",
    botao_secundario: ctaContent?.botao_secundario || "Saiba Mais",
  };

  return (
    <PageLayout>
      {/* Hero Section - 2 Columns Layout */}
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
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 shadow-lg shadow-primary/5">
                <Network className="h-4 w-4" />
                {hero.badge}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1]">
                {hero.titulo.split(" ").slice(0, 1).join(" ")}{" "}
                <span className="text-accent relative">
                  {hero.titulo.split(" ").slice(1, 2).join(" ")}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 2 298 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-accent/30"/>
                  </svg>
                </span>{" "}
                {hero.titulo.split(" ").slice(2).join(" ")}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                {hero.subtitulo}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-hero shadow-primary/20"
                  asChild
                >
                  <Link to="/empresas">
                    {hero.botao_primario}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-10 text-lg border-2 border-primary text-primary hover:bg-primary/5"
                  asChild
                >
                  <Link to="/sobre">
                    {hero.botao_secundario}
                  </Link>
                </Button>
              </div>
            </motion.div>
            
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
                  src={hero.imagem_url} 
                  alt="Reunião de empresários"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-foreground/5 to-transparent" />
              </div>
              
              {/* Floating accent card */}
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
                    <div className="text-2xl font-bold text-foreground">{hero.estatistica_numero}</div>
                    <div className="text-sm text-muted-foreground">{hero.estatistica_label}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section - Fundado em Confiança */}
      <section className="relative py-28 bg-secondary overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
                
                <img 
                  src={confianca.imagem_url} 
                  alt="Handshake entre empresários"
                  className="rounded-3xl shadow-image w-full relative z-10"
                />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="h-1.5 w-20 bg-accent rounded-full mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                {confianca.titulo}
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                {confianca.descricao}
              </p>
              
              <div className="space-y-8">
                {confianca.features.map((feature, index) => {
                  const IconComponent = getIcon(feature.icon);
                  return (
                    <div key={index} className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <IconComponent className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-1">{feature.titulo}</h3>
                        <p className="text-muted-foreground">{feature.descricao}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pilares Section */}
      <section className="relative py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <SectionTitle 
            title={pilares.titulo_secao} 
            subtitle={pilares.subtitulo_secao}
          />
          
          <StaggerContainer className="grid md:grid-cols-3 gap-10" staggerDelay={0.15}>
            {pilares.cards.map((item, index) => {
              const IconComponent = getIcon(item.icon);
              return (
                <StaggerItem key={index}>
                  <Card className="h-full bg-card shadow-elevated hover:shadow-hero border-0 transition-all duration-500 hover:-translate-y-2">
                    <CardContent className="p-10">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 shadow-lg">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">{item.titulo}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">{item.descricao}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="relative py-28 bg-secondary overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right">
              <div className="h-1.5 w-20 bg-accent rounded-full mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                {colaboracao.titulo}
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                {colaboracao.descricao}
              </p>
              
              <div className="space-y-6">
                {colaboracao.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="w-1.5 h-full min-h-[60px] bg-accent rounded-full flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-2">{feature.titulo}</h3>
                      <p className="text-muted-foreground">{feature.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="mt-10 h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-hero shadow-primary/20" asChild>
                <Link to="/seja-nucleado">
                  {colaboracao.botao_texto}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-xl" />
                
                <img 
                  src={colaboracao.imagem_url} 
                  alt="Equipe colaborando"
                  className="rounded-3xl shadow-image w-full relative z-10"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      {featuredCompanies.length > 0 && (
        <section className="relative py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <SectionTitle 
              title={secaoEmpresas.titulo} 
              subtitle={secaoEmpresas.subtitulo}
            />
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {featuredCompanies.map((company) => (
                <StaggerItem key={company.id}>
                  <Link to={`/empresas/${company.id}`}>
                    <CompanyCard
                      nome={company.nome}
                      logoUrl={company.logo_url}
                      descricaoCurta={company.descricao_curta}
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="text-center mt-14">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-2" asChild>
                <Link to="/empresas">
                  Explorar Todas as Empresas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Members Section */}
      {featuredMembers.length > 0 && (
        <section className="relative py-28 bg-secondary overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <SectionTitle 
              title={secaoMembros.titulo} 
              subtitle={secaoMembros.subtitulo}
            />
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
              {featuredMembers.map((member) => (
                <StaggerItem key={member.id}>
                  <Link to="/membros">
                    <MemberCard
                      nome={member.nome}
                      fotoUrl={member.foto_url}
                      setor="Empresário"
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="text-center mt-14">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-2" asChild>
                <Link to="/membros">
                  Conheça Todos os Nucleados
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {recentNews.length > 0 && (
        <section className="relative py-28 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <SectionTitle 
              title={secaoNoticias.titulo} 
              subtitle={secaoNoticias.subtitulo}
            />
            
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" staggerDelay={0.1}>
              {recentNews.map((article) => (
                <StaggerItem key={article.id}>
                  <Link to={`/noticias/${article.id}`}>
                    <NewsCard
                      titulo={article.titulo}
                      resumo={article.resumo}
                      imagemCapa={article.imagem_capa}
                      createdAt={article.created_at}
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <div className="text-center mt-14">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-2" asChild>
                <Link to="/noticias">
                  Ver Todas as Notícias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Community Section */}
      <section className="relative py-28 bg-secondary overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/30 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
                
                <img 
                  src={comunidade.imagem_url} 
                  alt="Comunidade de empresários"
                  className="rounded-3xl shadow-image w-full relative z-10"
                />
              </div>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="h-1.5 w-20 bg-accent rounded-full mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                {comunidade.titulo}
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                {comunidade.descricao}
              </p>
              
              <ul className="space-y-5 mb-10">
                {comunidade.beneficios.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-hero shadow-primary/20" asChild>
                <Link to="/seja-nucleado">
                  {comunidade.botao_texto}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-28 bg-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              {cta.titulo}
            </h2>
            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
              {cta.subtitulo}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button 
                size="lg" 
                className="h-16 px-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-hero"
                asChild
              >
                <Link to="/seja-nucleado">
                  {cta.botao_primario}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-12 text-lg border-2 border-white/40 text-white hover:bg-white hover:text-slate-900 transition-all"
                asChild
              >
                <Link to="/sobre">
                  {cta.botao_secundario}
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
