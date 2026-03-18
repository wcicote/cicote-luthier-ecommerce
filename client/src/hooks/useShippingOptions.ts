import { useQuery } from '@tanstack/react-query';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
}

export function useShippingOptions() {
  return useQuery({
    queryKey: ['shipping-options'],
    queryFn: async (): Promise<ShippingOption[]> => {
      // In a real application, this might fetch from an API or a DB table
      // For now, we return the standard options as specified in the requirements
      return [
        { id: 'super-frete', name: 'Super Frete', price: 29.90, days: '2-3 dias úteis' },
        { id: 'sedex', name: 'SEDEX', price: 49.90, days: '1-2 dias úteis' },
        { id: 'pac', name: 'PAC', price: 14.90, days: '5-8 dias úteis' },
        { id: 'retirada', name: 'Retirada na Loja', price: 0, days: 'Imediato' }
      ];
    },
    staleTime: Infinity, // These don't change often
  });
}
