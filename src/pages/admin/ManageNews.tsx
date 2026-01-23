import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useAllNews, useCreateNews, useUpdateNews, useDeleteNews, useNewsItem } from '@/hooks/useNews';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

function NewsList() {
  const { data: news, isLoading } = useAllNews();
  const deleteNews = useDeleteNews();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta notícia?')) {
      await deleteNews.mutateAsync(id);
      toast({ title: 'Notícia excluída' });
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notícias</h1>
        <Button asChild><Link to="/admin/noticias/nova"><Plus className="h-4 w-4 mr-2" /> Nova Notícia</Link></Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.titulo}</TableCell>
                  <TableCell>{item.publicado ? <span className="text-green-600 flex items-center gap-1"><Eye className="h-4 w-4" /> Publicada</span> : <span className="text-muted-foreground flex items-center gap-1"><EyeOff className="h-4 w-4" /> Rascunho</span>}</TableCell>
                  <TableCell>{format(new Date(item.created_at), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" asChild><Link to={`/admin/noticias/editar/${item.id}`}><Edit className="h-4 w-4" /></Link></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NewsForm({ newsId }: { newsId?: string }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: existingNews } = useNewsItem(newsId || '');
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: existingNews?.titulo || '',
    resumo: existingNews?.resumo || '',
    conteudo: existingNews?.conteudo || '',
    imagem_capa: existingNews?.imagem_capa || '',
    publicado: existingNews?.publicado || false,
  });

  useState(() => {
    if (existingNews) {
      setFormData({
        titulo: existingNews.titulo,
        resumo: existingNews.resumo || '',
        conteudo: existingNews.conteudo,
        imagem_capa: existingNews.imagem_capa || '',
        publicado: existingNews.publicado,
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (newsId && existingNews) {
        await updateNews.mutateAsync({ id: newsId, updates: formData });
      } else {
        await createNews.mutateAsync({ ...formData, autor_id: profile?.id });
      }
      toast({ title: 'Notícia salva!' });
      navigate('/admin/noticias');
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{newsId ? 'Editar Notícia' : 'Nova Notícia'}</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><Label htmlFor="titulo">Título *</Label><Input id="titulo" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required /></div>
            <div><Label htmlFor="resumo">Resumo</Label><Textarea id="resumo" value={formData.resumo} onChange={(e) => setFormData({...formData, resumo: e.target.value})} rows={2} /></div>
            <div><Label htmlFor="imagem_capa">URL da Imagem de Capa</Label><Input id="imagem_capa" value={formData.imagem_capa} onChange={(e) => setFormData({...formData, imagem_capa: e.target.value})} placeholder="https://..." /></div>
            <div><Label>Conteúdo *</Label><RichTextEditor content={formData.conteudo} onChange={(content) => setFormData({...formData, conteudo: content})} /></div>
            <div className="flex items-center gap-2"><Switch checked={formData.publicado} onCheckedChange={(checked) => setFormData({...formData, publicado: checked})} /><Label>Publicar</Label></div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/noticias')}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManageNews() {
  return (
    <Routes>
      <Route index element={<NewsList />} />
      <Route path="nova" element={<NewsForm />} />
      <Route path="editar/:id" element={<NewsFormWrapper />} />
    </Routes>
  );
}

function NewsFormWrapper() {
  const { id } = require('react-router-dom').useParams();
  return <NewsForm newsId={id} />;
}
