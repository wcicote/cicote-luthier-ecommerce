import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder para lógica de autenticação
    console.log(isLogin ? 'Login' : 'Cadastro', { email, password, name });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card Principal */}
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {isLogin ? 'Bem-vindo' : 'Criar Conta'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? 'Faça login para acessar sua conta'
                  : 'Cadastre-se para começar a comprar'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border" />
                    <span className="text-muted-foreground">Lembrar-me</span>
                  </label>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium">
                    Esqueci a senha
                  </a>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Google Login */}
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-background hover:bg-secondary transition-colors text-foreground font-medium mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </button>

            {/* Toggle */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-secondary border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Dica:</strong> Você pode usar sua conta Google para fazer login rapidamente e com segurança.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
