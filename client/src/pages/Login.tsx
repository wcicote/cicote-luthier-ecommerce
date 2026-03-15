import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { signIn, isAuthenticated, loading } = useSupabaseAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar se já logado
  if (!loading && isAuthenticated) {
    setLocation('/');
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn();
      // Supabase OAuth redirects automatically
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao fazer login com Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        toast.success('Login realizado com sucesso!');
        setLocation('/');
      } else {
        await signUpWithEmail(email, password, name);
        toast.success('Conta criada! Verifique seu email para confirmar.');
        setMode('login');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo - Voltar para Home */}
          <div className="flex justify-center mb-8">
            <Link href="/">
              <a className="flex items-center gap-2 no-underline group">
                <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                  <span className="text-primary-foreground font-display font-bold text-xl">C</span>
                </div>
                <div>
                  <h1 className="font-display font-bold text-2xl text-foreground">Cicote</h1>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Luthier</p>
                </div>
              </a>
            </Link>
          </div>

          {/* Card Principal */}
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Entre para acessar seus pedidos e favoritos'
                  : 'Cadastre-se para começar a comprar'}
              </p>
            </div>

            {/* Google OAuth */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-border hover:border-primary/50 hover:bg-primary/5 mb-6 py-5 gap-3"
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </Button>

            {/* Divisor */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Formulário de email/senha */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="mt-1"
                    required={mode === 'register'}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                  required
                  minLength={6}
                />
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Aguarde...'
                  : mode === 'login' ? 'Entrar' : 'Criar conta'}
              </Button>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
                {' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Criar agora' : 'Entrar'}
                </button>
              </p>
            </div>
          </div>

          {/* Voltar */}
          <div className="text-center mt-6">
            <Link href="/">
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Voltar para a loja
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
