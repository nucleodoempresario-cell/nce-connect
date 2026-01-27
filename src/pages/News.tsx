import { Newspaper, Search } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { NewsCard } from '@/components/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useNews } from '@/hooks/useNews';
import { useListagemNoticiasContent } from '@/hooks/useContentTypes';

export default function News() {
  const { data: news, isLoading } = useNews();
  const { data: pageContent } = useListagemNoticiasContent();
  const [searchTerm, setSearchTerm] = useState('');

  const badge = pageContent?.badge || 'Fique Atualizado';
  const titulo = pageContent?.titulo || 'Notícias e Novidades';
  const subtitulo = pageContent?.subtitulo || 
    'Acompanhe as últimas notícias, eventos e acontecimentos do Núcleo do Empresário.';

  const filteredNews = news?.filter(item => 
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.resumo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-background">
        <div className="container">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Newspaper className="h-4 w-4" />
              {badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {titulo.includes('Novidades') ? (
                <>
                  Notícias e{" "}
                  <span className="text-accent">Novidades</span>
                </>
              ) : titulo}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {subtitulo}
            </p>
            
            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar notícia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-secondary">
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
              <FadeIn>
                <p className="text-muted-foreground mb-8">
                  {filteredNews.length} {filteredNews.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
                </p>
              </FadeIn>
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
                {filteredNews.map((item) => (
                  <StaggerItem key={item.id}>
                    <Link to={`/noticias/${item.id}`}>
                      <NewsCard
                        titulo={item.titulo}
                        resumo={item.resumo}
                        imagemCapa={item.imagem_capa}
                        createdAt={item.created_at}
                      />
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </>
          ) : (
            <FadeIn className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Newspaper className="h-10 w-10 text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {searchTerm ? 'Nenhuma notícia encontrada' : 'Nenhuma notícia publicada'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente buscar por outro termo ou limpe a busca para ver todas as notícias.'
                  : 'As notícias aparecerão aqui quando forem publicadas.'}
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
