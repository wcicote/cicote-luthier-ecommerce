import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

// =====================
// Types
// =====================
export interface CartItemWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  preco_unitario: number | null;
  frete_selecionado: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    imagens: string[];
    stock: number;
  };
}

// Local storage key for guest cart
const GUEST_CART_KEY = 'cicote_guest_cart';

export interface GuestCartItem {
  id: string; // local id = product_id
  product_id: string;
  quantity: number;
  preco_unitario: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    imagens: string[];
  };
}

// =====================
// Query Keys
// =====================
const cartKeys = {
  all: ['cart'] as const,
  items: () => [...cartKeys.all, 'items'] as const,
  guestItems: () => [...cartKeys.all, 'guest'] as const,
};

// =====================
// Guest Cart Helpers
// =====================
function getGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestCartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

// =====================
// Supabase Fetchers
// =====================
async function fetchCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(id, name, price, image_url, imagens, stock)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []) as unknown as CartItemWithProduct[];
}

async function addCartItemToDb(userId: string, productId: string, quantity: number, price: number) {
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
        preco_unitario: price,
      });
    if (error) throw error;
  }
}

// =====================
// Main useCart Hook
// =====================
export function useCart() {
  const { user, isAuthenticated } = useSupabaseAuth();
  const queryClient = useQueryClient();

  // --- Authenticated cart (Supabase)
  const {
    data: dbCartItems = [],
    isLoading: dbLoading,
  } = useQuery({
    queryKey: cartKeys.items(),
    queryFn: () => fetchCartItems(user!.id),
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 30,
  });

  // --- Guest cart (localStorage)
  const {
    data: guestCartItems = [],
    isLoading: guestLoading,
  } = useQuery({
    queryKey: cartKeys.guestItems(),
    queryFn: () => getGuestCart(),
    enabled: !isAuthenticated,
    staleTime: 0,
  });

  const cartItems = isAuthenticated ? dbCartItems : guestCartItems;
  const isLoading = isAuthenticated ? dbLoading : guestLoading;

  // ----------------------
  // Add Item
  // ----------------------
  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (isAuthenticated && user) {
        // Fetch the product price
        const { data: product, error } = await supabase
          .from('products')
          .select('price')
          .eq('id', productId)
          .single();
        if (error || !product) throw new Error('Produto não encontrado');
        await addCartItemToDb(user.id, productId, quantity, (product as any).price);
      } else {
        // Guest cart in localStorage
        const { data: product } = await supabase
          .from('products')
          .select('id, name, price, image_url, imagens, stock')
          .eq('id', productId)
          .single();
        const current = getGuestCart();
        const existing = current.find(i => i.product_id === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          current.push({
            id: productId,
            product_id: productId,
            quantity,
            preco_unitario: (product as any)?.price ?? 0,
            product: product ? {
              ...product,
              name: (product as any).name ?? '',
              price: (product as any).price ?? 0,
            } : undefined,
          });
        }
        saveGuestCart(current);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      } else {
        queryClient.invalidateQueries({ queryKey: cartKeys.guestItems() });
      }
      toast.success('Item adicionado ao carrinho!');
    },
    onError: () => {
      toast.error('Erro ao adicionar ao carrinho.');
    },
  });

  // ----------------------
  // Update Item Quantity
  // ----------------------
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (isAuthenticated && user) {
        if (quantity <= 0) {
          const { error } = await supabase.from('cart_items').delete().eq('id', id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', id);
          if (error) throw error;
        }
      } else {
        const current = getGuestCart();
        if (quantity <= 0) {
          saveGuestCart(current.filter(i => i.id !== id));
        } else {
          const item = current.find(i => i.id === id);
          if (item) item.quantity = quantity;
          saveGuestCart(current);
        }
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      } else {
        queryClient.invalidateQueries({ queryKey: cartKeys.guestItems() });
      }
    },
    onError: () => toast.error('Erro ao atualizar item.'),
  });

  // ----------------------
  // Remove Item
  // ----------------------
  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isAuthenticated && user) {
        const { error } = await supabase.from('cart_items').delete().eq('id', id);
        if (error) throw error;
      } else {
        const current = getGuestCart();
        saveGuestCart(current.filter(i => i.id !== id));
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      } else {
        queryClient.invalidateQueries({ queryKey: cartKeys.guestItems() });
      }
      toast.success('Item removido do carrinho.');
    },
    onError: () => toast.error('Erro ao remover item.'),
  });

  // ----------------------
  // Clear Cart
  // ----------------------
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        saveGuestCart([]);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.items() });
      } else {
        queryClient.invalidateQueries({ queryKey: cartKeys.guestItems() });
      }
    },
  });

  const addItem = (productId: string, quantity = 1) =>
    addItemMutation.mutateAsync({ productId, quantity });

  const updateItem = (id: string, quantity: number) =>
    updateItemMutation.mutateAsync({ id, quantity });

  const removeItem = (id: string) => removeItemMutation.mutateAsync(id);

  const clearCart = () => clearCartMutation.mutateAsync();

  // Normalised cart items for UI
  const normalizedItems = cartItems.map((item: any) => {
    const p = item.product ?? {};
    return {
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      preco_unitario: item.preco_unitario ?? p.price ?? 0,
      product: {
        id: p.id ?? item.product_id,
        name: p.name ?? 'Produto',
        price: p.price ?? item.preco_unitario ?? 0,
        image_url: p.image_url ?? null,
        imagens: p.imagens ?? [],
        stock: p.stock ?? 0,
      },
    };
  });

  const totalItems = normalizedItems.reduce((s: number, i: any) => s + i.quantity, 0);

  return {
    cartItems: normalizedItems,
    isLoading,
    totalItems,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
}

// Named exports for mutation-only usage
export const useAddToCart = () => {
  const { addItem, isAdding } = useCart();
  return { addItem, isAdding };
};

export const useUpdateCartItem = () => {
  const { updateItem, isUpdating } = useCart();
  return { updateItem, isUpdating };
};

export const useRemoveCartItem = () => {
  const { removeItem, isRemoving } = useCart();
  return { removeItem, isRemoving };
};
