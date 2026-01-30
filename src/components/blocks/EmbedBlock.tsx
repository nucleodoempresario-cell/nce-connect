import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/SectionTitle';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { CompanyCard } from '@/components/CompanyCard';
import { MemberCard } from '@/components/MemberCard';
import { NewsCard } from '@/components/NewsCard';
import { EmbedContent } from '@/types/pageBlocks';
import { useCompanies } from '@/hooks/useCompanies';
import { useProfiles } from '@/hooks/useProfiles';
import { useNews } from '@/hooks/useNews';
import { ArrowRight } from 'lucide-react';

interface EmbedBlockProps {
  content: EmbedContent | unknown;
}

export function EmbedBlock({ content }: EmbedBlockProps) {
  const data = content as EmbedContent;
  
  const { data: companies } = useCompanies();
  const { data: members } = useProfiles();
  const { data: news } = useNews();
  
  const limite = data.limite || 3;
  
  // Formulário de candidatura é renderizado diferente
  if (data.tipo === 'formulario_candidatura') {
    return null; // Formulário é handled diretamente na página
  }
  
  // Empresas
  if (data.tipo === 'empresas') {
    const items = companies?.slice(0, limite) || [];
    if (items.length === 0) return null;
    
    return (
      <section className="relative py-28 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          {(data.titulo || data.subtitulo) && (
            <SectionTitle title={data.titulo || ''} subtitle={data.subtitulo} />
          )}
          
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {items.map((company) => (
              <StaggerItem key={company.id}>
                <Link to={`/empresas/${company.id}`}>
                  <CompanyCard
                    nome={company.nome}
                    logoUrl={company.logo_url}
                    descricaoCurta={company.descricao_curta}
                  />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {data.botao && (
            <div className="text-center mt-14">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-2" asChild>
                <Link to={data.botao.link}>
                  {data.botao.texto}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }
  
  // Membros
  if (data.tipo === 'membros') {
    const items = members?.slice(0, limite) || [];
    if (items.length === 0) return null;
    
    return (
      <section className="relative py-28 bg-secondary overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          {(data.titulo || data.subtitulo) && (
            <SectionTitle title={data.titulo || ''} subtitle={data.subtitulo} />
          )}
          
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
            {items.map((member) => (
              <StaggerItem key={member.id}>
                <Link to="/membros">
                  <MemberCard
                    nome={member.nome}
                    fotoUrl={member.foto_url}
                    setor="Empresário"
                  />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {data.botao && (
            <div className="text-center mt-14">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-2" asChild>
                <Link to={data.botao.link}>
                  {data.botao.texto}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }
  
  // Notícias
  if (data.tipo === 'noticias') {
    const items = news?.slice(0, limite) || [];
    if (items.length === 0) return null;
    
    return (
      <section className="relative py-28 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          {(data.titulo || data.subtitulo) && (
            <SectionTitle title={data.titulo || ''} subtitle={data.subtitulo} />
          )}
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10" staggerDelay={0.1}>
            {items.map((article) => (
              <StaggerItem key={article.id}>
                <Link to={`/noticias/${article.id}`}>
                  <NewsCard
                    titulo={article.titulo}
                    resumo={article.resumo}
                    imagemCapa={article.imagem_capa}
                    createdAt={article.created_at}
                  />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {data.botao && (
            <div className="text-center mt-14">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-2" asChild>
                <Link to={data.botao.link}>
                  {data.botao.texto}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }
  
  return null;
}
