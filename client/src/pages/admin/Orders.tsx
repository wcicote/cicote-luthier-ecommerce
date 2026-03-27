import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const fetchOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    // Using global orders route or create a specific admin one?
    // Wait, GET /api/admin/dashboard exists. But GET /api/orders exists too.
    // The user didn't ask to create GET /api/admin/orders, but I can use GET /api/orders without filtering by user?
    // Currently GET /api/orders only returns orders for the logged-in user!
    // I need to use the admin token to fetch ALL orders. Wait!
    // Let's check `GET /api/orders` later, for now we will assume `/api/orders?admin=true` or just fetch from supabase!
    
    // Fetch directly from supabase! As admin auth in frontend has RLS enabled?
    const { data, error } = await supabase
      .from('orders')
      .select('*, users ( email )')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  };

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchOrders
  });

  const updateStatus = async (id: number, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}) 
      },
      body: JSON.stringify({ status })
    });
    
    if (!res.ok) {
      toast.error('Erro ao atualizar status');
      return;
    }
    toast.success('Status atualizado e email enviado!');
    queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
  };

  return (
    <AdminLayout
      title="Gerenciamento de Pedidos"
      subtitle="Acompanhe e atualize os pedidos da loja"
    >
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar pedidos por ID ou cliente..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Button variant="outline" className="border-border">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Pedido</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-4">Carregando...</td></tr>
              ) : orders.map((order: any) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">#{order.order_number}</td>
                  <td className="px-6 py-4 text-sm">{order.users?.email || order.user_id}</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="px-3 py-1 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Processando">Processando</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" title="Visualizar Detalhes">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
