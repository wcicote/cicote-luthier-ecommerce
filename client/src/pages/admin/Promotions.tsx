import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Percent,
  Copy,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function PromotionsPage() {
  const queryClient = useQueryClient();
  const [showNewPromotion, setShowNewPromotion] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentual',
    discount: '',
    startDate: '',
    endDate: '',
  });

  const fetchPromotions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    const res = await fetch('/api/admin/promotions', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (!res.ok) throw new Error('Falha ao carregar promoções');
    return res.json().then(data => data.promotions);
  };

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['adminPromotions'],
    queryFn: fetchPromotions
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    await fetch(`/api/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    toast.success('Promoção deletada!');
    queryClient.invalidateQueries({ queryKey: ['adminPromotions'] });
  };

  return (
    <AdminLayout
      title="Promoções e Descontos"
      subtitle="Crie e gerencie promoções, cupons e descontos"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm mb-2">Promoções Ativas</p>
          <p className="font-display font-bold text-3xl text-foreground">{promotions.filter((p: any) => p.ativo).length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm mb-2">Cupons Utilizados</p>
          <p className="font-display font-bold text-3xl text-foreground">{promotions.reduce((acc: number, p: any) => acc + (p.usos_atuais || 0), 0)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm mb-2">Desconto Total</p>
          <p className="font-display font-bold text-3xl text-green-600">R$ 8.450</p>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowNewPromotion(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Promoção
            </Button>
            <Button variant="outline" className="border-border">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cupom
            </Button>
          </div>
        </div>
      </Card>

      {/* Promotions List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Promoção</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Desconto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Período</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Usos</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-4">Carregando...</td></tr>
              ) : promotions.map((promo: any) => (
                <tr key={promo.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{promo.descricao || "Sem Nome"}</p>
                      <p className="text-xs text-muted-foreground">Código: {promo.codigo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">{promo.tipo_desconto === 'percentual' ? 'Porcentagem' : 'R$'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {promo.tipo_desconto === 'percentual' && <Percent className="w-4 h-4 text-primary" />}
                      <span className="font-semibold text-foreground">{promo.tipo_desconto === 'fixo' ? 'R$ ' : ''}{promo.valor_desconto}{promo.tipo_desconto === 'percentual' ? '%' : ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(promo.data_inicio).toLocaleDateString()} - {promo.data_fim ? new Date(promo.data_fim).toLocaleDateString() : 'Sem fim'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      promo.ativo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {promo.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-foreground">{promo.usos_atuais || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {promo.codigo && (
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Copiar código" onClick={() => {
                          navigator.clipboard.writeText(promo.codigo);
                          toast.success('Código copiado!');
                        }}>
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Deletar" onClick={() => handleDelete(promo.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Promotion Modal */}
      {showNewPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-foreground">Nova Promoção</h2>
              <button
                onClick={() => setShowNewPromotion(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Promotion Type */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Tipo de Promoção
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 border-2 border-primary bg-primary/5 rounded-lg text-center">
                    <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Desconto %</p>
                  </button>
                  <button className="p-4 border-2 border-border hover:border-primary rounded-lg text-center transition-colors">
                    <Percent className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground">Desconto Fixo</p>
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nome (Descrição) da Promoção
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Desconto Primavera"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                />
                
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Código do Cupom
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="Ex: PRIMAVERA15"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Valor do Desconto
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={e => setFormData({...formData, discount: e.target.value})}
                    placeholder="15"
                    className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="percentual">%</option>
                    <option value="fixo">R$</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Aplicar a
                </label>
                <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Todos os produtos</option>
                  <option>Apenas acessórios</option>
                  <option>Apenas banjos</option>
                  <option>Produtos selecionados</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => setShowNewPromotion(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={async () => {
                     const { data: { session } } = await supabase.auth.getSession();
                     const token = session?.access_token;

                     const res = await fetch('/api/admin/promotions', {
                       method: 'POST',
                       headers: { 
                         'Content-Type': 'application/json',
                         ...(token ? { Authorization: `Bearer ${token}` } : {}) 
                       },
                       body: JSON.stringify({
                         codigo: formData.code,
                         descricao: formData.name,
                         tipo_desconto: formData.type,
                         valor_desconto: parseFloat(formData.discount) || 0,
                         data_inicio: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
                         data_fim: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                       })
                     });
                     if (res.ok) {
                         toast.success('Promoção salva!');
                         queryClient.invalidateQueries({ queryKey: ['adminPromotions'] });
                         setShowNewPromotion(false);
                         setFormData({ name: '', code: '', type: 'percentual', discount: '', startDate: '', endDate: '' });
                     } else {
                         toast.error('Erro ao salvar promoção');
                     }
                  }}
                >
                  Criar Promoção
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
