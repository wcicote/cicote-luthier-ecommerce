import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-display font-semibold text-sm tracking-widest uppercase mb-4">
            Entre em Contato
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Fale Conosco
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temos prazer em ouvir de você. Entre em contato conosco para dúvidas, encomendas ou sugestões.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">Responderemos em até 24 horas</p>
              <a href="mailto:contato@cicote.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                contato@cicote.com
              </a>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Telefone</h3>
              <p className="text-muted-foreground mb-4">Seg-Sex, 9h às 18h</p>
              <a href="tel:+5511999999999" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                +55 (11) 99999-9999
              </a>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Localização</h3>
              <p className="text-muted-foreground mb-4">Visite nossa oficina</p>
              <p className="text-primary hover:text-primary/80 font-semibold transition-colors">
                São Paulo, SP - Brasil
              </p>
            </Card>
          </div>

          {/* Contact Form and Hours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                Envie uma Mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="product">Dúvida sobre Produtos</option>
                    <option value="custom">Banjo Personalizado</option>
                    <option value="support">Suporte Técnico</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    placeholder="Sua mensagem aqui..."
                  ></textarea>
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Enviar Mensagem
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>

            {/* Hours and Info */}
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                Informações Úteis
              </h2>

              {/* Hours */}
              <Card className="p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                      Horário de Funcionamento
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Segunda a Sexta:</span>
                        <span className="font-semibold text-foreground">9h às 18h</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sábado:</span>
                        <span className="font-semibold text-foreground">10h às 14h</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Domingo:</span>
                        <span className="font-semibold text-foreground">Fechado</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* FAQ */}
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">Qual é o prazo de entrega?</p>
                    <p className="text-sm text-muted-foreground">
                      Banjos sob encomenda levam 8-12 semanas. Acessórios são enviados em 2-5 dias úteis.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">Vocês fazem customização?</p>
                    <p className="text-sm text-muted-foreground">
                      Sim! Todos os nossos banjos são personalizados. Entre em contato para discutir suas preferências.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">Qual é a garantia?</p>
                    <p className="text-sm text-muted-foreground">
                      Todos os produtos têm garantia vitalícia de defeitos de fabricação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
            Encontre-nos
          </h2>
          <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
            {/* Placeholder for map */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Mapa interativo aqui</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
