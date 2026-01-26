import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Send, Loader2, Star, Users, Shield, Award, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useToast } from '@/hooks/use-toast';
import { useRequisitosContent } from '@/hooks/useSiteContent';
import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useCreateApplication } from '@/hooks/useApplications';

export default function BecomeNucleado() {
  const { data: requisitos } = useRequisitosContent();
  const { data: questions } = useFormQuestions();
  const createApplication = useCreateApplication();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
  });
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createApplication.mutateAsync({
        nome_candidato: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        empresa_nome: formData.empresa,
        respostas: answers,
      });
      setSubmitted(true);
      toast({ title: 'Candidatura enviada!', description: 'Entraremos em contato em breve.' });
    } catch {
      toast({ title: 'Erro ao enviar', description: 'Tente novamente.', variant: 'destructive' });
    }
  };

  if (submitted) {
    return (
      <PageLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-secondary">
          <FadeIn className="text-center max-w-lg">
            <motion.div 
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <CheckCircle className="h-10 w-10 text-accent" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Candidatura Enviada!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Obrigado pelo interesse em fazer parte do NCE. 
              Nossa equipe analisará sua candidatura e entraremos em contato em breve.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/">
                Voltar para Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </PageLayout>
    );
  }

  const benefits = [
    { icon: Users, title: 'Networking Premium', description: 'Acesso a empresários de alto nível' },
    { icon: Shield, title: 'Ambiente de Confiança', description: 'Grupo seleto e comprometido' },
    { icon: Award, title: 'Eventos Exclusivos', description: 'Encontros mensais e workshops' },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
        
        <motion.div 
          className="absolute top-1/4 -left-32 w-64 h-64 bg-accent/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container relative z-10">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Star className="h-4 w-4" />
            Processo Seletivo
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Seja um Nucleado
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Faça parte de uma comunidade exclusiva de empresários de alto nível. 
            Candidate-se e descubra o que podemos construir juntos.
          </motion.p>
        </div>
      </section>

      {/* Benefits Cards */}
      <section className="relative -mt-10 z-20 pb-12">
        <div className="container">
          <StaggerContainer className="grid md:grid-cols-3 gap-4" staggerDelay={0.1}>
            {benefits.map(({ icon: Icon, title, description }, i) => (
              <StaggerItem key={i}>
                <Card className="bg-white shadow-xl border-0">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-secondary">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Requirements */}
            <FadeIn direction="right" className="lg:col-span-2">
              <Card className="sticky top-28 border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    {requisitos?.titulo || 'Requisitos para Participar'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {(requisitos?.requisitos || [
                      'Ser empresário ou líder de negócio',
                      'Comprometimento com os valores do grupo',
                      'Disponibilidade para participar dos encontros',
                      'Interesse genuíno em networking',
                      'Postura ética e colaborativa'
                    ]).map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 p-4 rounded-xl bg-secondary">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Processo seletivo:</strong> Após o envio, 
                      sua candidatura será analisada pela nossa equipe. Retornaremos em até 7 dias úteis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Form */}
            <FadeIn direction="left" delay={0.2} className="lg:col-span-3">
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-foreground">Formulário de Candidatura</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome" className="text-foreground">Nome completo *</Label>
                        <Input 
                          id="nome" 
                          value={formData.nome} 
                          onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                          required 
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          required 
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="text-foreground">Telefone</Label>
                        <Input 
                          id="telefone" 
                          value={formData.telefone} 
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})} 
                          className="h-12"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa" className="text-foreground">Nome da Empresa</Label>
                        <Input 
                          id="empresa" 
                          value={formData.empresa} 
                          onChange={(e) => setFormData({...formData, empresa: e.target.value})} 
                          className="h-12"
                        />
                      </div>
                    </div>

                    {questions?.map((q) => (
                      <div key={q.id} className="space-y-2">
                        <Label className="text-foreground">
                          {q.texto_pergunta} {q.obrigatoria && <span className="text-destructive">*</span>}
                        </Label>
                        {q.tipo === 'texto_curto' && (
                          <Input 
                            value={(answers[q.id] as string) || ''} 
                            onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} 
                            required={q.obrigatoria}
                            className="h-12"
                          />
                        )}
                        {q.tipo === 'texto_longo' && (
                          <Textarea 
                            value={(answers[q.id] as string) || ''} 
                            onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} 
                            required={q.obrigatoria}
                            rows={4}
                          />
                        )}
                        {q.tipo === 'checkbox' && (
                          <div className="flex items-center gap-3 py-2">
                            <Checkbox 
                              checked={!!answers[q.id]} 
                              onCheckedChange={(checked) => setAnswers({...answers, [q.id]: !!checked})} 
                            />
                            <span className="text-muted-foreground">Sim</span>
                          </div>
                        )}
                        {q.tipo === 'multipla_escolha' && (
                          <RadioGroup 
                            value={(answers[q.id] as string) || ''} 
                            onValueChange={(val) => setAnswers({...answers, [q.id]: val})} 
                            className="space-y-2 pt-2"
                          >
                            {((q.opcoes as string[]) || []).map((opt) => (
                              <div key={opt} className="flex items-center gap-3">
                                <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                                <Label htmlFor={`${q.id}-${opt}`} className="font-normal text-foreground cursor-pointer">
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    ))}

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" 
                      disabled={createApplication.isPending}
                    >
                      {createApplication.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-5 w-5" />
                      )}
                      Enviar Candidatura
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
