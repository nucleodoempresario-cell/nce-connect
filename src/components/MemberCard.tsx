import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MemberCardProps {
  nome: string;
  fotoUrl?: string | null;
  setor?: string;
  onClick?: () => void;
}

export function MemberCard({ nome, fotoUrl, setor, onClick }: MemberCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-500 shadow-elevated hover:shadow-card-hover hover:-translate-y-2 bg-card border-0"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center">
        <div className="w-28 h-28 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-500">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={nome}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
              <span className="text-4xl font-bold text-primary">
                {nome.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {nome}
        </h3>
        {setor && (
          <p className="text-muted-foreground mb-4">{setor}</p>
        )}
        <span className="inline-flex items-center font-semibold text-primary group-hover:gap-3 transition-all">
          Ver Perfil
          <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-2 transition-transform" />
        </span>
      </CardContent>
    </Card>
  );
}
