import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Plus,
  Minus,
  Edit,
  BarChart3,
  Download
} from 'lucide-react';
import { useState } from 'react';

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const inventory = [
    {
      id: 1,
      name: 'Cordas Premium Nylon',
      sku: 'COR-001',
      current: 15,
      minimum: 10,
      maximum: 50,
      status: 'Adequado',
      lastUpdate: '13/03/2026'
    },
    {
      id: 2,
      name: 'Correia de Couro Artesanal',
      sku: 'COR-002',
      current: 8,
      minimum: 5,
      maximum: 30,
      status: 'Baixo',
      lastUpdate: '12/03/2026'
    },
    {
      id: 3,
      name: 'Ponte de Madeira Maciça',
      sku: 'PON-001',
      current: 3,
      minimum: 5,
      maximum: 20,
      status: 'Crítico',
      lastUpdate: '10/03/2026'
    },
    {
      id: 4,
      name: 'Cravijas de Latão Polido',
      sku: 'CRA-001',
      current: 25,
      minimum: 10,
      maximum: 40,
      status: 'Adequado',
      lastUpdate: '13/03/2026'
    },
    {
      id: 5,
      name: 'Banjo Clássico Walnut',
      sku: 'BAN-001',
      current: 0,
      minimum: 1,
      maximum: 5,
      status: 'Sob Encomenda',
      lastUpdate: '08/03/2026'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Adequado':
        return 'bg-green-100 text-green-700';
      case 'Baixo':
        return 'bg-orange-100 text-orange-700';
      case 'Crítico':
        return 'bg-red-100 text-red-700';
      case 'Sob Encomenda':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStockPercentage = (current: number, maximum: number) => {
    return (current / maximum) * 100;
  };

  return (
    <AdminLayout
      title="Controle de Estoque"
      subtitle="Monitore e gerencie o estoque de todos os produtos"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Total em Estoque</h3>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <p className="font-display font-bold text-2xl text-foreground">51</p>
          <p className="text-xs text-muted-foreground mt-2">unidades em 5 produtos</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Estoque Baixo</h3>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <p className="font-display font-bold text-2xl text-orange-600">2</p>
          <p className="text-xs text-muted-foreground mt-2">produtos com aviso</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Crítico</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="font-display font-bold text-2xl text-red-600">1</p>
          <p className="text-xs text-muted-foreground mt-2">ação imediata necessária</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Valor Total</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="font-display font-bold text-2xl text-green-600">R$ 15.2k</p>
          <p className="text-xs text-muted-foreground mt-2">valor em estoque</p>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-foreground">
            Produtos em Estoque
          </h2>
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estoque</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Mínimo/Máximo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const percentage = getStockPercentage(item.current, item.maximum);
                return (
                  <tr key={item.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Atualizado: {item.lastUpdate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-secondary px-2 py-1 rounded text-foreground">
                        {item.sku}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">{item.current} un.</p>
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              percentage > 50 ? 'bg-green-500' :
                              percentage > 25 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {item.minimum} - {item.maximum}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Adicionar">
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Remover">
                          <Minus className="w-4 h-4 text-red-600" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Editar">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Alert */}
      <Card className="p-6 mt-6 border-l-4 border-orange-500 bg-orange-50">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-2">Produtos com Estoque Baixo</h3>
            <p className="text-sm text-orange-800 mb-4">
              Os seguintes produtos estão abaixo do nível mínimo de estoque:
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-orange-800">
                • <strong>Ponte de Madeira Maciça</strong> - 3 unidades (mínimo: 5)
              </li>
              <li className="text-sm text-orange-800">
                • <strong>Correia de Couro Artesanal</strong> - 8 unidades (mínimo: 5)
              </li>
            </ul>
            <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white">
              Criar Pedido de Reposição
            </Button>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
