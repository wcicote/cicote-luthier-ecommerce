# Plano de Integração Backend - Cicote Luthier

## 📋 Visão Geral
Este documento apresenta um plano completo para integrar um backend funcional com Supabase ao site Cicote Luthier, permitindo que todas as funcionalidades do e-commerce operem com dados reais.

---

## 🗄️ FASE 1: SETUP DO SUPABASE

### 1.1 Configuração Inicial
- [ ] Criar conta no Supabase (supabase.com)
- [ ] Criar novo projeto no Supabase
- [ ] Configurar autenticação (Google OAuth)
- [ ] Obter URL da API e chaves públicas/privadas
- [ ] Armazenar credenciais em arquivo `.env.local`

### 1.2 Configuração de Autenticação
- [ ] Habilitar Google OAuth no Supabase
- [ ] Configurar URLs de callback (localhost e produção)
- [ ] Criar tabela de usuários com campos: id, email, nome, avatar, data_criacao
- [ ] Configurar políticas de segurança (RLS - Row Level Security)

---

## 📊 FASE 2: DESIGN DO BANCO DE DADOS

### 2.1 Tabelas Principais

#### **Tabela: users**
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- nome (TEXT)
- avatar_url (TEXT)
- telefone (TEXT)
- data_criacao (TIMESTAMP)
- data_atualizacao (TIMESTAMP)
```

#### **Tabela: produtos**
```sql
- id (UUID, PK)
- nome (TEXT)
- descricao (TEXT)
- categoria (TEXT) - 'banjos', 'acessorios'
- preco (DECIMAL)
- preco_desconto (DECIMAL, NULLABLE)
- estoque (INTEGER)
- imagens (JSONB) - array de URLs
- especificacoes (JSONB) - dados técnicos
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
- ativo (BOOLEAN)
```

#### **Tabela: categorias**
```sql
- id (UUID, PK)
- nome (TEXT, UNIQUE)
- descricao (TEXT)
- imagem_url (TEXT)
- slug (TEXT, UNIQUE)
```

#### **Tabela: carrinho_itens**
```sql
- id (UUID, PK)
- usuario_id (UUID, FK -> users)
- produto_id (UUID, FK -> produtos)
- quantidade (INTEGER)
- preco_unitario (DECIMAL)
- frete_selecionado (TEXT) - 'super-frete', 'sedex', 'pac', 'retirada'
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

#### **Tabela: pedidos**
```sql
- id (UUID, PK)
- usuario_id (UUID, FK -> users)
- numero_pedido (TEXT, UNIQUE)
- status (TEXT) - 'pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'
- subtotal (DECIMAL)
- frete_valor (DECIMAL)
- impostos (DECIMAL)
- total (DECIMAL)
- metodo_pagamento (TEXT) - 'stripe', 'pix', 'boleto'
- stripe_payment_id (TEXT, NULLABLE)
- endereco_entrega (JSONB)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

#### **Tabela: pedido_itens**
```sql
- id (UUID, PK)
- pedido_id (UUID, FK -> pedidos)
- produto_id (UUID, FK -> produtos)
- quantidade (INTEGER)
- preco_unitario (DECIMAL)
- subtotal (DECIMAL)
```

#### **Tabela: promocoes**
```sql
- id (UUID, PK)
- codigo (TEXT, UNIQUE)
- descricao (TEXT)
- tipo (TEXT) - 'percentual', 'fixo'
- valor (DECIMAL)
- uso_maximo (INTEGER)
- uso_atual (INTEGER)
- data_inicio (TIMESTAMP)
- data_fim (TIMESTAMP)
- ativo (BOOLEAN)
- criado_em (TIMESTAMP)
```

#### **Tabela: opcoes_frete**
```sql
- id (UUID, PK)
- nome (TEXT) - 'Super Frete', 'SEDEX', 'PAC', 'Retirada'
- slug (TEXT, UNIQUE)
- dias_minimo (INTEGER)
- dias_maximo (INTEGER)
- valor_base (DECIMAL)
- ativo (BOOLEAN)
- padrao (BOOLEAN)
```

#### **Tabela: configuracoes_site**
```sql
- id (UUID, PK)
- chave (TEXT, UNIQUE) - 'nome_loja', 'email_contato', 'telefone', 'endereco', etc
- valor (TEXT)
- tipo (TEXT) - 'texto', 'numero', 'booleano', 'json'
- atualizado_em (TIMESTAMP)
```

#### **Tabela: avaliacoes_produtos**
```sql
- id (UUID, PK)
- produto_id (UUID, FK -> produtos)
- usuario_id (UUID, FK -> users)
- nota (INTEGER) - 1 a 5
- comentario (TEXT)
- criado_em (TIMESTAMP)
```

#### **Tabela: encomendas_customizadas**
```sql
- id (UUID, PK)
- usuario_id (UUID, FK -> users)
- nome_cliente (TEXT)
- email_cliente (TEXT)
- telefone_cliente (TEXT)
- descricao_encomenda (TEXT)
- especificacoes (JSONB)
- orcamento_estimado (DECIMAL)
- status (TEXT) - 'nova', 'em_analise', 'orcado', 'aceito', 'em_producao', 'pronto', 'entregue'
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

