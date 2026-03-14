import { trpc } from "@/lib/trpc";

export function useProducts(limit = 50, offset = 0) {
  const { data: products = [], isLoading } = trpc.products.list.useQuery({
    limit,
    offset,
  });

  return { products, isLoading };
}

export function useProductById(id: number) {
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id });

  return { product, isLoading };
}

export function useSearchProducts(query: string) {
  const { data: results = [], isLoading } = trpc.products.search.useQuery(
    { query },
    { enabled: query.length > 0 }
  );

  return { results, isLoading };
}

export function useProductsByCategory(categoryId: number, limit = 50, offset = 0) {
  const { data: products = [], isLoading } = trpc.products.getByCategory.useQuery({
    categoryId,
    limit,
    offset,
  });

  return { products, isLoading };
}

export function useCategories() {
  const { data: categories = [], isLoading } = trpc.categories.list.useQuery();

  return { categories, isLoading };
}
