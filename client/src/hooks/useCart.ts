import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export function useCart() {
  const utils = trpc.useUtils();
  
  const { data: cartItems = [], isLoading } = trpc.cart.getItems.useQuery(undefined, {
    enabled: true,
  });

  const addItemMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
    },
  });

  const updateItemMutation = trpc.cart.updateItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
    },
  });

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
    },
  });

  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
    },
  });

  const addItem = useCallback(
    (productId: number, quantity: number = 1) => {
      return addItemMutation.mutateAsync({ productId, quantity });
    },
    [addItemMutation]
  );

  const updateItem = useCallback(
    (id: number, quantity: number) => {
      return updateItemMutation.mutateAsync({ id, quantity });
    },
    [updateItemMutation]
  );

  const removeItem = useCallback(
    (id: number) => {
      return removeItemMutation.mutateAsync({ id });
    },
    [removeItemMutation]
  );

  const clear = useCallback(
    () => {
      return clearMutation.mutateAsync();
    },
    [clearMutation]
  );

  return {
    cartItems,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    clear,
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
