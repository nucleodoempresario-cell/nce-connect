import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NewsCardProps {
  titulo: string;
  resumo?: string | null;
  imagemCapa?: string | null;
  createdAt: string;
  onClick?: () => void;
}

export function NewsCard({ titulo, resumo, imagemCapa, createdAt, onClick }: NewsCardProps) {
  const formattedDate = format(new Date(createdAt), "d 'de' MMMM, yyyy", { locale: ptBR });

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl bg-card border border-border"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden">
          {imagemCapa ? (
            <img
              src={imagemCapa}
              alt={titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary/20">NCE</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <span className="text-sm font-medium text-primary mb-2 block">
            {formattedDate}
          </span>
          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {titulo}
          </h3>
          {resumo && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {resumo}
            </p>
          )}
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Ler Mais
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
