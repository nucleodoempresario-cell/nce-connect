import { Building2, ArrowRight } from 'lucide-react';
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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl bg-card border border-border"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[16/10] relative bg-secondary flex items-center justify-center p-6">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={nome}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Building2 className="h-16 w-16 text-muted-foreground/30" />
          )}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {nome}
          </h3>
          {descricaoCurta && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {descricaoCurta}
            </p>
          )}
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Ver Detalhes
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
