import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Clock } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/animations';
import { useNewsItem, useNews } from '@/hooks/useNews';
import { NewsCard } from '@/components/NewsCard';

export default function NewsDetail() {
  const { id } = useParams();
  const { data: news, isLoading } = useNewsItem(id || '');
  const { data: relatedNews } = useNews(4);

  // Filter out current news from related
  const otherNews = relatedNews?.filter(n => n.id !== id)?.slice(0, 3);

  // Estimate reading time (average 200 words per minute)
  const estimateReadingTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background">
          {/* Hero skeleton */}
          <div className="relative w-full h-[60vh] bg-slate-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="container">
                <Skeleton className="h-8 w-32 mb-6 bg-white/20" />
                <Skeleton className="h-16 w-3/4 mb-4 bg-white/20" />
                <Skeleton className="h-6 w-1/3 bg-white/20" />
              </div>
            </div>
          </div>
          <div className="container py-16">
            <div className="max-w-4xl mx-auto space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!news) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <FadeIn className="text-center px-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-8">
              <ArrowLeft className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Notícia não encontrada</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              A notícia que você procura não existe ou foi removida.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/noticias">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar para notícias
              </Link>
            </Button>
          </FadeIn>
        </div>
      </PageLayout>
    );
  }

  const formattedDate = format(new Date(news.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const readingTime = estimateReadingTime(news.conteudo);

  return (
    <PageLayout>
      <article className="min-h-screen bg-background">
        {/* Hero Section with Cover Image */}
        <header className="relative w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] bg-slate-900 overflow-hidden">
          {/* Background Image */}
          {news.imagem_capa && (
            <motion.div 
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={news.imagem_capa} 
                alt={news.titulo} 
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
          
          {/* Back Button */}
          <motion.div
            className="absolute top-24 md:top-28 left-0 right-0 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="container">
              <Button 
                variant="ghost" 
                asChild 
                className="text-white/80 hover:text-white hover:bg-white/10 -ml-4"
              >
                <Link to="/noticias">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para notícias
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="container pb-12 md:pb-16 lg:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-4xl"
              >
                <Badge className="bg-primary text-primary-foreground mb-6 text-sm px-4 py-1.5">
                  Notícia
                </Badge>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                  {news.titulo}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm md:text-base">{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm md:text-base">{readingTime} min de leitura</span>
                  </div>
                  
                  {news.autor && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                        {news.autor.foto_url ? (
                          <img src={news.autor.foto_url} alt={news.autor.nome} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm md:text-base">{news.autor.nome}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="relative bg-background">
          {/* Decorative element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
          
          <div className="container py-12 md:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto">
              {/* Summary/Lead */}
              {news.resumo && (
                <FadeIn>
                  <div className="relative mb-12 md:mb-16">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary to-accent rounded-full" />
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed pl-8 italic">
                      {news.resumo}
                    </p>
                  </div>
                </FadeIn>
              )}

              {/* Main Content */}
              <FadeIn delay={0.1}>
                <div 
                  className="news-content prose prose-lg md:prose-xl max-w-none 
                    prose-headings:text-foreground prose-headings:font-bold
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:marker:text-primary
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                    prose-img:rounded-xl prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: news.conteudo }}
                />
              </FadeIn>

              {/* Share Section */}
              <FadeIn delay={0.2}>
                <div className="mt-12 md:mt-16 pt-8 border-t border-border">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Share2 className="h-5 w-5" />
                      <span className="font-medium">Compartilhar esta notícia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a 
                          href={`https://wa.me/?text=${encodeURIComponent(news.titulo + ' - ' + window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a 
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Related News Section */}
        {otherNews && otherNews.length > 0 && (
          <section className="bg-secondary py-16 md:py-20 lg:py-24">
            <div className="container">
              <FadeIn>
                <div className="text-center mb-12">
                  <Badge className="bg-primary/10 text-primary mb-4">Continue lendo</Badge>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                    Outras Notícias
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {otherNews.map((item) => (
                    <Link key={item.id} to={`/noticias/${item.id}`}>
                      <NewsCard 
                        titulo={item.titulo}
                        resumo={item.resumo}
                        imagemCapa={item.imagem_capa}
                        createdAt={item.created_at}
                      />
                    </Link>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="text-center mt-12">
                  <Button asChild size="lg" variant="outline">
                    <Link to="/noticias">
                      Ver todas as notícias
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </section>
        )}
      </article>
    </PageLayout>
  );
}
