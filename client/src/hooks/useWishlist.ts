import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

export function useWishlist() {
  const utils = trpc.useUtils();

  const { data: wishlistItems = [], isLoading } = trpc.wishlist.getItems.useQuery();

  const addMutation = trpc.wishlist.addItem.useMutation({
    onSuccess: () => {
      utils.wishlist.getItems.invalidate();
    },
  });

  const removeMutation = trpc.wishlist.removeItem.useMutation({
    onSuccess: () => {
      utils.wishlist.getItems.invalidate();
    },
  });

  const addItem = useCallback(
    (productId: number) => {
      return addMutation.mutateAsync({ productId });
    },
    [addMutation]
  );

  const removeItem = useCallback(
    (productId: number) => {
      return removeMutation.mutateAsync({ productId });
    },
    [removeMutation]
  );

  const isInWishlist = useCallback(
    (productId: number) => {
      return wishlistItems.some(item => item.productId === productId);
    },
    [wishlistItems]
  );

  return {
    wishlistItems,
    isLoading,
    addItem,
    removeItem,
    isInWishlist,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
