import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Truck, Shield, RotateCcw, ChevronLeft, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { ProductDetailSkeleton } from '@/components/skeletons/ProductDetailSkeleton';
import { toast } from 'sonner';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [quantity, setQuantity] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState('super-frete');
  const [cep, setCep] = useState('');
  const { addItem } = useCart();
  
  const shippingOptions = [
    { id: 'super-frete', name: 'Super Frete', price: 29.90, days: '2-3 dias uteis', icon: Truck },
    { id: 'sedex', name: 'SEDEX', price: 49.90, days: '1-2 dias uteis', icon: Clock },
    { id: 'pac', name: 'PAC', price: 14.90, days: '5-8 dias uteis', icon: MapPin },
    { id: 'retirada', name: 'Retirada na Loja', price: 0, days: 'Imediato', icon: MapPin }
  ];

  const { data: rawProduct, isLoading, isError } = useProduct(params?.id);
  
  if (isLoading) return <ProductDetailSkeleton />;
  
  if (isError || !rawProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-destructive">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
            <p className="mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Link href="/">
              <Button>Voltar para a Loja</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Map Supabase fields to the component expectations
  // Handles Portuguese/English field names safely
  const product = {
    id: String(rawProduct.id),
    name: (rawProduct as any).nome ?? (rawProduct as any).name ?? '',
    price: Number((rawProduct as any).preco ?? (rawProduct as any).price ?? 0),
    category: (rawProduct as any).categories?.name ?? (rawProduct as any).categories?.nome ?? 'Produto',
    image: rawProduct.image_url ?? (rawProduct as any).imagens?.[0] ?? '',
    images: (rawProduct as any).imagens ?? [rawProduct.image_url],
    description: (rawProduct as any).descricao ?? (rawProduct as any).description ?? '',
    inStock: ((rawProduct as any).estoque ?? (rawProduct as any).stock ?? 0) > 0,
    shippingTime: (rawProduct as any).is_custom_order ? `${(rawProduct as any).lead_time ?? 8} semanas (sob encomenda)` : 'Pronta entrega',
    specifications: (rawProduct as any).especificacoes ?? {
      garantia: 'Vitalícia',
    },
    features: (rawProduct as any).caracteristicas ?? [
      'Produto de alta qualidade'
    ],
    rating: 4.8, // Mock as it might not be in the current schema
    reviews: 24,
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
              {product.images?.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img: string, i: number) => (
                    <div key={i} className="w-20 h-20 bg-secondary rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary">
                      <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
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
                    {product.features.map((feature: string, index: number) => (
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

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                  onClick={async () => {
                    try {
                      await addItem(product.id, quantity);
                      toast.success(`${product.name} adicionado ao carrinho!`);
                    } catch (err) {
                      toast.error("Erro ao adicionar ao carrinho. Verifique se você está logado.");
                    }
                  }}
                >
                  Adicionar ao Carrinho
                </Button>

                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    Solicitar Informações
                  </Button>
                </Link>

                {/* Shipping Options */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                    Opcoes de Frete
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">CEP de Entrega</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                      placeholder="00000-000"
                      maxLength={8}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {shippingOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <label key={option.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedShipping === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}>
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={() => setSelectedShipping(option.id)}
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-foreground text-sm">{option.name}</span>
                              <p className="text-xs text-muted-foreground">{option.days}</p>
                            </div>
                            <p className="text-sm font-bold text-primary">
                              {option.price > 0 ? `R$ ${option.price.toFixed(2)}` : 'Gratis'}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

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
                  <span className="text-foreground font-semibold text-right">{value as React.ReactNode}</span>
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
                <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <Link href={`/product/${item}`}>
                    <div className="h-48 bg-secondary cursor-pointer overflow-hidden">
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <span className="text-primary/20 font-display font-bold text-4xl">PRODUTO</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link href={`/product/${item}`}>
                      <h3 className="font-display font-semibold text-lg mb-2 cursor-pointer hover:text-primary transition-colors">
                        Produto Relacionado {item}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-4">Acessório premium para seu instrumento</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">R$ 299.90</span>
                      <Link href={`/product/${item}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Ver Detalhes
                        </Button>
                      </Link>
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
