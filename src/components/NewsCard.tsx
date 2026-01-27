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
      className="group cursor-pointer overflow-hidden transition-all duration-500 shadow-elevated hover:shadow-card-hover hover:-translate-y-2 bg-card border-0"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden">
          {imagemCapa ? (
            <img
              src={imagemCapa}
              alt={titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
              <span className="text-7xl font-black text-primary/15">NCE</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="p-6">
          <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
            {formattedDate}
          </span>
          <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {titulo}
          </h3>
          {resumo && (
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {resumo}
            </p>
          )}
          <span className="inline-flex items-center font-semibold text-primary group-hover:gap-3 transition-all">
            Ler Mais
            <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-2 transition-transform" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
