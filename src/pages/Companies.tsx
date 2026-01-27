import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CompanyCard } from '@/components/CompanyCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useCompanies } from '@/hooks/useCompanies';
import { useListagemEmpresasContent } from '@/hooks/useContentTypes';

export default function Companies() {
  const { data: companies, isLoading } = useCompanies();
  const { data: pageContent } = useListagemEmpresasContent();
  const [searchTerm, setSearchTerm] = useState('');

  const badge = pageContent?.badge || 'Empresas Parceiras';
  const titulo = pageContent?.titulo || 'Empresas do Núcleo';
  const subtitulo = pageContent?.subtitulo || 
    'Conheça as empresas que fazem parte da nossa comunidade de empresários de alto nível.';

  const filteredCompanies = companies?.filter(company => 
    company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Building2 className="h-4 w-4" />
              {badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {titulo}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {subtitulo}
            </p>
            
            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-24 bg-secondary relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredCompanies && filteredCompanies.length > 0 ? (
            <>
              <FadeIn>
                <p className="text-muted-foreground mb-8">
                  {filteredCompanies.length} {filteredCompanies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
                </p>
              </FadeIn>
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" staggerDelay={0.05}>
                {filteredCompanies.map((company) => (
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
            </>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente buscar por outro termo ou limpe a busca para ver todas as empresas.'
                  : 'As empresas aparecerão aqui quando forem aprovadas pelo administrador.'}
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
