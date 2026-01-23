import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative bg-muted">
          {imagemCapa ? (
            <img
              src={imagemCapa}
              alt={titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {titulo}
          </h3>
          {resumo && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {resumo}
            </p>
          )}
          <Button variant="link" className="p-0 h-auto text-primary gap-1">
            Ler mais <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
