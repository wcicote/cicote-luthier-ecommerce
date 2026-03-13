import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Package,
  ChevronRight,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'in-transit' | 'processing' | 'cancelled';
  items: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrdersPage() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');

  const orders: Order[] = [
    {
      id: 'ORD-2026-001234',
      date: '13/03/2026',
      total: 329.85,
      status: 'delivered',
      items: 2,
      trackingNumber: 'BR123456789BR',
      estimatedDelivery: '20/03/2026'
    },
    {
      id: 'ORD-2026-001233',
      date: '10/03/2026',
      total: 89.90,
      status: 'in-transit',
      items: 1,
      trackingNumber: 'BR123456788BR',
      estimatedDelivery: '18/03/2026'
    },
    {
      id: 'ORD-2026-001232',
      date: '05/03/2026',
      total: 249.70,
      status: 'delivered',
      items: 3,
      trackingNumber: 'BR123456787BR',
      estimatedDelivery: '12/03/2026'
    },
    {
      id: 'ORD-2026-001231',
      date: '01/03/2026',
      total: 149.90,
      status: 'processing',
      items: 1,
      trackingNumber: 'BR123456786BR',
      estimatedDelivery: '10/03/2026'
    },
    {
      id: 'ORD-2026-001230',
      date: '25/02/2026',
      total: 599.80,
      status: 'delivered',
      items: 4,
      trackingNumber: 'BR123456785BR',
      estimatedDelivery: '05/03/2026'
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusConfig = {
    delivered: {
      label: 'Entregue',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    'in-transit': {
      label: 'Em Trânsito',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    processing: {
      label: 'Processando',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    cancelled: {
      label: 'Cancelado',
      icon: Package,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <h1 className="font-display font-bold text-2xl text-foreground">Meus Pedidos</h1>
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="border-border"
          >
            Voltar à Loja
          </Button>
        </div>
      </header>

      <div className="container py-8">
        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Buscar Pedido
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Digite o número do pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Filtrar por Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'delivered', 'in-transit', 'processing', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {status === 'all'
                      ? 'Todos'
                      : statusConfig[status as Order['status']].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                        {order.id}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items} {order.items === 1 ? 'item' : 'itens'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-xl text-primary mb-2">
                        R$ {order.total.toFixed(2)}
                      </p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </div>
                  </div>

                  {/* Status Details */}
                  <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Número de Rastreamento</p>
                        <p className="font-mono text-sm font-semibold text-foreground">
                          {order.trackingNumber}
                        </p>
                      </div>
                      {order.estimatedDelivery && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Entrega Estimada</p>
                          <p className="font-semibold text-sm text-foreground">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setLocation(`/order-confirmation`)}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Recibo
                    </Button>
                    <Button
                      onClick={() => setLocation('/')}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      Comprar Novamente
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Você ainda não fez nenhum pedido'}
            </p>
            <Button
              onClick={() => setLocation('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Explorar Produtos
            </Button>
          </Card>
        )}

        {/* FAQ Section */}
        <Card className="p-6 mt-8 bg-secondary/50">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Perguntas Frequentes
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Como rastrear meu pedido?</h4>
              <p className="text-sm text-muted-foreground">
                Use o número de rastreamento fornecido acima para acompanhar seu pedido em tempo real.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Posso cancelar meu pedido?</h4>
              <p className="text-sm text-muted-foreground">
                Pedidos em processamento podem ser cancelados. Entre em contato conosco assim que possível.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Qual é o prazo de entrega?</h4>
              <p className="text-sm text-muted-foreground">
                Entregamos em todo o Brasil em 7-15 dias úteis, dependendo da localização.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">E se meu pedido não chegar?</h4>
              <p className="text-sm text-muted-foreground">
                Oferecemos garantia de entrega. Se houver problemas, entre em contato com nosso suporte.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setLocation('/contact')}
            variant="outline"
            className="mt-4 border-border"
          >
            Entrar em Contato
          </Button>
        </Card>
      </div>
    </div>
  );
}
