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
        <div className="pt-24">
          <div className="container max-w-4xl py-8">
            <Skeleton className="h-10 w-32 mb-8" />
            <Skeleton className="h-14 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="aspect-video w-full rounded-xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!news) {
    return (
      <PageLayout>
        <div className="pt-24">
          <div className="container py-20 text-center">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Notícia não encontrada</h1>
            <p className="text-muted-foreground mb-8">A notícia que você procura não existe ou foi removida.</p>
            <Button asChild size="lg">
              <Link to="/noticias">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para notícias
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formattedDate = format(new Date(news.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <PageLayout>
      <article className="pt-24">
        <div className="container max-w-4xl py-8">
          <Button variant="ghost" asChild className="mb-8 -ml-4">
            <Link to="/noticias">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para notícias
            </Link>
          </Button>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {news.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>{formattedDate}</span>
              </div>
              {news.autor && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {news.autor.foto_url ? (
                      <img src={news.autor.foto_url} alt={news.autor.nome} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <span>{news.autor.nome}</span>
                </div>
              )}
            </div>
          </header>

          {news.imagem_capa && (
            <div className="aspect-video mb-10 rounded-2xl overflow-hidden bg-muted shadow-lg">
              <img 
                src={news.imagem_capa} 
                alt={news.titulo} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {news.resumo && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary pl-6">
              {news.resumo}
            </p>
          )}

          <div 
            className="news-content prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: news.conteudo }}
          />
        </div>
      </article>
    </PageLayout>
  );
}
