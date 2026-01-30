import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import logoNce from '@/assets/logo-nce.png';
import { useGlobalConfig } from '@/hooks/useGlobalConfig';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: config } = useGlobalConfig();

  const descricao = config?.footer_descricao || 
    'Uma comunidade exclusiva de empresários de alto nível, unidos pelo compromisso com a excelência e o crescimento mútuo. Networking estratégico que gera resultados reais.';
  
  const instagramUrl = config?.footer_instagram || 'https://instagram.com';

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoNce} 
                alt="NCE - Núcleo do Empresário" 
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              {descricao}
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-10 h-10 rounded-lg bg-white/10 hover:bg-primary items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:justify-self-end">
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
