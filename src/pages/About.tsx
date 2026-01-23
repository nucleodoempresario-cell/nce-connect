import { Target, Eye, Heart, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useInstitucionalContent } from '@/hooks/useSiteContent';

export default function About() {
  const { data: content } = useInstitucionalContent();

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">O NCE</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Conheça nossa história, missão e valores que guiam o Núcleo do Empresário
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Missão</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {content?.missao || 'Conectar lideranças empresariais para fortalecer o desenvolvimento econômico regional.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Visão</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {content?.visao || 'Ser referência em networking empresarial.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Valores</h2>
                </div>
                <ul className="space-y-2">
                  {(content?.valores || ['Ética', 'Colaboração', 'Inovação']).map((valor, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {valor}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Objetivos Estratégicos</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {(content?.objetivos || [
                'Promover networking de qualidade',
                'Facilitar parcerias estratégicas',
                'Compartilhar conhecimentos'
              ]).map((objetivo, i) => (
                <li key={i} className="flex items-start gap-4 bg-card p-4 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="text-lg">{objetivo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
