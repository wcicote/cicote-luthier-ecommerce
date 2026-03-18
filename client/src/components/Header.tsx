import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ShoppingCart, Moon, Sun, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems, totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const cartCount = totalItems;

  const handleSignOut = async () => {
    await logout();
    setLocation('/login');
  };

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
              <a className="relative p-2 hover:bg-secondary rounded-md transition-colors" title="Carrinho">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </a>
            </Link>

            {/* User Account Section */}
            <div className="hidden md:block relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 hover:bg-secondary rounded-md transition-colors border border-transparent hover:border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt={user.user_metadata.full_name || 'Usuário'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-2 z-[60] animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate italic">
                          {user?.email}
                        </p>
                      </div>
                      <Link href="/profile">
                        <a className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors no-underline">
                          <UserIcon className="w-4 h-4" /> Minha Conta
                        </a>
                      </Link>
                      <Link href="/orders">
                        <a className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors no-underline">
                          <ShoppingCart className="w-4 h-4" /> Meus Pedidos
                        </a>
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sair da conta
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <a className="no-underline">
                    <Button variant="outline" size="sm" className="font-display font-medium">
                      Entrar
                    </Button>
                  </a>
                </Link>
              )}
            </div>

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
              <a className="block text-foreground hover:text-primary transition-colors font-medium py-1">Produtos</a>
            </Link>
            <Link href="/#custom">
              <a className="block text-foreground hover:text-primary transition-colors font-medium py-1">Encomendas</a>
            </Link>
            <Link href="/#about">
              <a className="block text-foreground hover:text-primary transition-colors font-medium py-1">Sobre</a>
            </Link>
            <Link href="/contact">
              <a className="block text-foreground hover:text-primary transition-colors font-medium py-1">Contato</a>
            </Link>
            
            <div className="pt-2 mt-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <a className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                      <UserIcon className="w-4 h-4" /> Minha Conta
                    </a>
                  </Link>
                  <Link href="/orders">
                    <a className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2">
                      <ShoppingCart className="w-4 h-4" /> Meus Pedidos
                    </a>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors font-medium py-2 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sair da conta
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <a className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold py-2">
                    <LogOut className="w-4 h-4 rotate-180" /> Entrar / Cadastrar
                  </a>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
