import { Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { NewsCard } from '@/components/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useNews } from '@/hooks/useNews';

export default function News() {
  const { data: news, isLoading } = useNews();
  const navigate = useNavigate();

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notícias</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Fique por dentro das novidades do NCE
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  titulo={item.titulo}
                  resumo={item.resumo}
                  imagemCapa={item.imagem_capa}
                  createdAt={item.created_at}
                  onClick={() => navigate(`/noticias/${item.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma notícia publicada</h3>
              <p className="text-muted-foreground">As notícias aparecerão aqui quando forem publicadas.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
