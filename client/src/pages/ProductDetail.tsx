import { useState } from 'react';
import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Truck, Shield, RotateCcw, ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [quantity, setQuantity] = useState(1);

  // Sample product data
  const product = {
    id: params?.id || '1',
    name: 'Banjo Clássico Walnut - Artesanal',
    price: 2890.00,
    rating: 4.8,
    reviews: 24,
    category: 'Banjos',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp',
    description: 'Um banjo artesanal de excelência, fabricado sob encomenda com madeira de nogueira selecionada. Cada detalhe é cuidadosamente trabalhado para garantir qualidade sonora e durabilidade.',
    specifications: {
      material: 'Madeira de Nogueira Americana',
      diameter: '11 polegadas',
      strings: '6 cordas',
      finish: 'Verniz natural com proteção UV',
      weight: '2.8 kg',
      warranty: 'Vitalícia'
    },
    features: [
      'Madeira de primeira qualidade selecionada manualmente',
      'Acabamento artesanal com verniz natural',
      'Hardware de latão polido',
      'Som rico e profundo',
      'Fácil de afinar e manter',
      'Acompanha estojo protetor'
    ],
    inStock: true,
    shippingTime: '8-12 semanas (sob encomenda)'
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/">
          <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
            <ChevronLeft className="w-4 h-4" />
            Voltar para produtos
          </a>
        </Link>
      </div>

      {/* Product Section */}
      <section className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="relative h-96 md:h-[500px] bg-secondary rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary">
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary">
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary">
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary mb-2">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ou em até 12x de R$ {(product.price / 12).toFixed(2)}
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="font-display font-semibold text-lg mb-4">Características:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                  </span>
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                  Adicionar ao Carrinho
                </Button>

                <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                  Solicitar Informações
                </Button>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Card className="p-4 text-center">
                    <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">Entrega</p>
                    <p className="text-xs text-muted-foreground">{product.shippingTime}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">Garantia</p>
                    <p className="text-xs text-muted-foreground">{product.specifications.warranty}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">Devolução</p>
                    <p className="text-xs text-muted-foreground">30 dias</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">Qualidade</p>
                    <p className="text-xs text-muted-foreground">Premium</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Especificações Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start">
                  <span className="text-muted-foreground font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-foreground font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-secondary"></div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-lg mb-2">Produto Relacionado</h3>
                    <p className="text-sm text-muted-foreground mb-4">Descrição breve do produto</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">R$ 299.90</span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Ver
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
