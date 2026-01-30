import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MemberCard } from '@/components/MemberCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useProfiles } from '@/hooks/useProfiles';
import { useListingPageHero } from '@/hooks/useGlobalConfig';

export default function Members() {
  const { data: members, isLoading } = useProfiles();
  const { data: heroContent } = useListingPageHero('membros');
  const [searchTerm, setSearchTerm] = useState('');

  const badge = heroContent?.badge || 'Nossa Comunidade';
  const titulo = heroContent?.titulo || 'Nossos Nucleados';
  const subtitulo = heroContent?.subtitulo || 
    'Conheça os empresários de alto nível que fazem parte do NCE. Líderes comprometidos com a excelência e o crescimento mútuo.';

  const filteredMembers = members?.filter(member => 
    member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background">
        <div className="container">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Users className="h-4 w-4" />
              {badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {titulo.includes('Nucleados') ? (
                <>
                  Nossos{" "}
                  <span className="text-accent">Nucleados</span>
                </>
              ) : titulo}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {subtitulo}
            </p>
            
            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar membro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16 bg-secondary">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <>
              <FadeIn>
                <p className="text-muted-foreground mb-8">
                  {filteredMembers.length} {filteredMembers.length === 1 ? 'membro encontrado' : 'membros encontrados'}
                </p>
              </FadeIn>
              <StaggerContainer className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" staggerDelay={0.05}>
                {filteredMembers.map((member) => (
                  <StaggerItem key={member.id}>
                    <Link to={`/membros/${member.id}`}>
                      <MemberCard
                        nome={member.nome}
                        fotoUrl={member.foto_url}
                        setor="Empresário"
                      />
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {searchTerm ? 'Nenhum membro encontrado' : 'Nenhum nucleado cadastrado'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente buscar por outro termo ou limpe a busca para ver todos os membros.'
                  : 'Os membros aparecerão aqui quando forem aprovados pelo administrador.'}
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
