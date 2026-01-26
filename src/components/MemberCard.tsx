import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MemberCardProps {
  nome: string;
  fotoUrl?: string | null;
  onClick?: () => void;
}

export function MemberCard({ nome, fotoUrl, onClick }: MemberCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative bg-slate-100">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
              <span className="text-4xl font-bold text-white">
                {nome.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4 text-center border-t-4 border-t-accent">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {nome}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
