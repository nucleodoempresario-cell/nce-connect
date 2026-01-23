import { useState } from 'react';
import { User } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MemberCard } from '@/components/MemberCard';
import { SocialLinks } from '@/components/SocialLinks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfiles } from '@/hooks/useProfiles';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Members() {
  const { data: members, isLoading } = useProfiles();
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nucleados</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Conheça os empresários que fazem parte do NCE
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  nome={member.nome}
                  fotoUrl={member.foto_url}
                  onClick={() => setSelectedMember(member)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum nucleado cadastrado</h3>
              <p className="text-muted-foreground">Os membros aparecerão aqui quando forem aprovados.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedMember?.nome}</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-muted overflow-hidden">
                  {selectedMember.foto_url ? (
                    <img src={selectedMember.foto_url} alt={selectedMember.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              </div>
              
              {selectedMember.bio && (
                <p className="text-muted-foreground text-center">{selectedMember.bio}</p>
              )}

              <div className="flex justify-center">
                <SocialLinks links={(selectedMember.redes_sociais as Record<string, string>) || {}} />
              </div>

              {(selectedMember.email || selectedMember.telefone) && (
                <div className="border-t pt-4 text-center text-sm text-muted-foreground">
                  {selectedMember.email && <p>{selectedMember.email}</p>}
                  {selectedMember.telefone && <p>{selectedMember.telefone}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
