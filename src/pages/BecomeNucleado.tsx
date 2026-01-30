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

import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useCreateApplication } from '@/hooks/useApplications';

export default function BecomeNucleado() {
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
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <CheckCircle className="h-10 w-10 text-primary" />
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
      <section className="pt-28 pb-16 bg-background">
        <div className="container">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Star className="h-4 w-4" />
              Processo Seletivo
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Seja um{" "}
              <span className="text-accent">Nucleado</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Faça parte de uma comunidade exclusiva de empresários de alto nível. 
              Candidate-se e descubra o que podemos construir juntos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Cards */}
      <section className="py-8 bg-background">
        <div className="container">
          <StaggerContainer className="grid md:grid-cols-3 gap-4" staggerDelay={0.1}>
            {benefits.map(({ icon: Icon, title, description }, i) => (
              <StaggerItem key={i}>
                <Card className="bg-card shadow-lg border-0">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
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
        <div className="container">
          {/* Form */}
          <FadeIn>
            <Card className="border-0 shadow-lg bg-card max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-foreground text-2xl">Formulário de Candidatura</CardTitle>
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
                      className="w-full h-14 text-lg bg-primary hover:bg-primary/90 font-semibold" 
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
      </section>
    </PageLayout>
  );
}
