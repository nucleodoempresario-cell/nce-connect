import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoNce from '@/assets/logo-nce.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/10">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Pronto para fazer parte?</h3>
              <p className="text-white/70">Junte-se aos empresários mais influentes da região.</p>
            </div>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 font-semibold"
                asChild
              >
                <Link to="/seja-nucleado">
                  Candidate-se Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/sobre">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoNce} 
                alt="NCE - Núcleo do Empresário" 
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              Uma comunidade exclusiva de empresários de alto nível, unidos pelo compromisso 
              com a excelência e o crescimento mútuo. Networking estratégico que gera resultados reais.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { label: 'O NCE', href: '/sobre' },
                { label: 'Empresas', href: '/empresas' },
                { label: 'Membros', href: '/membros' },
                { label: 'Notícias', href: '/noticias' },
                { label: 'Seja Nucleado', href: '/seja-nucleado' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-white/70 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/70">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span>contato@nce.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span>(00) 00000-0000</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Cidade, Estado<br />Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {currentYear} NCE - Núcleo do Empresário. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="#" className="hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