### 2.2 Índices e Relacionamentos
- [ ] Criar índices em: usuario_id, produto_id, categoria, status
- [ ] Configurar cascata de deleção apropriada
- [ ] Adicionar constraints de integridade referencial

---

## 🔐 FASE 3: SEGURANÇA E POLÍTICAS RLS

### 3.1 Row Level Security (RLS)
- [ ] Habilitar RLS em todas as tabelas
- [ ] Criar políticas para usuários verem apenas seus dados
- [ ] Criar políticas para admin gerenciar todos os dados
- [ ] Criar políticas para leitura pública de produtos

### 3.2 Exemplo de Políticas
```sql
-- Usuários veem apenas seus próprios dados
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Produtos são públicos para leitura
CREATE POLICY "Products are public"
ON produtos FOR SELECT
USING (ativo = true);

-- Usuários veem apenas seus pedidos
CREATE POLICY "Users can view own orders"
ON pedidos FOR SELECT
USING (auth.uid() = usuario_id);
```

---

## 🖥️ FASE 4: UPGRADE DO PROJETO PARA FULL-STACK

### 4.1 Adicionar Feature web-db-user
- [ ] Executar: `webdev_add_feature("web-db-user")`
- [ ] Isso adicionará:
  - Backend Node.js/Express
  - Banco de dados PostgreSQL (local)
  - Sistema de autenticação
  - Variáveis de ambiente

### 4.2 Configurar Variáveis de Ambiente
- [ ] Adicionar ao `.env`:
  ```
  SUPABASE_URL=https://seu-projeto.supabase.co
  SUPABASE_ANON_KEY=sua-chave-anonima
  SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
  STRIPE_SECRET_KEY=sua-chave-stripe
  STRIPE_PUBLISHABLE_KEY=sua-chave-publica-stripe
  JWT_SECRET=seu-jwt-secret
  ```

---

## 🔌 FASE 5: INTEGRAÇÃO FRONTEND

### 5.1 Instalação de Dependências
- [ ] Instalar `@supabase/supabase-js`
- [ ] Instalar `@stripe/react-stripe-js`
- [ ] Instalar `react-query` (para cache de dados)
- [ ] Instalar `zustand` (para state management)

### 5.2 Criar Cliente Supabase
- [ ] Criar arquivo `client/src/lib/supabase.ts`
- [ ] Inicializar cliente com URL e chave anônima
- [ ] Exportar funções de autenticação

### 5.3 Criar Hooks Customizados
- [ ] `useAuth()` - gerenciar autenticação
- [ ] `useProducts()` - buscar produtos
- [ ] `useCart()` - gerenciar carrinho
- [ ] `useOrders()` - gerenciar pedidos
- [ ] `usePromotions()` - aplicar promoções

### 5.4 Atualizar Páginas Frontend
- [ ] **Login.tsx**: Integrar autenticação Google com Supabase
- [ ] **Home.tsx**: Buscar produtos do banco em tempo real
- [ ] **ProductDetail.tsx**: Carregar dados reais do produto
- [ ] **Cart.tsx**: Sincronizar com banco de dados
- [ ] **Checkout.tsx**: Integrar Stripe e salvar pedido
- [ ] **Orders.tsx**: Listar pedidos do usuário
- [ ] **Contact.tsx**: Salvar encomendas customizadas

---

## 🔧 FASE 6: INTEGRAÇÃO BACKEND

### 6.1 Criar Rotas de API

#### **Autenticação**
- [ ] `POST /api/auth/login` - Login com Google
- [ ] `POST /api/auth/logout` - Logout
- [ ] `GET /api/auth/user` - Obter usuário atual
- [ ] `POST /api/auth/refresh` - Renovar token

#### **Produtos**
- [ ] `GET /api/products` - Listar produtos com filtros
- [ ] `GET /api/products/:id` - Detalhes do produto
- [ ] `POST /api/products` (admin) - Criar produto
- [ ] `PUT /api/products/:id` (admin) - Atualizar produto
- [ ] `DELETE /api/products/:id` (admin) - Deletar produto
- [ ] `GET /api/categories` - Listar categorias

