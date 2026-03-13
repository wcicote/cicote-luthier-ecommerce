import { Link } from 'wouter';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold">C</span>
              </div>
              <h3 className="font-display font-bold text-lg">Cicote Luthier</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fabricação artesanal de banjos e acessórios premium para músicos profissionais.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#products">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Produtos</a>
                </Link>
              </li>
              <li>
                <Link href="/#custom">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Encomendas</a>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <a className="text-muted-foreground hover:text-primary transition-colors">Sobre</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-display font-semibold mb-4">Informações</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Termos de Serviço</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Frete e Entrega</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:contato@cicote.com" className="text-muted-foreground hover:text-primary transition-colors">contato@cicote.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+5511999999999" className="text-muted-foreground hover:text-primary transition-colors">+55 (11) 99999-9999</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Cicote Luthier. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Facebook</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
