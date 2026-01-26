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

  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !isScrolled && !isMenuOpen;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showTransparent 
          ? "bg-transparent" 
          : "bg-white shadow-md"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoNce} 
            alt="NCE - Núcleo do Empresário" 
            className={cn(
              "h-12 w-auto transition-all duration-300",
              showTransparent && "brightness-0 invert"
            )}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive(link.href)
                  ? showTransparent
                    ? "bg-white/15 text-white"
                    : "text-primary font-semibold"
                  : showTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "gap-2 h-10 px-4",
                    showTransparent 
                      ? "border-white/30 text-white hover:bg-white/10 bg-white/10" 
                      : "border-slate-200 hover:border-primary"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    showTransparent ? "bg-white/20" : "bg-primary/10"
                  )}>
                    <User className={cn("h-3.5 w-3.5", showTransparent ? "text-white" : "text-primary")} />
                  </div>
                  <span className="max-w-[100px] truncate">{profile?.nome?.split(' ')[0] || 'Conta'}</span>
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
                className={cn(
                  "h-10",
                  showTransparent 
                    ? "text-white hover:bg-white/10" 
                    : "text-slate-700 hover:text-primary"
                )}
                asChild
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
              <Button 
                size="sm" 
                className="h-10 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg"
                asChild
              >
                <Link to="/seja-nucleado">Seja Nucleado</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-lg transition-colors",
            showTransparent ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <nav className="container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-4 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" asChild className="justify-start h-11">
                    <Link to="/painel" onClick={() => setIsMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Meu Painel
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild className="justify-start h-11">
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
                    className="justify-start h-11 text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start h-11 text-slate-700">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
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
