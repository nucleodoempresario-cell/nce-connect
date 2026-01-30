import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building2, ArrowLeft, ArrowRight, Loader2, Mail, Phone, Globe, Briefcase } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SocialLinks } from '@/components/SocialLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useProfile } from '@/hooks/useProfiles';
import { useMemberCompany } from '@/hooks/useCompanies';

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading, error } = useProfile(id || '');
  const { data: company, isLoading: loadingCompany } = useMemberCompany(id || '');

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (error || !member) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <User className="h-20 w-20 text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Membro não encontrado</h1>
          <Button asChild>
            <Link to="/membros">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Membros
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const memberAny = member as Record<string, unknown>;
  const redes = (member.redes_sociais as Record<string, string>) || {};
  const visibility = (memberAny.campos_visiveis as Record<string, boolean>) || {};
  
  // Helper to check visibility (default to true if not set)
  const isVisible = (field: string) => visibility[field] !== false;

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
              to="/membros" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Membros
            </Link>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Member Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/15 rounded-full blur-2xl" />
              
              <div className="relative bg-gradient-to-br from-secondary to-muted rounded-3xl shadow-hero p-12 flex items-center justify-center min-h-[400px]">
                {member.foto_url ? (
                  <img
                    src={member.foto_url}
                    alt={member.nome}
                    className="w-64 h-64 object-cover rounded-full shadow-elevated"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-7xl font-bold text-primary-foreground">
                      {member.nome?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Member Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  <User className="h-4 w-4" />
                  Nucleado NCE
                </div>
                {isVisible('cargo') && memberAny.cargo && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">
                    <Briefcase className="h-4 w-4" />
                    {memberAny.cargo as string}
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {member.nome}
              </h1>
              
              {isVisible('bio') && member.bio && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {member.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                {isVisible('website') && memberAny.website && (
                  <Button asChild size="lg" variant="outline">
                    <a href={memberAny.website as string} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-5 w-5 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {isVisible('redes_sociais') && <SocialLinks links={redes} />}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      {((isVisible('telefone') && member.telefone) || (isVisible('email') && member.email)) && (
        <section className="py-24 bg-secondary relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
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
              {isVisible('telefone') && member.telefone && (
                <StaggerItem>
                  <Card className="text-center shadow-elevated hover:shadow-card-hover transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">Telefone</h3>
                      <p className="text-muted-foreground">{member.telefone}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              )}
              
              {isVisible('email') && member.email && (
                <StaggerItem>
                  <Card className="text-center shadow-elevated hover:shadow-card-hover transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">E-mail</h3>
                      <p className="text-muted-foreground">{member.email}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              )}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Linked Company Section */}
      {!loadingCompany && company && (
        <section className="py-24 bg-background relative">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container relative">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Empresa
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="max-w-2xl mx-auto shadow-elevated hover:shadow-card-hover transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                      {company.logo_url ? (
                        <img 
                          src={company.logo_url} 
                          alt={company.nome} 
                          className="w-full h-full object-contain p-2" 
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {company.nome}
                      </h3>
                      {company.descricao_curta && (
                        <p className="text-muted-foreground line-clamp-2 mb-3">{company.descricao_curta}</p>
                      )}
                      <Link 
                        to={`/empresas/${company.id}`}
                        className="inline-flex items-center text-primary font-semibold hover:gap-3 transition-all"
                      >
                        Ver Empresa
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
              <Button asChild size="lg" variant="outlineDark">
                <Link to="/membros">Ver Outros Membros</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
