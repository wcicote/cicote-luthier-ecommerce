import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ArrowLeft, ShoppingCart, Truck, Clock, MapPin } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { CartItemSkeleton } from '@/components/skeletons/CartItemSkeleton';
import { toast } from 'sonner';

export default function Cart() {
  const [, setLocation] = useLocation();
  const [selectedShipping, setSelectedShipping] = useState('super-frete');
  const [cep, setCep] = useState('');
  const { cartItems, updateItem, removeItem, isLoading } = useCart();
  
  const shippingOptions = [
    { id: 'super-frete', name: 'Super Frete', price: 29.90, days: '2-3 dias', icon: Truck },
    { id: 'sedex', name: 'SEDEX', price: 49.90, days: '1-2 dias', icon: Clock },
    { id: 'pac', name: 'PAC', price: 14.90, days: '5-8 dias', icon: MapPin },
    { id: 'retirada', name: 'Retirada na Loja', price: 0, days: 'Imediato', icon: MapPin }
  ];

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    return sum + (item.preco_unitario * item.quantity);
  }, 0);
  const currentShipping = shippingOptions.find(s => s.id === selectedShipping);
  const shipping = currentShipping?.price || 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/">
              <a className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" />
                Continuar comprando
              </a>
            </Link>
          </div>

          <h1 className="font-display text-4xl font-bold text-foreground mb-8">
            Carrinho de Compras
          </h1>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <CartItemSkeleton />
                <CartItemSkeleton />
              </div>
              <div className="lg:col-span-1">
                <Card className="p-6 h-[300px] animate-pulse bg-card" />
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item: any) => (
                  <Card key={item.id} className="p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product?.image_url || item.product?.imagens?.[0]} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-foreground">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {item.preco_unitario.toFixed(2)} cada
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-lg">
                          <button 
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 text-foreground hover:bg-secondary transition-colors"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-foreground hover:bg-secondary transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          R$ {(item.preco_unitario * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Card>
                ))}
              </div>

              {/* Shipping Options */}
              <div className="lg:col-span-2">
                <Card className="p-6 mb-8">
                  <h2 className="font-display font-semibold text-xl text-foreground mb-4">
                    Opções de Frete
                  </h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">CEP de Entrega</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                      placeholder="00000-000"
                      maxLength={8}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {shippingOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <label key={option.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedShipping === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}>
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={() => setSelectedShipping(option.id)}
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-foreground">{option.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{option.days}</p>
                            <p className="text-sm font-bold text-primary mt-1">
                              {option.price > 0 ? `R$ ${option.price.toFixed(2)}` : 'Grátis'}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20">
                  <h2 className="font-display font-semibold text-xl text-foreground mb-6">
                    Resumo do Pedido
                  </h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-semibold">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete ({currentShipping?.name})</span>
                      <span className="text-foreground font-semibold">R$ {shipping.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-display font-semibold text-lg">Total</span>
                    <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
                  </div>

                  <Button 
                    onClick={() => setLocation('/checkout')}
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3"
                  >
                    Prosseguir para Checkout
                  </Button>

                  <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    Continuar Comprando
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Você pode editar seu pedido até o checkout
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Seu carrinho está vazio
              </h2>
              <p className="text-muted-foreground mb-8">
                Explore nossos produtos e adicione itens ao carrinho
              </p>
              <Link href="/">
                <a>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Voltar para Produtos
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
