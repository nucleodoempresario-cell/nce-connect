import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { NewsCard } from "@/components/NewsCard";
import { CompanyCard } from "@/components/CompanyCard";
import { SectionTitle } from "@/components/SectionTitle";
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
  Eye,
  Heart,
  CheckCircle,
  ChevronDown
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: news } = useNews();
  const { data: companies } = useCompanies();

  const recentNews = news?.slice(0, 3) || [];
  const featuredCompanies = companies?.slice(0, 4) || [];

  const stats = [
    { value: "50+", label: "Empresários de Elite", icon: Users },
    { value: "40+", label: "Empresas Consolidadas", icon: Building2 },
    { value: "R$ 500M+", label: "em Faturamento", icon: TrendingUp },
    { value: "100+", label: "Conexões Realizadas", icon: Handshake },
  ];

  const essencia = [
    {
      icon: Target,
      title: "Missão",
      description: "Conectar lideranças empresariais estrategicamente para fortalecer o desenvolvimento econômico regional.",
      borderColor: "border-t-primary"
    },
    {
      icon: Eye,
      title: "Visão",
      description: "Ser a referência em networking empresarial de alto nível, reconhecido pela qualidade das conexões.",
      borderColor: "border-t-accent"
    },
    {
      icon: Heart,
      title: "Valores",
      description: "Ética, integridade, colaboração genuína, excelência e respeito mútuo em todas as interações.",
      borderColor: "border-t-green-500"
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')" }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Handshake className="h-4 w-4" />
              Conexão & Crescimento
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              O Núcleo que une os
              <span className="block text-accent">melhores empresários</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Uma comunidade exclusiva de líderes empresariais comprometidos com o crescimento mútuo, 
              networking estratégico e excelência nos negócios.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg"
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
                className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 bg-white/5"
                asChild
              >
                <Link to="/sobre">
                  Conheça o NCE
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {stats.map(({ value, label, icon: Icon }, index) => (
              <StaggerItem key={index}>
                <Card className="bg-white shadow-lg border-0">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                      <Icon className="h-6 w-6" />
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

      {/* Nossa Essência Section */}
      <section className="py-20">
        <div className="container">
          <SectionTitle 
            title="Nossa Essência" 
            subtitle="Os pilares que sustentam nossa comunidade de empresários de elite"
          />
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {essencia.map((item, index) => (
              <StaggerItem key={index}>
                <Card className={`group h-full bg-white shadow-lg border-0 border-t-4 ${item.borderColor} hover:shadow-xl transition-shadow duration-300`}>
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <item.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
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

      {/* Featured Companies */}
      {featuredCompanies.length > 0 && (
        <section className="py-20 bg-secondary">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <SectionTitle 
                title="Empresas Membros" 
                subtitle="Conheça algumas das empresas que fazem parte do nosso núcleo"
                align="left"
                className="mb-0"
              />
              <Button variant="outline" size="lg" asChild className="mt-4 md:mt-0">
                <Link to="/empresas">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
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
        <section className="py-20">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <SectionTitle 
                title="Últimas Notícias" 
                subtitle="Acompanhe as novidades e acontecimentos do NCE"
                align="left"
                className="mb-0"
              />
              <Button variant="outline" size="lg" asChild className="mt-4 md:mt-0">
                <Link to="/noticias">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
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

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para fazer parte da elite empresarial?
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Candidate-se agora e descubra como o NCE pode transformar sua rede de contatos 
              e impulsionar seu negócio para o próximo nível.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="h-14 px-10 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg"
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
