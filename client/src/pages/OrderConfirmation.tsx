import { useRoute, Link } from 'wouter';
import { useOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ChevronRight, Package, Truck, Receipt } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderConfirmation() {
  const [, params] = useRoute('/order-confirmation/:id');
  const { data: order, isLoading, isError } = useOrder(params?.id || null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <p>Carregando pedido...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-destructive mb-4">Pedido não encontrado.</p>
          <Link href="/">
            <Button>Voltar para a Loja</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 container py-12 max-w-3xl">
        <div className="text-center mb-12">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Pedido Confirmado!
          </h1>
          <p className="text-muted-foreground text-lg">
            Obrigado pela sua compra. O número do seu pedido é <span className="font-bold">{order.order_number}</span>
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5" />
              Resumo da Compra
            </h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0 border-border">
                  <div className="w-16 h-16 bg-secondary flex-shrink-0 rounded overflow-hidden">
                    <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.product_name}</h4>
                    <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                  </div>
                  <div className="font-medium text-foreground">
                    R$ {(item.unit_price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete ({order.shipping_method})</span>
                <span>R$ {Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-foreground pt-4">
                <span>Total Pago</span>
                <span className="text-primary">R$ {Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5" />
                Endereço de Entrega
              </h2>
              <div className="text-muted-foreground text-sm space-y-1">
                <p className="font-medium text-foreground">
                  {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                </p>
                <p>{order.shipping_address?.address}</p>
                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                <p>CEP: {order.shipping_address?.zipCode}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Package className="w-5 h-5" />
                Status do Pedido
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Pagamento Confirmado</p>
                    <p className="text-xs text-muted-foreground">Seu pagamento foi aprovado pelo Stripe</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Package className="w-4 h-4 relative -ml-0.5" />
                  </div>
                  <div>
                    <p className="font-medium">Preparando Envio</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center space-x-4">
          <Link href="/">
            <Button variant="outline">Continuar Comprando</Button>
          </Link>
          <Link href="/profile">
            <Button className="bg-primary hover:bg-primary/90">
              Ver Meus Pedidos <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
