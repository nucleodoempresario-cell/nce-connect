import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/10">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Pronto para fazer parte?</h3>
              <p className="text-white/60">Junte-se aos empresários mais influentes da região.</p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-lg"
              asChild
            >
              <Link to="/seja-nucleado">
                Candidate-se Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 text-white font-bold text-lg">
                NCE
              </div>
              <div>
                <span className="font-bold text-xl">Núcleo do Empresário</span>
                <p className="text-sm text-white/50">Onde líderes se conectam</p>
              </div>
            </div>
            <p className="text-white/60 mb-6 max-w-md leading-relaxed">
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
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
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
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
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
              <li className="flex items-center gap-3 text-white/60">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span>contato@nce.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span>(00) 00000-0000</span>
              </li>
              <li className="flex items-start gap-3 text-white/60">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Cidade, Estado<br />Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© {currentYear} NCE - Núcleo do Empresário. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacidade</Link>
            <Link to="#" className="hover:text-white transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
