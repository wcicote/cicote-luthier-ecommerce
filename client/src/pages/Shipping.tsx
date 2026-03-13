import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Truck, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  const [selectedShipping, setSelectedShipping] = useState('super-frete');
  const [cep, setCep] = useState('');

  const shippingOptions = [
    {
      id: 'super-frete',
      name: 'Super Frete',
      description: 'Entrega rápida e confiável',
      estimatedDays: '2-3 dias úteis',
      price: 29.90,
      features: ['Rastreamento em tempo real', 'Seguro incluído', 'Entrega garantida'],
      isDefault: true,
      icon: Truck
    },
    {
      id: 'sedex',
      name: 'SEDEX',
      description: 'Entrega expressa dos Correios',
      estimatedDays: '1-2 dias úteis',
      price: 49.90,
      features: ['Entrega rápida', 'Rastreamento', 'Seguro opcional'],
      isDefault: false,
      icon: Clock
    },
    {
      id: 'pac',
      name: 'PAC',
      description: 'Entrega econômica dos Correios',
      estimatedDays: '5-8 dias úteis',
      price: 14.90,
      features: ['Preço acessível', 'Rastreamento', 'Entrega confiável'],
      isDefault: false,
      icon: MapPin
    },
    {
      id: 'retirada',
      name: 'Retirada na Loja',
      description: 'Retire seu pedido em nossa oficina',
      estimatedDays: 'Imediato',
      price: 0,
      features: ['Sem custo de frete', 'Disponível em São Paulo', 'Inspeção do produto'],
      isDefault: false,
      icon: CheckCircle2
    }
  ];

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Calcular frete para CEP:', cep);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Opções de Frete
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha a melhor opção de entrega para seu pedido. Super Frete é nossa opção padrão recomendada.
            </p>
          </div>

          {/* CEP Calculator */}
          <div className="mb-12 bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Calcular Frete
            </h2>
            <form onSubmit={handleCalculateShipping} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  CEP de Entrega
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                  placeholder="00000-000"
                  maxLength={8}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Calcular
                </Button>
              </div>
            </form>
          </div>

          {/* Shipping Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {shippingOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card
                  key={option.id}
                  className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedShipping === option.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedShipping(option.id)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-foreground">
                            {option.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={() => setSelectedShipping(option.id)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>

                    {/* Default Badge */}
                    {option.isDefault && (
                      <div className="mb-4 inline-block bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        ⭐ Recomendado
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground font-medium">
                          {option.estimatedDays}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-border">
                      {option.price > 0 ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            R$ {option.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">frete</span>
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-primary">Grátis</div>
                      )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedShipping === option.id && (
                    <div className="h-1 bg-primary"></div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-secondary border border-border rounded-lg p-6">
              <h4 className="font-display font-bold text-foreground mb-2">
                🚚 Por que Super Frete?
              </h4>
              <p className="text-sm text-muted-foreground">
                Super Frete oferece o melhor custo-benefício com entrega rápida e rastreamento em tempo real.
              </p>
            </div>

            <div className="bg-secondary border border-border rounded-lg p-6">
              <h4 className="font-display font-bold text-foreground mb-2">
                🔒 Segurança Garantida
              </h4>
              <p className="text-sm text-muted-foreground">
                Todos os pedidos são segurados contra danos durante o transporte.
              </p>
            </div>

            <div className="bg-secondary border border-border rounded-lg p-6">
              <h4 className="font-display font-bold text-foreground mb-2">
                📍 Rastreamento
              </h4>
              <p className="text-sm text-muted-foreground">
                Acompanhe seu pedido em tempo real do depósito até sua porta.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continuar com {shippingOptions.find(o => o.id === selectedShipping)?.name}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
