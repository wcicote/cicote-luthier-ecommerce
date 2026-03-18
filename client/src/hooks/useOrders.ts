import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const API_BASE_URL = '/api/orders';

export function useOrders() {
  const { session } = useSupabaseAuth();

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders;
    },
    enabled: !!session?.access_token,
  });
}

export function useOrder(id: string | null) {
  const { session } = useSupabaseAuth();

  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch order details');
      const data = await res.json();
      return data.order;
    },
    enabled: !!id && !!session?.access_token,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { session } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (orderData: any) => {
      if (!session) throw new Error("Must be logged in to create order");
      
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
      }
      
      const data = await res.json();
      return data.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}
