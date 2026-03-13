import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Image as ImageIcon,
  Wand2
} from 'lucide-react';
import { useState } from 'react';

export default function ProductsPage() {
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      name: 'Cordas Premium Nylon',
      category: 'Acessório',
      price: 89.90,
      stock: 15,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp',
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Correia de Couro Artesanal',
      category: 'Acessório',
      price: 149.90,
      stock: 8,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/materials-detail-CCoKXjY6bpfty3TMbAQMAK.webp',
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Ponte de Madeira Maciça',
      category: 'Acessório',
      price: 79.90,
      stock: 12,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp',
      status: 'Ativo'
    },
    {
      id: 4,
      name: 'Banjo Clássico Walnut',
      category: 'Banjo',
      price: 2890.00,
      stock: 0,
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp',
      status: 'Sob Encomenda'
    }
  ];

  return (
    <AdminLayout
      title="Gerenciamento de Produtos"
      subtitle="Crie, edite e gerencie todos os produtos da loja"
    >
      {/* Toolbar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowNewProduct(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Preço</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estoque</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">R$ {product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-green-600' :
                      product.stock > 0 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} unidades` : 'Sem estoque'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'Ativo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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

      {/* New Product Modal */}
      {showNewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-foreground">Novo Produto</h2>
              <button
                onClick={() => setShowNewProduct(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Imagem do Produto
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground font-medium mb-1">
                    Clique para fazer upload ou arraste a imagem
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG até 10MB
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                      <Wand2 className="w-4 h-4" />
                      Otimizar com IA
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">
                      A IA ajustará automaticamente o tamanho e qualidade da imagem
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cordas Premium Nylon"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Categoria
                  </label>
                  <select className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Acessório</option>
                    <option>Banjo</option>
                  </select>
                </div>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Estoque
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Descrição
                  </label>
                  <button className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Wand2 className="w-3 h-3" />
                    Sugerir com IA
                  </button>
                </div>
                <textarea
                  placeholder="Descreva o produto em detalhes..."
                  rows={4}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => setShowNewProduct(false)}
                >
                  Cancelar
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Criar Produto
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
