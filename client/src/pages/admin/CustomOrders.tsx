import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminCustomOrdersPage() {
  const queryClient = useQueryClient();

  const fetchCustomOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    // As per task list, I created /api/admin/custom-orders for GET
    const res = await fetch('/api/admin/custom-orders', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (!res.ok) throw new Error('Falha ao carregar encomendas customizadas');
    return res.json().then(data => data.customOrders);
  };

  const { data: customOrders = [], isLoading } = useQuery({
    queryKey: ['adminCustomOrders'],
    queryFn: fetchCustomOrders
  });

  const updateStatus = async (id: number, status: string) => {
    // There was no PUT endpoint created before, but wait, updating status for custom Orders: 
    // Just use Supabase since it's easier and allowed by RLS for admin!
    const { error } = await supabase
      .from('encomendas_customizadas')
      .update({ status })
      .eq('id', id);
      
    if (error) {
      toast.error('Erro ao atualizar status');
      return;
    }
    toast.success('Status da encomenda atualizado!');
    queryClient.invalidateQueries({ queryKey: ['adminCustomOrders'] });
  };

  return (
    <AdminLayout
      title="Encomendas Customizadas"
      subtitle="Acompanhe as propostas e pedidos sob medida"
    >
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por cliente, tipo ou instrumento..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email / Contato</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tipo/Instrumento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-4">Carregando...</td></tr>
              ) : customOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">{order.nome_cliente}</td>
                  <td className="px-6 py-4 text-sm">{order.email_cliente}<br/>{order.telefone_cliente}</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.criado_em).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-semibold">
                    {order.tipo_instrumento}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="px-3 py-1 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="nova">Nova</option>
                      <option value="analise">Em Análise</option>
                      <option value="aprovada">Aprovada</option>
                      <option value="producao">Em Produção</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" title={"Descrição: " + order.descricao_encomenda}>
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
