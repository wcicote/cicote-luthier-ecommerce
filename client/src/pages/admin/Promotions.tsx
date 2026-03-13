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

export default function PromotionsPage() {
  const [showNewPromotion, setShowNewPromotion] = useState(false);

  const promotions = [
    {
      id: 1,
      name: 'Desconto Primavera',
      type: 'Porcentagem',
      discount: '15%',
      products: 'Todos os acessórios',
      startDate: '01/03/2026',
      endDate: '31/03/2026',
      status: 'Ativo',
      uses: 24
    },
    {
      id: 2,
      name: 'Cupom Novo Cliente',
      type: 'Cupom',
      discount: 'R$ 50',
      products: 'Compras acima de R$ 200',
      startDate: '01/01/2026',
      endDate: 'Sem data',
      status: 'Ativo',
      uses: 156,
      code: 'BEMVINDO50'
    },
    {
      id: 3,
      name: 'Black Friday 2025',
      type: 'Porcentagem',
      discount: '30%',
      products: 'Produtos selecionados',
      startDate: '01/11/2025',
      endDate: '30/11/2025',
      status: 'Inativo',
      uses: 342
    }
  ];

  return (
    <AdminLayout
      title="Promoções e Descontos"
      subtitle="Crie e gerencie promoções, cupons e descontos"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-muted-foreground text-sm mb-2">Promoções Ativas</p>
          <p className="font-display font-bold text-3xl text-foreground">2</p>
        </Card>
        <Card className="p-6">
          <p className="text-muted-foreground text-sm mb-2">Cupons Utilizados</p>
          <p className="font-display font-bold text-3xl text-foreground">180</p>
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
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{promo.name}</p>
                      <p className="text-xs text-muted-foreground">{promo.products}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">{promo.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{promo.discount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{promo.startDate} - {promo.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      promo.status === 'Ativo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-foreground">{promo.uses}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {promo.code && (
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Copiar código">
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Visualizar">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Editar">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Deletar">
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
                  Nome da Promoção
                </label>
                <input
                  type="text"
                  placeholder="Ex: Desconto Primavera"
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
                    placeholder="15"
                    className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>%</option>
                    <option>R$</option>
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
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Data de Término
                  </label>
                  <input
                    type="date"
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
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
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
