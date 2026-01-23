import { useState } from 'react';
import { CheckCircle, Send, Loader2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Candidatura Enviada!</h1>
            <p className="text-muted-foreground">Obrigado pelo interesse. Analisaremos sua candidatura e entraremos em contato.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-16 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Seja um Nucleado</h1>
          <p className="text-xl opacity-90 max-w-2xl">Faça parte da nossa rede de empresários</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{requisitos?.titulo || 'Requisitos'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(requisitos?.requisitos || ['Ser empresário', 'Comprometimento']).map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formulário de Candidatura</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="empresa">Nome da Empresa</Label>
                    <Input id="empresa" value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})} />
                  </div>

                  {questions?.map((q) => (
                    <div key={q.id}>
                      <Label>{q.texto_pergunta} {q.obrigatoria && '*'}</Label>
                      {q.tipo === 'texto_curto' && (
                        <Input value={(answers[q.id] as string) || ''} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} required={q.obrigatoria} />
                      )}
                      {q.tipo === 'texto_longo' && (
                        <Textarea value={(answers[q.id] as string) || ''} onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} required={q.obrigatoria} />
                      )}
                      {q.tipo === 'checkbox' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox checked={!!answers[q.id]} onCheckedChange={(checked) => setAnswers({...answers, [q.id]: !!checked})} />
                          <span className="text-sm">Sim</span>
                        </div>
                      )}
                      {q.tipo === 'multipla_escolha' && (
                        <RadioGroup value={(answers[q.id] as string) || ''} onValueChange={(val) => setAnswers({...answers, [q.id]: val})} className="mt-2">
                          {((q.opcoes as string[]) || []).map((opt) => (
                            <div key={opt} className="flex items-center gap-2">
                              <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                              <Label htmlFor={`${q.id}-${opt}`}>{opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  ))}

                  <Button type="submit" className="w-full" disabled={createApplication.isPending}>
                    {createApplication.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Enviar Candidatura
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
