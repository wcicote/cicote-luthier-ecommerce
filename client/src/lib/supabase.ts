import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Authentication and database features will not work.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// =====================
// Database Types
// =====================

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  cpf: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  imagens: string[];
  especificacoes: Record<string, string>;
  stock: number;
  category_id: string | null;
  is_active: boolean;
  is_custom_order: boolean;
  featured: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
  // relational
  categories?: Category;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  preco_unitario: number | null;
  frete_selecionado: string | null;
  created_at: string;
  updated_at: string;
  // relational
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string | null;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number | null;
  shipping_cost: number | null;
  tax: number | null;
  total_amount: number;
  shipping_method: string | null;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    email: string;
  };
  payment_method: 'card' | 'pix' | 'boleto' | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_image_url: string | null;
  created_at: string;
}

export interface Promocao {
  id: string;
  codigo: string;
  descricao: string | null;
  tipo: 'percentual' | 'fixo';
  valor: number;
  uso_maximo: number | null;
  uso_atual: number;
  valor_minimo_pedido: number | null;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
  created_at: string;
}

export interface OpcaoFrete {
  id: string;
  nome: string;
  slug: string;
  dias_minimo: number;
  dias_maximo: number;
  valor_base: number;
  ativo: boolean;
}

export interface EncomendaCustomizada {
  id: string;
  usuario_id: string | null;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string | null;
  descricao_encomenda: string;
  tipo_instrumento: string | null;
  material_preferido: string | null;
  orcamento_estimado: number | null;
  status: 'nova' | 'em_analise' | 'orcamento_enviado' | 'aprovada' | 'em_producao' | 'concluida' | 'cancelada';
  notas_admin: string | null;
  created_at: string;
  updated_at: string;
}
