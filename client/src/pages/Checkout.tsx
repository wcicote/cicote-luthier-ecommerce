import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Lock,
  ShoppingCart,
  ChevronLeft,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Truck,
  Package
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart');
  const [formData, setFormData] = useState<Record<string, string>>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  // Mock cart items
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Cordas Premium Nylon',
      price: 89.90,
      quantity: 2,
      image: 'https://via.placeholder.com/80'
    },
    {
      id: '2',
      name: 'Correia de Couro Artesanal',
      price: 149.90,
      quantity: 1,
      image: 'https://via.placeholder.com/80'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 25.00;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData(prev => ({ ...prev, cardExpiry: value }));
  };

  const steps = [
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart },
    { id: 'shipping', label: 'Entrega', icon: Truck },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
    { id: 'review', label: 'Revisão', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => setLocation('/cart')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="font-display font-bold text-xl text-foreground">Checkout</h1>
          <div className="w-12" />
        </div>
      </header>

      <div className="container py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => {
              const StepIcon = s.icon;
              const isActive = step === s.id;
              const isCompleted = ['cart', 'shipping', 'payment'].includes(s.id) && 
                                 steps.findIndex(st => st.id === step) > index;

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden sm:block ml-2">
                    <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {s.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                        isCompleted ? 'bg-green-500' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cart Review */}
            {step === 'cart' && (
              <Card className="p-6 mb-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-6">
                  Resumo do Carrinho
                </h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                      <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                        <p className="text-primary font-semibold mt-2">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setStep('shipping')}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continuar para Entrega
                </Button>
              </Card>
            )}

            {/* Shipping Info */}
            {step === 'shipping' && (
              <Card className="p-6 mb-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-6">
                  Informações de Entrega
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Primeiro Nome
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="João"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Silva"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="joao@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Rua Principal, 123"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="SP"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="01310-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setStep('cart')}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setStep('payment')}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continuar para Pagamento
                  </Button>
                </div>
              </Card>
            )}

            {/* Payment Info */}
            {step === 'payment' && (
              <Card className="p-6 mb-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-6">
                  Informações de Pagamento
                </h2>

                {/* Security Notice */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Pagamento Seguro</p>
                    <p className="text-xs text-green-700">Seus dados são criptografados e processados de forma segura pelo Stripe</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="João Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Número do Cartão
                    </label>
                    <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData['cardNumber'] || ''}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      placeholder="4242 4242 4242 4242"
                    />
                      <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Teste: 4242 4242 4242 4242
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Validade (MM/AA)
                      </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        placeholder="12/25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        CVC
                      </label>
                    <input
                      type="text"
                      name="cardCVC"
                      value={formData.cardCVC}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardCVC: e.target.value.slice(0, 4) }))}
                      maxLength={4}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      placeholder="123"
                    />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setStep('shipping')}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setStep('review')}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Revisar Pedido
                  </Button>
                </div>
              </Card>
            )}

            {/* Review & Confirm */}
            {step === 'review' && (
              <Card className="p-6 mb-6">
                <h2 className="font-display font-semibold text-lg text-foreground mb-6">
                  Revisão do Pedido
                </h2>

                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="pb-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">Entrega</h3>
                    <p className="text-sm text-foreground">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-muted-foreground">{formData.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="pb-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">Pagamento</h3>
                    <p className="text-sm text-foreground">{formData.cardName}</p>
                    <p className="text-sm text-muted-foreground">
                      •••• •••• •••• {formData.cardNumber.slice(-4)}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Itens</h3>
                    <div className="space-y-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.name} x{item.quantity}</span>
                          <span className="text-foreground font-medium">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setStep('payment')}
                    variant="outline"
                    className="flex-1 border-border"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setLocation('/order-confirmation')}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Confirmar e Pagar
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg text-foreground mb-6">
                Resumo do Pedido
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-foreground font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      `R$ ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impostos</span>
                  <span className="text-foreground font-medium">R$ {tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-display font-bold text-xl text-primary">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              {shipping === 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-xs text-green-700">
                    ✓ Frete grátis em compras acima de R$ 200
                  </p>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Use o cartão de teste 4242 4242 4242 4242 para simular pagamentos
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
