import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewsItem } from '@/hooks/useNews';

export default function NewsDetail() {
  const { id } = useParams();
  const { data: news, isLoading } = useNewsItem(id || '');

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="aspect-video w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!news) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Button asChild>
            <Link to="/noticias">Voltar para notícias</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const formattedDate = format(new Date(news.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <PageLayout>
      <article className="container py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/noticias">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.titulo}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {news.autor && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{news.autor.nome}</span>
              </div>
            )}
          </div>
        </header>

        {news.imagem_capa && (
          <div className="aspect-video mb-8 rounded-xl overflow-hidden bg-muted">
            <img src={news.imagem_capa} alt={news.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div 
          className="news-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: news.conteudo }}
        />
      </article>
    </PageLayout>
  );
}
