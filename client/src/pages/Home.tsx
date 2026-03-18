import { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Star, Zap, Award, Leaf, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useLocation, Link } from 'wouter';
import { ProductGridSkeleton } from '@/components/skeletons/ProductCardSkeleton';

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [, navigate] = useLocation();
  
  const { data: apiProducts = [], isLoading: productsLoading, isError: productsError } = useProducts(
    selectedCategory !== 'all' ? { categoria: selectedCategory } : {}
  );
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { addItem } = useCart();

  // Fallback products when Supabase has no data yet
  const fallbackProducts = [
    { id: 'f1', nome: 'Cordas Premium Nylon', category: 'accessories', preco: 89.90, image_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp', descricao: 'Jogo completo de cordas de nylon de alta qualidade', featured: true },
    { id: 'f2', nome: 'Correia de Couro Artesanal', category: 'accessories', preco: 149.90, image_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/materials-detail-CCoKXjY6bpfty3TMbAQMAK.webp', descricao: 'Correia de couro legítimo com acabamento manual', featured: true },
    { id: 'f3', nome: 'Ponte de Madeira Maciça', category: 'accessories', preco: 79.90, image_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp', descricao: 'Ponte esculpida em madeira de primeira qualidade', featured: true },
    { id: 'f4', nome: 'Cravijas de Latão Polido', category: 'accessories', preco: 199.90, image_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/materials-detail-CCoKXjY6bpfty3TMbAQMAK.webp', descricao: 'Jogo de 5 cravijas de latão polido com acabamento premium', featured: true },
    { id: 'f5', nome: 'Banjo Clássico Walnut', category: 'banjos', preco: 2890.00, image_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp', descricao: 'Banjo artesanal sob encomenda em madeira de nogueira', featured: false },
    { id: 'f6', nome: 'Banjo Maple Claro', category: 'banjos', preco: 2890.00, image_url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp', descricao: 'Banjo artesanal sob encomenda em madeira de bordo', featured: false },
  ];

  const products = apiProducts.length > 0 ? apiProducts : fallbackProducts;

  // Normalise so UI always reads the same fields
  const normalizedProducts = products.map((p: any) => ({
    id: String(p.id),
    name: p.name ?? p.nome ?? '',
    description: p.description ?? p.descricao ?? '',
    price: p.price ?? p.preco ?? 0,
    image_url: p.image_url ?? p.image ?? p.imagens?.[0] ?? null,
    featured: p.featured ?? false,
    is_custom_order: p.is_custom_order ?? false,
    category: p.categories?.slug ?? p.categorias?.slug ?? p.category ?? '',
  }));


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center min-h-[500px] md:min-h-[600px]">
          {/* Left: Text Content */}
          <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-background">
            <div className="max-w-lg">
              <p className="text-primary font-display font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
                Artesanato Tradicional
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                Banjos Artesanais de Excelência
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Cada instrumento é cuidadosamente fabricado à mão, combinando tradição musical com técnica contemporânea. Acessórios premium para músicos profissionais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explorar Produtos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 w-full sm:w-auto">
                    Solicitar Encomenda
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-secondary to-background">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/hero-banjo-artesanal-oQCUsCxoRDNdYTeEzTqXqv.webp"
              alt="Banjo artesanal Cicote"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Qualidade Premium</h3>
              <p className="text-sm text-muted-foreground">Materiais selecionados e acabamento impecável</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Artesanato Tradicional</h3>
              <p className="text-sm text-muted-foreground">Técnicas clássicas de luthieria</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Sustentabilidade</h3>
              <p className="text-sm text-muted-foreground">Madeiras responsavelmente selecionadas</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Garantia Vitalícia</h3>
              <p className="text-sm text-muted-foreground">Suporte técnico permanente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12 md:py-16 lg:py-24 bg-background">
        <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-primary font-display font-semibold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-4">
              Catálogo
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Acessórios premium e banjos artesanais sob encomenda
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-primary/10'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('acessorios')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'acessorios'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-primary/10'
              }`}
            >
              Acessórios
            </button>
            <button
              onClick={() => setSelectedCategory('banjos')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'banjos'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground hover:bg-primary/10'
              }`}
            >
              Banjos
            </button>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <ProductGridSkeleton />
          ) : productsError ? (
            <div className="text-center text-destructive py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Erro ao carregar produtos</h3>
              <p>Por favor, tente novamente mais tarde.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {normalizedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-secondary cursor-pointer">
                      <img
                        src={product.image_url || ''}
                        alt={product.name || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.featured && (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-accent text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                          Destaque
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 sm:p-6">
                    <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-2">
                      {product.category === 'accessories' || !product.is_custom_order ? 'Acessório' : 'Banjo'}
                    </p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-2 cursor-pointer hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-xs sm:text-sm"
                        onClick={() => addItem(product.id, 1)}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Orders Section */}
      <section id="custom" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/workshop-craftsmanship-Pq5T6rGbNVPHk4VBmkxiUY.webp"
                alt="Processo de fabricação"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">
                Fabricação Personalizada
              </p>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Banjos Sob Encomenda
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Cada banjo é uma obra de arte única. Trabalhamos diretamente com você para criar um instrumento que reflita sua personalidade e necessidades musicais. Escolha madeiras, acabamentos e configurações personalizadas.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground">Seleção de madeiras premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground">Acabamentos personalizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground">Prazo de 8-12 semanas</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <span className="text-foreground">Acompanhamento do processo</span>
                </li>
              </ul>

              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Solicitar Orçamento
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">
              Nossa História
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Tradição e Excelência
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Cicote Luthier nasceu da paixão por instrumentos musicais de qualidade. Com mais de 15 anos de experiência em luthieria, combinamos técnicas tradicionais com materiais de primeira qualidade para criar banjos que inspiram músicos em todo o mundo.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cada instrumento que sai de nossa oficina é resultado de dedicação, precisão e amor pela música. Acreditamos que um banjo bem feito não é apenas um instrumento, mas um companheiro para toda a vida do músico.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco para explorar nossas opções de produtos ou solicitar um banjo personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary w-full sm:w-auto">
                Entrar em Contato
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Catálogo Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Email</h3>
              <a href="mailto:contato@cicote.com" className="text-primary hover:text-primary/80 transition-colors">
                contato@cicote.com
              </a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Telefone</h3>
              <a href="tel:+5511999999999" className="text-primary hover:text-primary/80 transition-colors">
                +55 (11) 99999-9999
              </a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Localização</h3>
              <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
