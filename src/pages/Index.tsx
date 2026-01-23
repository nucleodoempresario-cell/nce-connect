import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { NewsCard } from "@/components/NewsCard";
import { CompanyCard } from "@/components/CompanyCard";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { useNews } from "@/hooks/useNews";
import { useCompanies } from "@/hooks/useCompanies";
import { 
  Users, 
  Building2, 
  Newspaper, 
  ArrowRight, 
  Target, 
  Handshake, 
  TrendingUp,
  Star,
  Award,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: news } = useNews();
  const { data: companies } = useCompanies();

  const recentNews = news?.slice(0, 3) || [];
  const featuredCompanies = companies?.slice(0, 6) || [];

  const benefits = [
    {
      icon: Handshake,
      title: "Networking Estratégico",
      description: "Acesso exclusivo a uma rede de empresários de alto nível, prontos para parcerias e negócios.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "Crescimento Acelerado",
      description: "Mentorias, eventos exclusivos e insights de mercado para impulsionar seus resultados.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Target,
      title: "Visibilidade Premium",
      description: "Destaque sua empresa para um público qualificado e amplie sua influência no mercado.",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Credibilidade",
      description: "Faça parte de um grupo seleto que representa excelência e comprometimento empresarial.",
      gradient: "from-blue-500 to-indigo-600"
    },
  ];

  const stats = [
    { value: "50+", label: "Empresários de Elite", icon: Users },
    { value: "40+", label: "Empresas Consolidadas", icon: Building2 },
    { value: "R$ 500M+", label: "em Faturamento Combinado", icon: TrendingUp },
    { value: "100+", label: "Conexões Realizadas", icon: Handshake },
  ];

  const differentials = [
    "Curadoria rigorosa de novos membros",
    "Eventos mensais exclusivos",
    "Mentorias com empresários experientes",
    "Indicações qualificadas de negócios",
    "Ambiente de confiança e colaboração",
    "Networking estratégico e direcionado",
  ];

  return (
    <PageLayout>
      {/* Hero Section - Premium */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-white/80">A elite empresarial do Brasil</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Onde Líderes se 
              <span className="block bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Conectam e Crescem
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              O NCE reúne os empresários mais influentes e visionários. 
              Uma comunidade exclusiva onde negócios se transformam em resultados extraordinários.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg shadow-primary/25"
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
                className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link to="/sobre">
                  Conheça o NCE
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section - Floating Cards */}
      <section className="relative -mt-20 z-20 pb-20">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.1}>
            {stats.map(({ value, label, icon: Icon }, index) => (
              <StaggerItem key={index}>
                <Card className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About Section - Split Layout */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Award className="h-4 w-4" />
                Sobre o NCE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Mais que networking.
                <span className="text-primary"> Uma família empresarial.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                O Núcleo do Empresário é um seleto grupo de líderes empresariais que compartilham 
                a mesma visão: crescer juntos, fortalecer negócios e construir um legado de sucesso. 
                Aqui, cada conexão é estratégica e cada encontro gera oportunidades reais.
              </p>
              
              <StaggerContainer className="grid grid-cols-2 gap-4 mb-8" staggerDelay={0.05}>
                {differentials.map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/sobre">
                  Saiba mais sobre nós
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
            
            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-8 -left-8 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
                
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <ScaleIn delay={0.1}>
                      <Card className="p-6 bg-gradient-to-br from-primary to-emerald-600 text-white border-0">
                        <Globe className="h-8 w-8 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Visão Global</h3>
                        <p className="text-white/80 text-sm">Empresários conectados com as tendências do mercado mundial.</p>
                      </Card>
                    </ScaleIn>
                    <ScaleIn delay={0.2}>
                      <Card className="p-6 bg-card border-0 shadow-lg">
                        <Zap className="h-8 w-8 text-amber-500 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Agilidade</h3>
                        <p className="text-muted-foreground text-sm">Decisões rápidas e parcerias estratégicas imediatas.</p>
                      </Card>
                    </ScaleIn>
                  </div>
                  <div className="space-y-4 pt-8">
                    <ScaleIn delay={0.3}>
                      <Card className="p-6 bg-card border-0 shadow-lg">
                        <Shield className="h-8 w-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-2">Confiança</h3>
                        <p className="text-muted-foreground text-sm">Ambiente seguro para compartilhar desafios e soluções.</p>
                      </Card>
                    </ScaleIn>
                    <ScaleIn delay={0.4}>
                      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                        <Award className="h-8 w-8 text-amber-400 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Excelência</h3>
                        <p className="text-white/80 text-sm">Padrões elevados em todas as interações e eventos.</p>
                      </Card>
                    </ScaleIn>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Benefits Section - Modern Cards */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Benefícios Exclusivos
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Por que os melhores escolhem o NCE?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos muito mais que networking. É uma experiência completa de crescimento empresarial.
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <Card className="group relative overflow-hidden border-0 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardContent className="relative p-8 z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Companies */}
      {featuredCompanies.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Building2 className="h-4 w-4" />
                  Empresas Membros
                </div>
                <h2 className="text-4xl font-bold text-foreground">
                  Empresas que fazem a diferença
                </h2>
              </div>
              <Button variant="outline" size="lg" asChild>
                <Link to="/empresas">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
            
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.05}>
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
          </div>
        </section>
      )}

      {/* Recent News */}
      {recentNews.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Newspaper className="h-4 w-4" />
                  Novidades
                </div>
                <h2 className="text-4xl font-bold text-foreground">
                  Últimas notícias do NCE
                </h2>
              </div>
              <Button variant="outline" size="lg" asChild>
                <Link to="/noticias">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </FadeIn>
            
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
          </div>
        </section>
      )}

      {/* CTA Section - Premium */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -50, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        <div className="container relative z-10 mx-auto px-4">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-white/80">Vagas limitadas</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Pronto para elevar
              <span className="block bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                seu negócio ao próximo nível?
              </span>
            </h2>
            
            <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
              Junte-se aos empresários mais bem-sucedidos da região. 
              O processo seletivo é criterioso, mas os resultados são extraordinários.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg shadow-primary/25"
                asChild
              >
                <Link to="/seja-nucleado">
                  Iniciar Candidatura
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-white/50">
              Processo 100% online • Resposta em até 7 dias úteis
            </p>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
