import { useState } from 'react';
import { Building2, Globe, X } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CompanyCard } from '@/components/CompanyCard';
import { SocialLinks } from '@/components/SocialLinks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanies } from '@/hooks/useCompanies';
import { Link } from 'react-router-dom';

export default function Companies() {
  const { data: companies, isLoading } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<typeof companies extends (infer T)[] ? T : never | null>(null);

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Empresas</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Conheça as empresas que fazem parte do NCE
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : companies && companies.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  nome={company.nome}
                  logoUrl={company.logo_url}
                  descricaoCurta={company.descricao_curta}
                  onClick={() => setSelectedCompany(company)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma empresa cadastrada</h3>
              <p className="text-muted-foreground">As empresas aparecerão aqui quando forem aprovadas.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCompany?.nome}</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              {selectedCompany.logo_url && (
                <div className="h-32 flex items-center justify-center bg-muted rounded-lg p-4">
                  <img src={selectedCompany.logo_url} alt={selectedCompany.nome} className="max-h-full max-w-full object-contain" />
                </div>
              )}
              
              {selectedCompany.descricao_completa && (
                <p className="text-muted-foreground">{selectedCompany.descricao_completa}</p>
              )}

              <div className="flex flex-wrap gap-4">
                {selectedCompany.site_url && (
                  <Button variant="outline" asChild>
                    <a href={selectedCompany.site_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" /> Visitar Site
                    </a>
                  </Button>
                )}
                <SocialLinks links={(selectedCompany.redes_sociais as Record<string, string>) || {}} />
              </div>

              {selectedCompany.dono && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Proprietário</h4>
                  <Link to={`/nucleados`} className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {selectedCompany.dono.foto_url ? (
                        <img src={selectedCompany.dono.foto_url} alt={selectedCompany.dono.nome} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold">{selectedCompany.dono.nome?.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-medium">{selectedCompany.dono.nome}</span>
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
