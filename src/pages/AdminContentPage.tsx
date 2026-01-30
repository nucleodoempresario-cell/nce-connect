import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LayoutGrid } from 'lucide-react';
import { PageBuilder } from '@/components/pagebuilder';

export default function AdminContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conteúdo do Site</h1>
          <p className="text-muted-foreground mt-1">
            Edite textos, imagens e configure os blocos de conteúdo de cada página.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              Page Builder
            </CardTitle>
            <CardDescription>
              Arraste, edite e organize os blocos de conteúdo de cada página. Selecione uma página abaixo para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PageBuilder />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
