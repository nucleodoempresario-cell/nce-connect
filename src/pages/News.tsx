import { Newspaper, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { NewsCard } from '@/components/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useNews } from '@/hooks/useNews';

export default function News() {
  const { data: news, isLoading } = useNews();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = news?.filter(item => 
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.resumo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <Newspaper className="h-4 w-4 text-primary" />
            <span className="text-sm text-white/80">Fique Atualizado</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl">
            Notícias e{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Novidades
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl leading-relaxed mb-8">
            Acompanhe as últimas notícias, eventos e acontecimentos 
            do Núcleo do Empresário.
          </p>
          
          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input 
                placeholder="Buscar notícia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredNews && filteredNews.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                {filteredNews.length} {filteredNews.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item) => (
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
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <Newspaper className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {searchTerm ? 'Nenhuma notícia encontrada' : 'Nenhuma notícia publicada'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente buscar por outro termo ou limpe a busca para ver todas as notícias.'
                  : 'As notícias aparecerão aqui quando forem publicadas.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
