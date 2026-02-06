import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/layout/PageLayout';
import logoNce from '@/assets/logo-nce.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const signUpSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/painel';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { nome: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      let description = 'Ocorreu um erro inesperado. Tente novamente.';
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('invalid login credentials')) {
        description = 'Email ou senha incorretos. Verifique seus dados e tente novamente.';
      } else if (msg.includes('email not confirmed')) {
        description = 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada (e spam) e clique no link de confirmação.';
      } else if (msg.includes('too many requests') || msg.includes('rate limit')) {
        description = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
      } else if (msg.includes('network') || msg.includes('fetch')) {
        description = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (msg.includes('user not found')) {
        description = 'Nenhuma conta encontrada com este email.';
      }
      toast({
        title: 'Não foi possível entrar',
        description,
        variant: 'destructive',
      });
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.nome);
    setIsLoading(false);

    if (error) {
      let description = 'Ocorreu um erro inesperado. Tente novamente.';
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('already registered') || msg.includes('already been registered')) {
        description = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      } else if (msg.includes('password') && msg.includes('weak')) {
        description = 'A senha é muito fraca. Use pelo menos 6 caracteres com letras e números.';
      } else if (msg.includes('valid email') || msg.includes('invalid email')) {
        description = 'Por favor, insira um email válido.';
      } else if (msg.includes('rate limit') || msg.includes('too many')) {
        description = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      }
      toast({
        title: 'Não foi possível cadastrar',
        description,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso. Aguarde a aprovação de um administrador para acessar o sistema.',
      });
    }
  };

  return (
    <PageLayout showFooter={false}>
      <div className="min-h-screen pt-20 flex items-center justify-center p-4 bg-secondary">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <img 
                src={logoNce} 
                alt="NCE - Núcleo do Empresário" 
                className="h-16 mx-auto mb-4"
              />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao NCE</h1>
            <p className="text-muted-foreground">Acesse sua conta ou cadastre-se</p>
          </div>

          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="pt-6">
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="signup">
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                      <FormField
                        control={signUpForm.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Confirmar Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" className="h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="lg" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Cadastrar
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Ainda não faz parte do NCE?{' '}
            <Link to="/seja-nucleado" className="text-primary hover:underline font-medium">
              Candidate-se agora
              <ArrowRight className="inline ml-1 h-3 w-3" />
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