#### **Carrinho**
- [ ] `GET /api/cart` - Obter carrinho do usuário
- [ ] `POST /api/cart/items` - Adicionar item ao carrinho
- [ ] `PUT /api/cart/items/:id` - Atualizar quantidade
- [ ] `DELETE /api/cart/items/:id` - Remover item
- [ ] `DELETE /api/cart` - Limpar carrinho

#### **Pedidos**
- [ ] `GET /api/orders` - Listar pedidos do usuário
- [ ] `GET /api/orders/:id` - Detalhes do pedido
- [ ] `POST /api/orders` - Criar novo pedido
- [ ] `PUT /api/orders/:id` (admin) - Atualizar status
- [ ] `GET /api/orders/:id/invoice` - Gerar fatura

#### **Pagamentos (Stripe)**
- [ ] `POST /api/payments/create-intent` - Criar intent de pagamento
- [ ] `POST /api/payments/webhook` - Webhook do Stripe
- [ ] `GET /api/payments/:id/status` - Status do pagamento

#### **Promoções**
- [ ] `GET /api/promotions` - Listar promoções ativas
- [ ] `POST /api/promotions/validate` - Validar código de cupom
- [ ] `POST /api/promotions` (admin) - Criar promoção
- [ ] `PUT /api/promotions/:id` (admin) - Atualizar promoção

#### **Frete**
- [ ] `GET /api/shipping/options` - Listar opções de frete
- [ ] `POST /api/shipping/calculate` - Calcular frete por CEP
- [ ] `POST /api/shipping/options` (admin) - Criar opção de frete

#### **Encomendas Customizadas**
- [ ] `POST /api/custom-orders` - Criar encomenda
- [ ] `GET /api/custom-orders/:id` - Detalhes da encomenda
- [ ] `PUT /api/custom-orders/:id` (admin) - Atualizar status

#### **Configurações**
- [ ] `GET /api/settings` - Obter configurações do site
- [ ] `PUT /api/settings` (admin) - Atualizar configurações

### 6.2 Middleware de Autenticação
- [ ] Criar middleware para verificar JWT
- [ ] Criar middleware para verificar permissões (admin)
- [ ] Criar middleware para logging de requisições

### 6.3 Tratamento de Erros
- [ ] Implementar error handler global
- [ ] Criar tipos de erro customizados
- [ ] Adicionar logging de erros

---

## 💳 FASE 7: INTEGRAÇÃO STRIPE

### 7.1 Setup Stripe
- [ ] Criar conta no Stripe
- [ ] Obter chaves de API (teste e produção)
- [ ] Configurar webhook de pagamento
- [ ] Testar modo de teste com cartões fictícios

### 7.2 Fluxo de Pagamento
- [ ] Criar intent de pagamento no backend
- [ ] Enviar intent para frontend
- [ ] Usar Stripe Elements no checkout
- [ ] Processar confirmação de pagamento
- [ ] Atualizar status do pedido

### 7.3 Webhook do Stripe
- [ ] Configurar endpoint `/api/payments/webhook`
- [ ] Processar eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Atualizar pedido no banco de dados
- [ ] Enviar email de confirmação

---

## 📧 FASE 8: NOTIFICAÇÕES E EMAIL

### 8.1 Configurar Serviço de Email
- [ ] Escolher provedor (SendGrid, Resend, Mailgun)
- [ ] Configurar credenciais
- [ ] Criar templates de email

### 8.2 Emails a Implementar
- [ ] Confirmação de cadastro
- [ ] Confirmação de pedido
- [ ] Atualização de status de pedido
- [ ] Confirmação de encomenda customizada
- [ ] Notificação de estoque baixo (admin)

---

## 🛠️ FASE 9: PAINEL ADMINISTRATIVO FUNCIONAL

### 9.1 Atualizar Páginas Admin
- [ ] **Dashboard**: Exibir estatísticas reais (vendas, pedidos, visitantes)
- [ ] **Produtos**: CRUD completo com upload de imagens
- [ ] **Estoque**: Monitoramento em tempo real
- [ ] **Pedidos**: Gerenciar status e rastreamento
- [ ] **Promoções**: CRUD de cupons e descontos
- [ ] **Configurações**: Editar informações do site
- [ ] **Usuários**: Gerenciar clientes
- [ ] **Encomendas**: Gerenciar pedidos customizados

### 9.2 Upload de Imagens
- [ ] Integrar Supabase Storage
- [ ] Criar bucket para imagens de produtos
- [ ] Implementar upload com preview
- [ ] Adicionar otimização de imagens (compressão, redimensionamento)

---

## 🔍 FASE 10: FUNCIONALIDADES AVANÇADAS

