import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total de Produtos',
      value: '24',
      change: '+2',
      icon: Package,
      trend: 'up',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Pedidos Este Mês',
      value: '12',
      change: '+5',
      icon: ShoppingCart,
      trend: 'up',
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Receita',
      value: 'R$ 8.450',
      change: '+12%',
      icon: TrendingUp,
      trend: 'up',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Visitantes',
      value: '1.240',
      change: '-3%',
      icon: Users,
      trend: 'down',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentProducts = [
    {
      id: 1,
      name: 'Cordas Premium Nylon',
      category: 'Acessório',
      price: 89.90,
      stock: 15,
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Correia de Couro Artesanal',
      category: 'Acessório',
      price: 149.90,
      stock: 8,
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Banjo Clássico Walnut',
      category: 'Banjo',
      price: 2890.00,
      stock: 0,
      status: 'Sob Encomenda'
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'João Silva',
      amount: 'R$ 450.00',
      status: 'Entregue',
      date: '13/03/2026'
    },
    {
      id: '#ORD-002',
      customer: 'Maria Santos',
      amount: 'R$ 1.200.00',
      status: 'Processando',
      date: '12/03/2026'
    },
    {
      id: '#ORD-003',
      customer: 'Pedro Costa',
      amount: 'R$ 89.90',
      status: 'Pendente',
      date: '11/03/2026'
    }
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Bem-vindo ao painel administrativo da Cicote Luthier"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button className="p-1 hover:bg-secondary rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="font-display font-bold text-2xl text-foreground">
                  {stat.value}
                </h3>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Produtos Recentes
            </h2>
            <a href="/admin/products" className="text-primary hover:text-primary/80 text-sm font-medium">
              Ver Todos
            </a>
          </div>

          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">R$ {product.price.toFixed(2)}</p>
                  <p className={`text-xs font-medium ${
                    product.stock > 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} em estoque` : product.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Pedidos Recentes
            </h2>
            <a href="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium">
              Ver Todos
            </a>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{order.id}</h4>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.amount}</p>
                  <p className={`text-xs font-medium ${
                    order.status === 'Entregue' ? 'text-green-600' :
                    order.status === 'Processando' ? 'text-blue-600' :
                    'text-orange-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Novo Produto
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Nova Promoção
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Ver Relatórios
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Configurações
          </Button>
        </div>
      </Card>
    </AdminLayout>
  );
}
