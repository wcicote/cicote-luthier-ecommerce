import { Card } from '@/components/ui/card';

export function CartItemSkeleton() {
  return (
    <Card className="p-6 flex gap-6 shadow-sm animate-pulse">
      {/* Image */}
      <div className="w-24 h-24 bg-secondary rounded-lg flex-shrink-0" />
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="h-6 w-3/4 bg-secondary rounded mb-2" />
          <div className="h-4 w-1/4 bg-secondary rounded" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-secondary rounded-lg" />
          </div>
          <div className="h-6 w-20 bg-secondary rounded" />
        </div>
      </div>

      {/* Delete button */}
      <div className="p-2">
        <div className="w-5 h-5 bg-secondary rounded" />
      </div>
    </Card>
  );
}