### 10.1 Busca e Filtros
- [ ] Implementar busca full-text no Supabase
- [ ] Criar filtros por categoria, preço, avaliação
- [ ] Adicionar ordenação (preço, popularidade, novidade)

### 10.2 Avaliações e Comentários
- [ ] Permitir usuários avaliar produtos
- [ ] Exibir média de avaliações
- [ ] Moderar comentários (admin)

### 10.3 Wishlist/Favoritos
- [ ] Criar tabela de favoritos
- [ ] Adicionar botão de favoritar em produtos
- [ ] Criar página de favoritos do usuário

### 10.4 Rastreamento de Pedidos
- [ ] Integrar com API de rastreamento (Super Frete, Correios)
- [ ] Exibir status em tempo real
- [ ] Enviar notificações de atualização

### 10.5 Sistema de Recomendações
- [ ] Recomendar produtos relacionados
- [ ] Sugerir produtos com base em histórico
- [ ] Criar seção "Clientes também compraram"

---

## 🧪 FASE 11: TESTES E VALIDAÇÃO

### 11.1 Testes Unitários
- [ ] Testar funções de autenticação
- [ ] Testar cálculos de preço e frete
- [ ] Testar validação de cupons

### 11.2 Testes de Integração
- [ ] Testar fluxo completo de compra
- [ ] Testar pagamento com Stripe
- [ ] Testar criação de encomenda customizada

### 11.3 Testes de Performance
- [ ] Otimizar queries do banco
- [ ] Implementar cache (Redis)
- [ ] Testar carga com múltiplos usuários

---

## 🚀 FASE 12: DEPLOYMENT E PRODUÇÃO

### 12.1 Preparação para Produção
- [ ] Configurar variáveis de ambiente de produção
- [ ] Habilitar HTTPS
- [ ] Configurar CORS
- [ ] Adicionar rate limiting

### 12.2 Deploy
- [ ] Fazer deploy do backend (Vercel, Railway, Render)
- [ ] Fazer deploy do frontend (Manus, Vercel, Netlify)
- [ ] Configurar domínio customizado
- [ ] Configurar SSL/TLS

### 12.3 Monitoramento
- [ ] Adicionar logging (Sentry, LogRocket)
- [ ] Configurar alertas de erro
- [ ] Monitorar performance
- [ ] Acompanhar métricas de negócio

---

## 📋 CHECKLIST DE EXECUÇÃO

### Ordem Recomendada de Implementação:
1. ✅ Criar banco de dados Supabase
2. ✅ Configurar autenticação
3. ✅ Integrar frontend com Supabase
4. ✅ Implementar funcionalidade de produtos
5. ✅ Implementar carrinho
6. ✅ Integrar Stripe
7. ✅ Implementar pedidos
8. ✅ Adicionar promoções
9. ✅ Implementar frete
10. ✅ Criar painel admin funcional
11. ✅ Adicionar funcionalidades avançadas
12. ✅ Testar tudo
13. ✅ Deploy em produção

---

## 📊 ESTIMATIVA DE TEMPO

| Fase | Tempo Estimado |
|------|----------------|
| Setup Supabase | 2-3 horas |
| Design do Banco | 3-4 horas |
| Upgrade para Full-Stack | 1-2 horas |
| Integração Frontend | 8-10 horas |
| Integração Backend | 12-15 horas |
| Stripe | 4-5 horas |
| Email/Notificações | 3-4 horas |
| Admin Funcional | 8-10 horas |
| Funcionalidades Avançadas | 10-12 horas |
| Testes | 6-8 horas |
| Deployment | 3-4 horas |
| **TOTAL** | **60-77 horas** |

---

## 🎯 PRÓXIMOS PASSOS

Quando estiver pronto para implementar, execute os passos na seguinte ordem:

1. **Preparar Supabase**: Criar projeto e tabelas
2. **Upgrade do Projeto**: Adicionar feature web-db-user
3. **Implementar Autenticação**: Login com Google
4. **Implementar Produtos**: CRUD e listagem
5. **Implementar Carrinho**: Sincronização com banco
6. **Implementar Checkout**: Integração com Stripe
7. **Implementar Pedidos**: Salvamento e rastreamento
8. **Implementar Admin**: Painel funcional
9. **Testes e Validação**: Verificar tudo
10. **Deploy**: Colocar em produção

---

## 📞 SUPORTE E RECURSOS

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Stripe](https://stripe.com/docs)
- [Documentação Node.js/Express](https://expressjs.com/)
- [Documentação React](https://react.dev)

---

**Documento criado em:** 13 de Março de 2026  
**Status:** Plano Pronto para Execução  
**Próxima Ação:** Aguardando aprovação do usuário para iniciar implementação
