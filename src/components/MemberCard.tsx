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
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative bg-muted">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {nome}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
