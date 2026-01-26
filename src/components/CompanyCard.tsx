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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 border-t-primary"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative bg-slate-50 flex items-center justify-center p-6">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={nome}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Building2 className="h-16 w-16 text-slate-300" />
          )}
        </div>
        <div className="p-5 bg-white">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
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
