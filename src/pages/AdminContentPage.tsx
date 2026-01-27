import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Home, Info, Star, Building2, Settings } from 'lucide-react';
import { HomeContentEditor } from '@/components/admin/content/HomeContentEditor';
import { AboutContentEditor } from '@/components/admin/content/AboutContentEditor';
import { BecomeContentEditor } from '@/components/admin/content/BecomeContentEditor';
import { ListingPagesEditor } from '@/components/admin/content/ListingPagesEditor';
import { GlobalSettingsEditor } from '@/components/admin/content/GlobalSettingsEditor';

export default function AdminContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conteúdo do Site</h1>
          <p className="text-muted-foreground mt-1">
            Edite textos, imagens e configurações de todas as páginas do site.
          </p>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="sobre" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Sobre</span>
            </TabsTrigger>
            <TabsTrigger value="nucleado" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Seja Nucleado</span>
            </TabsTrigger>
            <TabsTrigger value="listagens" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Listagens</span>
            </TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Global</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Página Inicial
                </CardTitle>
                <CardDescription>
                  Edite todas as seções da página inicial do site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomeContentEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sobre">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Página Sobre
                </CardTitle>
                <CardDescription>
                  Edite as informações institucionais do NCE.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AboutContentEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nucleado">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Página Seja Nucleado
                </CardTitle>
                <CardDescription>
                  Edite o conteúdo da página de candidatura.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BecomeContentEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listagens">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Páginas de Listagem
                </CardTitle>
                <CardDescription>
                  Edite os textos das páginas de empresas, membros e notícias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ListingPagesEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Configurações Globais
                </CardTitle>
                <CardDescription>
                  Edite informações que aparecem em todo o site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GlobalSettingsEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
