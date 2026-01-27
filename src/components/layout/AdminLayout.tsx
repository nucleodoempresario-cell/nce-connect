import { Link, useLocation } from 'react-router-dom';
import { Users, Building2, FileText, ClipboardList, Newspaper, ArrowLeft, LayoutDashboard, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/empresas', label: 'Empresas', icon: Building2 },
  { href: '/admin/noticias', label: 'Notícias', icon: Newspaper },
  { href: '/admin/formulario', label: 'Formulário', icon: FileText },
  { href: '/admin/inscricoes', label: 'Inscrições', icon: ClipboardList },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/admin/admins', label: 'Admins', icon: ShieldCheck },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-secondary-foreground hover:text-secondary-foreground/80" asChild>
              <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Link>
            </Button>
            <span className="font-semibold">Painel Administrativo</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button 
              key={href} 
              variant={location.pathname === href ? 'default' : 'outline'} 
              size="sm" 
              asChild 
              className={cn(location.pathname === href && 'pointer-events-none')}
            >
              <Link to={href}><Icon className="h-4 w-4 mr-2" />{label}</Link>
            </Button>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
