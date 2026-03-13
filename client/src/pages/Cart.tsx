import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link } from 'wouter';

export default function Cart() {
  const cartItems = [
    {
      id: 1,
      name: 'Cordas Premium Nylon',
      price: 89.90,
      quantity: 2,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50.00;
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

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-6 flex gap-6">
                    <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {item.price.toFixed(2)} cada
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-lg">
                          <button className="px-3 py-1 text-foreground hover:bg-secondary">−</button>
                          <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                          <button className="px-3 py-1 text-foreground hover:bg-secondary">+</button>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button className="text-destructive hover:text-destructive/80 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Card>
                ))}
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
                      <span className="text-muted-foreground">Frete</span>
                      <span className="text-foreground font-semibold">R$ {shipping.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-display font-semibold text-lg">Total</span>
                    <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
                  </div>

                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3">
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
