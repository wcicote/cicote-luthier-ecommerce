-- =============================================
-- Cicote Luthier - Schema completo (referência)
-- Aplicado via Supabase MCP migrations
-- =============================================

-- EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- ENUM TYPES
-- =====================
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'staff');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('card', 'pix', 'boleto');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- =====================
-- PROFILES (estende auth.users)
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: criar perfil ao registrar usuário
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

-- =====================
-- USER ROLES
-- =====================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CATEGORIES
-- =====================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PRODUCTS
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image_url TEXT,
  imagens JSONB DEFAULT '[]',
  especificacoes JSONB DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_custom_order BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PRODUCT IMAGES
-- =====================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CART ITEMS
-- =====================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  preco_unitario NUMERIC(10,2),
  frete_selecionado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =====================
-- ORDERS
-- =====================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE,
  status order_status DEFAULT 'pending',
  subtotal NUMERIC(10,2),
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  shipping_method TEXT,
  shipping_address JSONB NOT NULL,
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  stripe_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ORDER ITEMS
-- =====================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- REVIEWS
-- =====================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- =====================
-- PROMOÇÕES
-- =====================
CREATE TABLE IF NOT EXISTS promocoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('percentual', 'fixo')),
  valor NUMERIC(10,2) NOT NULL,
  uso_maximo INTEGER,
  uso_atual INTEGER DEFAULT 0,
  valor_minimo_pedido NUMERIC(10,2),
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- OPÇÕES DE FRETE
-- =====================
CREATE TABLE IF NOT EXISTS opcoes_frete (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  dias_minimo INTEGER NOT NULL,
  dias_maximo INTEGER NOT NULL,
  valor_base NUMERIC(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ENCOMENDAS CUSTOMIZADAS
-- =====================
CREATE TABLE IF NOT EXISTS encomendas_customizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome_cliente TEXT NOT NULL,
  email_cliente TEXT NOT NULL,
  telefone_cliente TEXT,
  descricao_encomenda TEXT NOT NULL,
  tipo_instrumento TEXT,
  material_preferido TEXT,
  orcamento_estimado NUMERIC(10,2),
  status TEXT DEFAULT 'nova' CHECK (status IN ('nova', 'em_analise', 'orcamento_enviado', 'aprovada', 'em_producao', 'concluida', 'cancelada')),
  notas_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- User Roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT USING (user_id = auth.uid());

-- Categories (public read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (TRUE);

-- Products (public read for active)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products are publicly readable" ON products FOR SELECT USING (is_active = TRUE);

-- Cart Items (user only)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (user_id = auth.uid());

-- Orders (user only)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (user_id = auth.uid());
