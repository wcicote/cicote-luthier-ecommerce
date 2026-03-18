export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 sm:h-56 md:h-64 bg-secondary" />
      
      {/* Content */}
      <div className="p-4 sm:p-6 space-y-3">
        {/* Category tag */}
        <div className="h-3 w-16 bg-secondary rounded-full" />
        
        {/* Name */}
        <div className="space-y-2">
          <div className="h-5 bg-secondary rounded w-3/4" />
          <div className="h-5 bg-secondary rounded w-1/2" />
        </div>
        
        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3 bg-secondary rounded w-full" />
          <div className="h-3 bg-secondary rounded w-5/6" />
        </div>
        
        {/* Price + Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 w-24 bg-secondary rounded" />
          <div className="h-9 w-24 bg-secondary rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
