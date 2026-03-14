import { trpc } from "@/lib/trpc";

export function useOrders(limit = 50, offset = 0) {
  const { data: orders = [], isLoading } = trpc.orders.list.useQuery({
    limit,
    offset,
  });

  return { orders, isLoading };
}

export function useOrderById(id: number) {
  const { data: order, isLoading } = trpc.orders.getById.useQuery({ id });

  return { order, isLoading };
}

export function useCreateOrder() {
  const utils = trpc.useUtils();

  const mutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      utils.orders.list.invalidate();
    },
  });

  return {
    createOrder: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
