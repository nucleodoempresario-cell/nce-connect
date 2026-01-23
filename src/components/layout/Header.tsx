import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'O NCE' },
  { href: '/empresas', label: 'Empresas' },
  { href: '/membros', label: 'Membros' },
  { href: '/noticias', label: 'Notícias' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
            NCE
          </div>
          <span className="hidden sm:block font-semibold text-lg">
            Núcleo do Empresário
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.nome || 'Minha Conta'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/painel" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Meu Painel
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Painel Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/seja-nucleado">Seja Nucleado</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link to="/painel" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Meu Painel
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Painel Admin
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="justify-start text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="justify-start">
                    <Link to="/seja-nucleado" onClick={() => setIsMenuOpen(false)}>
                      Seja Nucleado
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
