import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  Download,
  Home,
  Clock,
  DollarSign
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  const orderId = 'ORD-2026-001234';
  const orderDate = new Date().toLocaleDateString('pt-BR');
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const orderItems = [
    {
      id: '1',
      name: 'Cordas Premium Nylon',
      quantity: 2,
      price: 89.90,
      image: 'https://via.placeholder.com/100'
    },
    {
      id: '2',
      name: 'Correia de Couro Artesanal',
      quantity: 1,
      price: 149.90,
      image: 'https://via.placeholder.com/100'
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold">C</span>
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Cicote Luthier</h1>
          </div>
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="border-border"
          >
            Voltar à Loja
          </Button>
        </div>
      </header>

      <div className="container py-12">
        {/* Success Message */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="font-display font-bold text-3xl text-foreground mb-2">
              Pedido Confirmado!
            </h1>
            <p className="text-lg text-muted-foreground">
              Obrigado pela sua compra. Seu pedido foi processado com sucesso.
            </p>
          </div>

          {/* Order ID Card */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Número do Pedido</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h2 className="font-display font-bold text-2xl text-primary">{orderId}</h2>
                <button
                  onClick={handleCopyOrderId}
                  className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Data do pedido: <span className="font-semibold text-foreground">{orderDate}</span>
              </p>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6 mb-8">
            <h3 className="font-display font-semibold text-lg text-foreground mb-6">
              Status do Pedido
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  title: 'Pedido Confirmado',
                  description: 'Seu pagamento foi processado com sucesso',
                  completed: true
                },
                {
                  icon: Package,
                  title: 'Preparando Envio',
                  description: 'Seu pedido está sendo preparado para envio',
                  completed: false
                },
                {
                  icon: Truck,
                  title: 'Em Trânsito',
                  description: `Entrega estimada para ${estimatedDelivery}`,
                  completed: false
                },
                {
                  icon: Home,
                  title: 'Entregue',
                  description: 'Seu pedido chegará em suas mãos',
                  completed: false
                }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-1 h-12 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1 pb-4">
                      <h4 className={`font-semibold ${
                        step.completed ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Order Details */}
          <Card className="p-6 mb-8">
            <h3 className="font-display font-semibold text-lg text-foreground mb-6">
              Detalhes do Pedido
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
              {/* Shipping Address */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Endereço de Entrega
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">João Silva</p>
                  <p>Rua Principal, 123</p>
                  <p>São Paulo, SP 01310-100</p>
                  <p className="pt-2 text-xs">
                    Entrega estimada: <span className="font-semibold text-foreground">{estimatedDelivery}</span>
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Informações de Contato
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="text-foreground font-medium">Email:</span> joao@example.com
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Telefone:</span> (11) 99999-9999
                  </p>
                  <p className="pt-2 text-xs">
                    Você receberá atualizações de rastreamento por email
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h4 className="font-semibold text-foreground mb-4">Itens do Pedido</h4>
              <div className="space-y-4">
                {orderItems.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                    <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground">{item.name}</h5>
                      <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                      <p className="text-primary font-semibold mt-2">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impostos</span>
                <span className="text-foreground font-medium">R$ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display font-bold text-xl text-primary">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Informações de Pagamento
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <span className="text-foreground font-medium">Método:</span> Cartão de Crédito
              </p>
              <p>
                <span className="text-foreground font-medium">Cartão:</span> •••• •••• •••• 4242
              </p>
              <p>
                <span className="text-foreground font-medium">Status:</span>{' '}
                <span className="text-green-600 font-semibold">Pago</span>
              </p>
            </div>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="border-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Recibo
            </Button>
            <Button
              onClick={() => setLocation('/orders')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Ver Meus Pedidos
            </Button>
          </div>

          {/* Support */}
          <Card className="p-6 bg-secondary/50">
            <h3 className="font-semibold text-foreground mb-3">Precisa de Ajuda?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Se tiver dúvidas sobre seu pedido, entre em contato conosco:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-foreground">Email:</span>{' '}
                <a href="mailto:suporte@cicote.com" className="text-primary hover:underline">
                  suporte@cicote.com
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">Telefone:</span>{' '}
                <a href="tel:+5511999999999" className="text-primary hover:underline">
                  +55 (11) 99999-9999
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">Horário:</span> Seg-Sex, 9h-18h
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
