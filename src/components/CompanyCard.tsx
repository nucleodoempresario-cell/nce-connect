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
      className="group cursor-pointer overflow-hidden transition-all duration-500 shadow-elevated hover:shadow-card-hover hover:-translate-y-2 bg-card border-0"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[16/10] relative bg-gradient-to-br from-secondary to-muted flex items-center justify-center p-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={nome}
              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Building2 className="h-20 w-20 text-muted-foreground/20" />
          )}
        </div>
        <div className="p-6">
          <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
            {nome}
          </h3>
          {descricaoCurta && (
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {descricaoCurta}
            </p>
          )}
          <span className="inline-flex items-center font-semibold text-primary group-hover:gap-3 transition-all">
            Ver Detalhes
            <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-2 transition-transform" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
