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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const fetchDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const res = await fetch('/api/admin/dashboard', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (!res.ok) throw new Error('Falha ao carregar dashboard');
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchDashboard
  });

  if (isLoading) return <AdminLayout title="Dashboard" subtitle="Carregando..."><div>Carregando...</div></AdminLayout>;

  // Mapping from our API data
  const realStats = [
    {
      label: 'Total de Produtos',
      value: data?.produtos_ativos || '0',
      change: '-',
      icon: Package,
      trend: 'up',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Pedidos Hoje',
      value: data?.pedidos_hoje || '0',
      change: '-',
      icon: ShoppingCart,
      trend: 'up',
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Receita Total',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.total_vendas || 0),
      change: '-',
      icon: TrendingUp,
      trend: 'up',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Visitantes/Clientes',
      value: data?.clientes_total || '0',
      change: '-',
      icon: Users,
      trend: 'up',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentOrdersRender = data?.recentOrders?.map((o: any) => ({
    id: o.order_number,
    customer: o.id.slice(0, 8), // just a mock for customer name until joined
    amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(o.total_amount),
    status: o.status,
    date: new Date(o.created_at).toLocaleDateString()
  })) || [];

  const chartData = (data?.recentOrders || []).map((o: any) => ({
    name: new Date(o.created_at).toLocaleDateString('pt-BR', { weekday: 'short' }),
    vendas: o.total_amount
  })).reverse();

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Bem-vindo ao painel administrativo da Cicote Luthier"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {realStats.map((stat, index) => {
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
              Vendas dos últimos dias
            </h2>
            <a href="/admin/products" className="text-primary hover:text-primary/80 text-sm font-medium">
              Ver Todos
            </a>
          </div>

          <div className="space-y-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="vendas" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
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
            {recentOrdersRender.map((order: any) => (
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
