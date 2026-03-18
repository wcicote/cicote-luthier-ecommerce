import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-4">
        <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
      </div>

      <section className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image Skeleton */}
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-96 md:h-[500px] bg-secondary rounded-lg" />
              <div className="flex gap-2">
                <div className="w-20 h-20 bg-secondary rounded-lg" />
                <div className="w-20 h-20 bg-secondary rounded-lg" />
                <div className="w-20 h-20 bg-secondary rounded-lg" />
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="flex flex-col space-y-6 animate-pulse">
              <div>
                <div className="h-4 w-24 bg-secondary rounded mb-2" />
                <div className="h-10 w-3/4 bg-secondary rounded mb-4" />
                
                <div className="flex gap-2 mb-6">
                  <div className="h-4 w-32 bg-secondary rounded" />
                </div>

                <div className="mb-6">
                  <div className="h-8 w-32 bg-secondary rounded mb-2" />
                  <div className="h-4 w-48 bg-secondary rounded" />
                </div>

                <div className="space-y-2 mb-8">
                  <div className="h-4 w-full bg-secondary rounded" />
                  <div className="h-4 w-full bg-secondary rounded" />
                  <div className="h-4 w-5/6 bg-secondary rounded" />
                </div>

                <div className="mb-8 space-y-3">
                  <div className="h-5 w-40 bg-secondary rounded mb-4" />
                  <div className="h-4 w-2/3 bg-secondary rounded" />
                  <div className="h-4 w-3/4 bg-secondary rounded" />
                  <div className="h-4 w-1/2 bg-secondary rounded" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-14 w-full bg-secondary rounded-lg" />
                <div className="h-12 w-full bg-secondary rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
