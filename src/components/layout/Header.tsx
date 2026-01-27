import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import logoNce from '@/assets/logo-nce.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'O NCE' },
  { href: '/empresas', label: 'Empresas' },
  { href: '/membros', label: 'Membros' },
  { href: '/noticias', label: 'Notícias' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border/50" 
          : "bg-background"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoNce} 
            alt="NCE - Núcleo do Empresário" 
            className="h-12 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 h-11 px-4 rounded-full hover:bg-secondary border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="max-w-[100px] truncate font-medium">{profile?.nome?.split(' ')[0] || 'Conta'}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/painel" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    Meu Painel
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Painel Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-11 px-5 rounded-full text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
              <Button 
                size="sm" 
                className="h-11 px-6 rounded-full bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
                asChild
              >
                <Link to="/seja-nucleado">Seja Nucleado</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2.5 rounded-full text-foreground hover:bg-secondary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-lg">
          <nav className="container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" asChild className="justify-start h-12 rounded-xl">
                    <Link to="/painel" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Meu Painel
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild className="justify-start h-12 rounded-xl">
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
                    className="justify-start h-12 rounded-xl text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start h-12 rounded-xl text-muted-foreground">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-12 rounded-xl bg-primary hover:bg-primary/90 font-semibold"
                    asChild
                  >
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
