import React, { useState, useEffect, useMemo } from 'react';
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

import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useShippingOptions } from '@/hooks/useShippingOptions';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm() {
  const [, setLocation] = useLocation();
  const { cartItems, clearCart } = useCart();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { data: shippingOptions = [] } = useShippingOptions();
  
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart');
  const [selectedShipping, setSelectedShipping] = useState('super-frete');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Local state to keep cart data consistent even after the cart is cleared in DB/QueryClient
  const [checkoutData, setCheckoutData] = useState<any[]>([]);

  const [formData, setFormData] = useState<Record<string, string>>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
  });

  // Capture cart status when step is 'cart' or it's first load
  useEffect(() => {
    if (cartItems.length > 0 && checkoutData.length === 0) {
      setCheckoutData(cartItems);
    }
  }, [cartItems]);
  
  const subtotal = useMemo(() => {
    const items = checkoutData.length > 0 ? checkoutData : cartItems;
    return items.reduce((sum, item: any) => {
      const price = typeof item.product?.price === 'string' ? parseFloat(item.product.price) : (item.product?.price || 0);
      return sum + (price * item.quantity);
    }, 0);
  }, [checkoutData, cartItems]);

  const currentShipping = shippingOptions.find((s: any) => s.id === selectedShipping);
  const shipping = currentShipping?.price || 0;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const steps = [
    { id: 'cart', label: 'Carrinho', icon: ShoppingCart },
    { id: 'shipping', label: 'Entrega', icon: Truck },
    { id: 'payment', label: 'Pagamento', icon: CreditCard },
    { id: 'review', label: 'Revisão', icon: Package }
  ];

  const handleConfirmOrder = async () => {
    if (!stripe || !elements) {
      setPaymentError('Stripe não carregado corretamente.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Dados do cartão não encontrados. Por favor, volte ao passo de pagamento e tente novamente.');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // 1. Create order in backend
      const orderData = {
        items: checkoutData.length > 0 ? checkoutData : cartItems,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        shipping_method: selectedShipping,
        shipping_cost: shipping,
        subtotal,
        tax
      };

      const order = await createOrder(orderData);

      // 2. Create Payment Intent
      const intentRes = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: total
        })
      });

      if (!intentRes.ok) {
        throw new Error('Falha ao iniciar pagamento');
      }

      const { clientSecret } = await intentRes.json();

      // 3. Confirm Card Payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.cardName || `${formData.firstName} ${formData.lastName}`,
            email: formData.email
          }
        }
      });

      if (error) {
        setPaymentError(error.message || 'Erro no pagamento');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        clearCart();
        setLocation(`/order-confirmation/${order.id}`);
      }

    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Ocorreu um erro');
      setIsProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  return (
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
              <button 
                key={s.id} 
                className="flex items-center flex-1 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => {
                  const targetIndex = steps.findIndex(st => st.id === s.id);
                  const currentIndex = steps.findIndex(st => st.id === step);
                  if (targetIndex < currentIndex) setStep(s.id as any);
                }}
                disabled={steps.findIndex(st => st.id === s.id) > steps.findIndex(st => st.id === step)}
              >
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
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Cart Review */}
          <div className={step === 'cart' ? 'block' : 'hidden'}>
            <Card className="p-6 mb-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-6">
                Resumo do Carrinho
              </h2>
              <div className="space-y-4 mb-6">
                {(checkoutData.length > 0 ? checkoutData : cartItems).map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                    <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={item.product?.image || item.product?.image_url} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                      <p className="text-primary font-semibold mt-2">
                        R$ {((typeof item.product?.price === 'string' ? parseFloat(item.product.price) : (item.product?.price || 0)) * item.quantity).toFixed(2)}
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
          </div>

          {/* Shipping Info */}
          <div className={step === 'shipping' ? 'block' : 'hidden'}>
            <Card className="p-6 mb-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-6">
                Informações de Entrega
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Primeiro Nome</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="João"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Sobrenome</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="Silva"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="joao@example.com"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Endereço</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="Rua Principal, 123"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Cidade</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="São Paulo"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Estado</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="SP"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">CEP</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="01310-100"/>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">Opções de Frete</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shippingOptions.map((option: any) => (
                    <label key={option.id} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${selectedShipping === option.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <input type="radio" name="shipping" value={option.id} checked={selectedShipping === option.id} onChange={() => setSelectedShipping(option.id)} className="w-4 h-4 mt-1" />
                      <div className="flex-1">
                        <span className="font-semibold text-foreground">{option.name}</span>
                        <p className="text-xs text-muted-foreground">{option.days}</p>
                        <p className="text-sm font-bold text-primary mt-1">{option.price > 0 ? `R$ ${option.price.toFixed(2)}` : 'Grátis'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep('cart')} variant="outline" className="flex-1 border-border">Voltar</Button>
                <Button onClick={() => setStep('payment')} className="flex-1 bg-primary text-primary-foreground">Continuar para Pagamento</Button>
              </div>
            </Card>
          </div>

          {/* Payment Info - WE KEEP THIS MOUNTED BUT HIDDEN */}
          <div className={step === 'payment' || step === 'review' ? 'block' : 'hidden'}>
            <Card className={`p-6 mb-6 ${step === 'review' ? 'hidden' : 'block'}`}>
              <h2 className="font-display font-semibold text-lg text-foreground mb-6">Informações de Pagamento</h2>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Pagamento Seguro</p>
                  <p className="text-xs text-green-700">Processado com Stripe</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Nome no Cartão</label>
                  <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" placeholder="João Silva"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Dados do Cartão (Stripe)</label>
                  <div className="p-3 bg-secondary rounded-lg border border-border">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep('shipping')} variant="outline" className="flex-1 border-border">Voltar</Button>
                <Button onClick={() => setStep('review')} className="flex-1 bg-primary text-primary-foreground">Revisar Pedido</Button>
              </div>
            </Card>
          </div>

          {/* Review & Confirm */}
          <div className={step === 'review' ? 'block' : 'hidden'}>
            <Card className="p-6 mb-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-6">Revisão do Pedido</h2>
              <div className="space-y-6">
                <div className="pb-6 border-b border-border">
                  <h3 className="font-semibold text-foreground mb-3">Entrega</h3>
                  <p className="text-sm">{formData.firstName} {formData.lastName}</p>
                  <p className="text-sm text-muted-foreground">{formData.address}</p>
                  <p className="text-sm text-muted-foreground">{formData.city}, {formData.state} - {formData.zipCode}</p>
                </div>
                <div className="pb-6 border-b border-border">
                  <h3 className="font-semibold text-foreground mb-3">Pagamento</h3>
                  <p className="text-sm">{formData.cardName || 'Portador do Cartão'}</p>
                  <p className="text-sm text-muted-foreground">Via Cartão de Crédito</p>
                </div>
              </div>
              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{paymentError}</p>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setStep('payment')} variant="outline" className="flex-1 border-border">Voltar</Button>
                <Button disabled={isProcessing} onClick={handleConfirmOrder} className="flex-1 bg-primary text-primary-foreground">
                  {isProcessing ? 'Processando...' : 'Confirmar e Pagar'}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-display font-semibold text-lg text-foreground mb-6">Resumo do Pedido</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-foreground font-medium">{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impostos (15%)</span>
                <span className="text-foreground font-medium">R$ {tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-display font-bold text-xl text-primary">R$ {total.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-700">Use 4242 4242 4242 4242 para testar pagamento</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => setLocation('/cart')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>
          <h1 className="font-display font-bold text-xl text-foreground">Checkout</h1>
          <div className="w-12" />
        </div>
      </header>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
