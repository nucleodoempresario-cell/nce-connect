import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                NCE
              </div>
              <span className="font-semibold text-lg">Núcleo do Empresário</span>
            </div>
            <p className="text-secondary-foreground/80 mb-4 max-w-md">
              Conectando lideranças empresariais para fortalecer o desenvolvimento 
              econômico regional através do networking qualificado.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sobre"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  O NCE
                </Link>
              </li>
              <li>
                <Link
                  to="/empresas"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  Empresas
                </Link>
              </li>
              <li>
                <Link
                  to="/nucleados"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  Nucleados
                </Link>
              </li>
              <li>
                <Link
                  to="/noticias"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  Notícias
                </Link>
              </li>
              <li>
                <Link
                  to="/seja-nucleado"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                >
                  Seja Nucleado
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>contato@nce.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>(00) 00000-0000</span>
              </li>
              <li className="flex items-start gap-2 text-secondary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Cidade, Estado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-secondary-foreground/60 text-sm">
          <p>© {currentYear} NCE - Núcleo do Empresário. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
