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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl bg-white"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative bg-slate-100 overflow-hidden">
          {imagemCapa ? (
            <img
              src={imagemCapa}
              alt={titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-medium text-slate-700 shadow-sm">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {titulo}
          </h3>
          {resumo && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {resumo}
            </p>
          )}
          <Button variant="link" className="p-0 h-auto text-primary gap-1 font-semibold">
            Ler mais <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
