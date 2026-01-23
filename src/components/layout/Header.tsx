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
          : "bg-background/95 backdrop-blur-xl border-b shadow-sm"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={cn(
            "flex items-center justify-center w-11 h-11 rounded-xl font-bold text-lg transition-all duration-300",
            showTransparent 
              ? "bg-white/10 backdrop-blur-sm text-white border border-white/20" 
              : "bg-primary text-primary-foreground"
          )}>
            NCE
          </div>
          <div className="hidden sm:block">
            <span className={cn(
              "font-bold text-lg transition-colors duration-300",
              showTransparent ? "text-white" : "text-foreground"
            )}>
              Núcleo do Empresário
            </span>
          </div>
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
                    ? "bg-white/10 text-white"
                    : "bg-primary/10 text-primary"
                  : showTransparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                  variant={showTransparent ? "outline" : "outline"} 
                  size="sm" 
                  className={cn(
                    "gap-2 h-10 px-4",
                    showTransparent && "border-white/20 text-white hover:bg-white/10"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5" />
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
                  showTransparent && "text-white hover:bg-white/10"
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
                className="h-10 px-6 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg shadow-primary/25"
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
            showTransparent ? "text-white hover:bg-white/10" : "hover:bg-muted"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t">
          <nav className="container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
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
                  <Button variant="ghost" size="sm" asChild className="justify-start h-11">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-11 bg-gradient-to-r from-primary to-emerald-500"
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
