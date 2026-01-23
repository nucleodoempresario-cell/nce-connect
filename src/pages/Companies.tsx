import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CompanyCard } from '@/components/CompanyCard';
import { SocialLinks } from '@/components/SocialLinks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useCompanies } from '@/hooks/useCompanies';
import { Link } from 'react-router-dom';

export default function Companies() {
  const { data: companies, isLoading } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<typeof companies extends (infer T)[] ? T : never | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies?.filter(company => 
    company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-white/80">Nossos Parceiros</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Empresas{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              de Excelência
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-white/70 max-w-2xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Conheça as empresas que fazem parte do NCE. Cada uma representa 
            excelência em seu segmento e compartilha dos nossos valores.
          </motion.p>
          
          {/* Search */}
          <motion.div 
            className="max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.05}>
                {filteredCompanies.map((company) => (
                  <StaggerItem key={company.id}>
                    <CompanyCard
                      nome={company.nome}
                      logoUrl={company.logo_url}
                      descricaoCurta={company.descricao_curta}
                      onClick={() => setSelectedCompany(company)}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-muted-foreground/50" />
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

      {/* Company Modal */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedCompany?.nome}</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              {selectedCompany.logo_url && (
                <div className="h-40 flex items-center justify-center bg-muted rounded-xl p-6">
                  <img 
                    src={selectedCompany.logo_url} 
                    alt={selectedCompany.nome} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              )}
              
              {selectedCompany.descricao_completa && (
                <p className="text-muted-foreground leading-relaxed">{selectedCompany.descricao_completa}</p>
              )}

              <div className="flex flex-wrap gap-4">
                {selectedCompany.site_url && (
                  <Button asChild>
                    <a href={selectedCompany.site_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" /> Visitar Site
                    </a>
                  </Button>
                )}
                <SocialLinks links={(selectedCompany.redes_sociais as Record<string, string>) || {}} />
              </div>

              {selectedCompany.dono && (
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 text-foreground">Proprietário</h4>
                  <Link 
                    to="/membros" 
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {selectedCompany.dono.foto_url ? (
                        <img 
                          src={selectedCompany.dono.foto_url} 
                          alt={selectedCompany.dono.nome} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-primary font-bold text-lg">
                          {selectedCompany.dono.nome?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-foreground">{selectedCompany.dono.nome}</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
