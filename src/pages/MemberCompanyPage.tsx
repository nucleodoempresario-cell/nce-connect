import { Link, useLocation } from 'react-router-dom';
import { User, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import EditCompany from './member/EditCompany';

const navItems = [
  { href: '/painel', label: 'Meu Perfil', icon: User },
  { href: '/painel/empresa', label: 'Minha Empresa', icon: Building2 },
];

export default function MemberCompanyPage() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao site</Link>
            </Button>
            <span className="font-semibold">Painel do Membro</span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant={location.pathname === href ? 'default' : 'outline'} asChild className={cn(location.pathname === href && 'pointer-events-none')}>
              <Link to={href}><Icon className="h-4 w-4 mr-2" />{label}</Link>
            </Button>
          ))}
        </nav>

        <EditCompany />
      </div>
    </div>
  );
}
