import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { NewsCard } from "@/components/NewsCard";
import { CompanyCard } from "@/components/CompanyCard";
import { useNews } from "@/hooks/useNews";
import { useCompanies } from "@/hooks/useCompanies";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Users, Building2, Newspaper, ArrowRight, Target, Handshake, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { getContent } = useSiteContent();

  const homeContent = getContent('home');
  const heroTitle = (homeContent?.heroTitle as string) || "Núcleo do Empresário";
  const heroSubtitle = (homeContent?.heroSubtitle as string) || "Conectando empreendedores, fortalecendo negócios e construindo um futuro de sucesso juntos.";

  const recentNews = news?.slice(0, 3) || [];
  const featuredCompanies = companies?.slice(0, 4) || [];

  const benefits = [
    {
      icon: Handshake,
      title: "Networking Qualificado",
      description: "Conecte-se com empresários de diversos setores e amplie sua rede de contatos.",
    },
    {
      icon: TrendingUp,
      title: "Crescimento Empresarial",
      description: "Participe de eventos, workshops e mentorias para impulsionar seu negócio.",
    },
    {
      icon: Target,
      title: "Visibilidade",
      description: "Tenha sua empresa em destaque para potenciais clientes e parceiros.",
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dark py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
            {heroSubtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/seja-nucleado">
                Seja um Nucleado
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/sobre">Conheça o NCE</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">50+</p>
                <p className="text-muted-foreground">Membros Ativos</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">40+</p>
                <p className="text-muted-foreground">Empresas Parceiras</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Newspaper className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">100+</p>
                <p className="text-muted-foreground">Eventos Realizados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Por que fazer parte do NCE?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Descubra os benefícios exclusivos de ser um membro do Núcleo do Empresário.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none bg-muted/50 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      {featuredCompanies.length > 0 && (
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                  Empresas em Destaque
                </h2>
                <p className="text-muted-foreground">
                  Conheça algumas das empresas que fazem parte do nosso núcleo.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link to="/empresas">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  nome={company.nome}
                  logoUrl={company.logo_url}
                  descricaoCurta={company.descricao_curta}
                  onClick={() => navigate(`/empresas?id=${company.id}`)}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link to="/empresas">
                  Ver Todas as Empresas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Recent News */}
      {recentNews.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                  Últimas Notícias
                </h2>
                <p className="text-muted-foreground">
                  Fique por dentro das novidades do NCE.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link to="/noticias">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentNews.map((article) => (
                <NewsCard
                  key={article.id}
                  titulo={article.titulo}
                  resumo={article.resumo}
                  imagemCapa={article.imagem_capa}
                  createdAt={article.created_at}
                  onClick={() => navigate(`/noticias/${article.id}`)}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link to="/noticias">
                  Ver Todas as Notícias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Pronto para crescer com o NCE?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Junte-se a uma comunidade de empresários comprometidos com o sucesso mútuo.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/seja-nucleado">
              Faça sua Inscrição
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
