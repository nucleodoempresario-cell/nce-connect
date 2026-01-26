import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MemberCard } from '@/components/MemberCard';
import { SocialLinks } from '@/components/SocialLinks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useProfiles } from '@/hooks/useProfiles';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Members() {
  const { data: members, isLoading } = useProfiles();
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members?.filter(member => 
    member.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
        
        <motion.div 
          className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container relative z-10">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Users className="h-4 w-4" />
            Nossa Comunidade
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Nossos Nucleados
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-2xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Conheça os empresários de alto nível que fazem parte do NCE. 
            Líderes comprometidos com a excelência e o crescimento mútuo.
          </motion.p>
          
          {/* Search */}
          <motion.div 
            className="max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input 
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-20 bg-secondary">
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
                    <MemberCard
                      nome={member.nome}
                      fotoUrl={member.foto_url}
                      onClick={() => setSelectedMember(member)}
                    />
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

      {/* Member Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedMember?.nome}</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-36 h-36 rounded-full bg-secondary overflow-hidden shadow-lg border-4 border-accent">
                  {selectedMember.foto_url ? (
                    <img 
                      src={selectedMember.foto_url} 
                      alt={selectedMember.nome} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
                      <span className="text-white text-4xl font-bold">
                        {selectedMember.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedMember.bio && (
                <p className="text-muted-foreground text-center leading-relaxed">{selectedMember.bio}</p>
              )}

              <div className="flex justify-center">
                <SocialLinks 
                  links={(selectedMember.redes_sociais as Record<string, string>) || {}} 
                  size="lg"
                />
              </div>

              {(selectedMember.email || selectedMember.telefone) && (
                <div className="border-t pt-6 text-center space-y-2">
                  {selectedMember.email && (
                    <p className="text-muted-foreground">{selectedMember.email}</p>
                  )}
                  {selectedMember.telefone && (
                    <p className="text-muted-foreground">{selectedMember.telefone}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
