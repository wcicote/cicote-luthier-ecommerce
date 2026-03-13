# Cicote Luthier - E-commerce de Banjos Artesanais

Um site de e-commerce moderno e responsivo para a Cicote Luthier, especializada em acessórios para banjo e fabricação artesanal de banjos sob encomenda.

## 🎨 Design

O site foi desenvolvido com o conceito **Artisanal Modernism**, combinando:

- **Tipografia**: Playfair Display (elegante, para títulos) + Inter (moderna, para corpo)
- **Paleta de cores**: Marrom quente (#8B6F47), branco puro, cinza neutro, com acentos em ouro suave (#D4A574)
- **Layout**: Assimétrico com muito espaço em branco, imagens grandes de produtos
- **Interações**: Transições suaves, hover revelador, animações sutis

## 📄 Páginas

### Home
- Hero section com banjo artesanal destaque
- Seção de características (qualidade, tradição, sustentabilidade, garantia)
- Catálogo de produtos com filtros por categoria
- Seção de banjos sob encomenda
- Sobre a marca
- Call-to-action
- Informações de contato

### Detalhes do Produto
- Galeria de imagens
- Informações completas do produto
- Especificações técnicas
- Sistema de quantidade
- Opções de compra
- Produtos relacionados

### Carrinho de Compras
- Lista de itens no carrinho
- Resumo do pedido com cálculo de frete
- Opções de checkout

### Contato
- Formulário de contato
- Informações de contato (email, telefone, localização)
- Horário de funcionamento
- FAQ
- Seção de mapa

## 🛠️ Stack Técnico

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Roteamento**: Wouter
- **Ícones**: Lucide React
- **Build**: Vite

## 📁 Estrutura do Projeto

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ui/
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── lib/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
└── package.json
```

## 🚀 Como Executar

### Desenvolvimento

```bash
cd client
pnpm install
pnpm dev
```

O site estará disponível em `http://localhost:3000`

### Build para Produção

```bash
pnpm build
```

## 🎯 Recursos Implementados

- ✅ Design responsivo (mobile-first)
- ✅ Navegação intuitiva
- ✅ Catálogo de produtos com filtros
- ✅ Página de detalhes do produto
- ✅ Carrinho de compras
- ✅ Página de contato com formulário
- ✅ Footer com informações e links
- ✅ Design system consistente com Tailwind + shadcn/ui
- ✅ Tipografia elegante e profissional
- ✅ Paleta de cores artesanal

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎨 Customização

### Cores

As cores podem ser customizadas em `client/src/index.css`:

```css
:root {
  --primary: oklch(0.55 0.12 60);      /* Marrom quente */
  --accent: oklch(0.68 0.08 65);       /* Ouro suave */
  /* ... outras cores ... */
}
```

### Tipografia

As fontes podem ser alteradas em `client/index.html` e `client/src/index.css`:

```css
@theme inline {
  --font-display: "Playfair Display", serif;
  --font-sans: "Inter", sans-serif;
}
```

## 📧 Contato

Para dúvidas ou sugestões sobre o site:
- Email: contato@cicote.com
- Telefone: +55 (11) 99999-9999
- Localização: São Paulo, SP - Brasil

## 📄 Licença

© 2026 Cicote Luthier. Todos os direitos reservados.
