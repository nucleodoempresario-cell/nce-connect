import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Globe, MapPin, Phone, Mail, ArrowLeft, ArrowRight, Loader2, Calendar, Users, Package, Briefcase } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SocialLinks } from '@/components/SocialLinks';
import { GoogleMap } from '@/components/GoogleMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useCompany } from '@/hooks/useCompanies';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading, error } = useCompany(id || '');

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (error || !company) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Building2 className="h-20 w-20 text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Empresa não encontrada</h1>
          <Button asChild>
            <Link to="/empresas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Empresas
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const redes = (company.redes_sociais as Record<string, string>) || {};
  const companyAny = company as Record<string, unknown>;
  const visibility = (companyAny.campos_visiveis as Record<string, boolean>) || {};
  
  // Helper to check visibility (default to true if not set)
  const isVisible = (field: string) => visibility[field] !== false;
  
  const hasAddress = company.endereco || company.cidade;
  const hasContact = company.telefone || company.email;
  const produtosServicos = companyAny.produtos_servicos as string;

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          {/* Breadcrumb */}
          <FadeIn>
            <Link 
              to="/empresas" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Empresas
            </Link>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Company Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/15 rounded-full blur-2xl" />
              
              <div className="relative bg-gradient-to-br from-secondary to-muted rounded-3xl shadow-hero p-12 flex items-center justify-center min-h-[400px]">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.nome}
                    className="max-w-full max-h-80 object-contain"
                  />
                ) : (
                  <Building2 className="h-40 w-40 text-muted-foreground/20" />
                )}
              </div>
            </motion.div>

            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  <Building2 className="h-4 w-4" />
                  Empresa Nucleada
                </div>
                {isVisible('segmento') && companyAny.segmento && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">
                    <Briefcase className="h-4 w-4" />
                    {companyAny.segmento as string}
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {company.nome}
              </h1>
              
              {isVisible('descricao_curta') && company.descricao_curta && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {company.descricao_curta}
                </p>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mb-8">
                {isVisible('ano_fundacao') && companyAny.ano_fundacao && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Desde {companyAny.ano_fundacao as number}</span>
                  </div>
                )}
                {isVisible('numero_funcionarios') && companyAny.numero_funcionarios && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{companyAny.numero_funcionarios as string}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {isVisible('site_url') && company.site_url && (
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <a href={company.site_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-5 w-5 mr-2" />
                      Visitar Site
                    </a>
                  </Button>
                )}
                {isVisible('redes_sociais') && <SocialLinks links={redes} />}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {isVisible('descricao_completa') && company.descricao_completa && (
        <section className="py-24 bg-secondary relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="container">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <div className="w-16 h-1 bg-accent rounded-full mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                  Sobre a Empresa
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  <p className="text-lg whitespace-pre-line">{company.descricao_completa}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Products and Services Section */}
      {isVisible('produtos_servicos') && produtosServicos && (
        <section className="py-24 bg-background relative">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container relative">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <div className="w-16 h-1 bg-accent rounded-full mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <Package className="h-8 w-8 text-primary" />
                  Produtos e Serviços
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  <p className="text-lg whitespace-pre-line">{produtosServicos}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {isVisible('telefone') && isVisible('email') && hasContact && (
        <section className="py-24 bg-secondary">
          <div className="container">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Contato
                </h2>
              </div>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {isVisible('telefone') && company.telefone && (
                <StaggerItem>
                  <Card className="text-center shadow-elevated hover:shadow-card-hover transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Telefone</h3>
                      <p className="text-muted-foreground">{company.telefone}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              )}
              
              {isVisible('email') && company.email && (
                <StaggerItem>
                  <Card className="text-center shadow-elevated hover:shadow-card-hover transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">E-mail</h3>
                      <p className="text-muted-foreground">{company.email}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              )}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Address and Map Section */}
      {isVisible('endereco') && hasAddress && (
        <section className="py-24 bg-background relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="container relative">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Localização
                </h2>
              </div>
            </FadeIn>

            <div className="max-w-4xl mx-auto">
              <FadeIn delay={0.2}>
                <Card className="shadow-elevated overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2">
                      <div className="p-8 flex flex-col justify-center">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">Endereço</h3>
                        <div className="text-muted-foreground space-y-1">
                          {company.endereco && <p>{company.endereco}</p>}
                          <p>
                            {[company.cidade, company.estado].filter(Boolean).join(' - ')}
                            {company.cep && ` | CEP: ${company.cep}`}
                          </p>
                        </div>
                      </div>
                      <div className="min-h-[300px]">
                        <GoogleMap 
                          address={company.endereco || ''}
                          city={company.cidade || ''}
                          state={company.estado || ''}
                          cep={company.cep || ''}
                          className="h-full rounded-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>
      )}

      {/* Owner Section */}
      {company.dono && (
        <section className="py-24 bg-secondary relative">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container relative">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Proprietário
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="max-w-lg mx-auto shadow-elevated hover:shadow-card-hover transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                      {company.dono.foto_url ? (
                        <img 
                          src={company.dono.foto_url} 
                          alt={company.dono.nome} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-primary-foreground font-bold text-2xl">
                          {company.dono.nome?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {company.dono.nome}
                      </h3>
                      {company.dono.bio && (
                        <p className="text-muted-foreground line-clamp-2 mb-3">{company.dono.bio}</p>
                      )}
                      <Link 
                        to={`/membros/${company.dono.id}`}
                        className="inline-flex items-center text-primary font-semibold hover:gap-3 transition-all"
                      >
                        Ver Perfil
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 to-foreground" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Quer fazer parte do NCE?
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              Junte-se a empresários de sucesso e expanda sua rede de contatos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/seja-nucleado">Seja um Nucleado</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/empresas">Ver Outras Empresas</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
