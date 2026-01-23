import { Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CompanyCardProps {
  nome: string;
  logoUrl?: string | null;
  descricaoCurta?: string | null;
  onClick?: () => void;
}

export function CompanyCard({ nome, logoUrl, descricaoCurta, onClick }: CompanyCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative bg-muted flex items-center justify-center p-6">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={nome}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <Building2 className="h-16 w-16 text-muted-foreground/50" />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
            {nome}
          </h3>
          {descricaoCurta && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {descricaoCurta}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
