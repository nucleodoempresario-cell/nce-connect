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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl bg-card border border-border"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-secondary">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-3xl font-bold text-primary">
                {nome.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {nome}
        </h3>
        {setor && (
          <p className="text-sm text-muted-foreground mb-3">{setor}</p>
        )}
        <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
          Ver Perfil
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </span>
      </CardContent>
    </Card>
  );
}
