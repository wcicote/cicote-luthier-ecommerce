import { useQuery } from '@tanstack/react-query';
import { supabase, type Product, type Category } from '@/lib/supabase';

// =====================
// Filters Interface
// =====================
export interface ProductFilters {
  categoria?: string;   // category slug or id
  busca?: string;       // search query
  ordenacao?: 'preco_asc' | 'preco_desc' | 'nome' | 'mais_recente';
  destaque?: boolean;
}

// =====================
// Query Keys
// =====================
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

// =====================
// Supabase fetchers
// =====================
async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  console.log('[useProducts] Fetching products with filters:', filters);
  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('is_active', true);

  if (filters.destaque) {
    query = query.eq('featured', true);
  }

  if (filters.busca) {
    query = query.ilike('name', `%${filters.busca}%`);
  }

  if (filters.categoria && filters.categoria !== 'all') {
    // support filtering by category slug
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.categoria)
      .single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  switch (filters.ordenacao) {
    case 'preco_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'preco_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'nome':
      query = query.order('name', { ascending: true });
      break;
    case 'mais_recente':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) {
    console.error('[useProducts] Error fetching products:', error);
    throw error;
  }
  return (data ?? []) as any[];
}

async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as unknown as Product;
}

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

// =====================
// Hooks
// =====================
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => fetchProducts({ destaque: true }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
