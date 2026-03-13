import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, ShoppingCart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="w-full px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 no-underline">
              <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-xl text-foreground">Cicote</h1>
                <p className="text-xs text-muted-foreground">Luthier</p>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#products">
              <a className="text-foreground hover:text-primary transition-colors font-medium">Produtos</a>
            </Link>
            <Link href="/#custom">
              <a className="text-foreground hover:text-primary transition-colors font-medium">Encomendas</a>
            </Link>
            <Link href="/#about">
              <a className="text-foreground hover:text-primary transition-colors font-medium">Sobre</a>
            </Link>
            <Link href="/contact">
              <a className="text-foreground hover:text-primary transition-colors font-medium">Contato</a>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-md transition-colors"
              title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-foreground" />
              )}
            </button>

            <Link href="/cart">
              <a className="relative p-2 hover:bg-secondary rounded-md transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold">0</span>
              </a>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 border-t border-border pt-3 space-y-2">
            <Link href="/#products">
              <a className="block text-foreground hover:text-primary transition-colors font-medium">Produtos</a>
            </Link>
            <Link href="/#custom">
              <a className="block text-foreground hover:text-primary transition-colors font-medium">Encomendas</a>
            </Link>
            <Link href="/#about">
              <a className="block text-foreground hover:text-primary transition-colors font-medium">Sobre</a>
            </Link>
            <Link href="/contact">
              <a className="block text-foreground hover:text-primary transition-colors font-medium">Contato</a>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
