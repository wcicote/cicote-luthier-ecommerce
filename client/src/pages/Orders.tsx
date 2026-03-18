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
  Truck,
  CheckCircle2,
  Clock,
  Search
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/_core/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  if (loading || !user) {
    return null;
  }

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusConfig: Record<string, any> = {
    paid: {
      label: 'Pago',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
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
    pending: {
      label: 'Pendente',
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

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || {
      label: status,
      icon: Package,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8 md:py-12">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">Meus Pedidos</h1>
            <p className="text-muted-foreground mt-1">Acompanhe e gerencie suas compras</p>
          </div>
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="border-border w-fit"
          >
            Voltar à Loja
          </Button>
        </header>
        
        <Card className="p-6 mb-8">
          <div className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Filtrar por Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'paid', 'in-transit', 'delivered', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : getStatusConfig(status).label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {ordersLoading ? (
          <div className="text-center py-12"><p>Carregando pedidos...</p></div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => {
              const config = getStatusConfig(order.status);
              const StatusIcon = config.icon;

              return (
                <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                        {order.order_number || order.id}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-xl text-primary mb-2">
                        R$ {Number(order.total_amount).toFixed(2)}
                      </p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setLocation(`/order-confirmation/${order.id}`)}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
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
              Você ainda não fez nenhum pedido ou sua busca não retornou resultados.
            </p>
            <Button
              onClick={() => setLocation('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Explorar Produtos
            </Button>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
