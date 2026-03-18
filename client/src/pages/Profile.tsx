import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  LogOut, 
  Shield, 
  Settings,
  Save,
  Camera
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  if (loading || !user) {
    return null; 
  }

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-card shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors border-2 border-card">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                  Cliente Premium
                </span>
                <span className="px-3 py-1 bg-secondary text-muted-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                  Membro desde 2024
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/orders')}
                className="border-border"
              >
                <Package className="w-4 h-4 mr-2" />
                Meus Pedidos
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="space-y-2">
              <Card className="p-2 space-y-1">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground text-left"
                >
                  <User className="w-4 h-4" /> Dados Pessoais
                </button>
                <button 
                  onClick={() => setLocation('/orders')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-foreground hover:bg-secondary text-left transition-colors"
                >
                  <Package className="w-4 h-4" /> Histórico de Pedidos
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-foreground hover:bg-secondary text-left transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Meus Endereços
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-foreground hover:bg-secondary text-left transition-colors"
                >
                  <Shield className="w-4 h-4" /> Segurança e Senha
                </button>
                <div className="border-t border-border my-2 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sair da conta
                  </button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-foreground">Informações da Conta</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-primary hover:text-primary hover:bg-primary/5"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Nome Completo</label>
                      <input 
                        type="text" 
                        defaultValue={user.name} 
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user.email} 
                        disabled={true}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Telefone</label>
                      <input 
                        type="tel" 
                        placeholder="(11) 99999-9999"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">CPF / CNPJ</label>
                      <input 
                        type="text" 
                        placeholder="000.000.000-00"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 flex justify-end">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-6">Preferências</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-foreground">Notificações por Email</p>
                      <p className="text-sm text-muted-foreground">Receba atualizações sobre seus pedidos por email.</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-foreground">Newsletter</p>
                      <p className="text-sm text-muted-foreground">Receba novidades sobre produtos e promoções.</p>
                    </div>
                    <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
