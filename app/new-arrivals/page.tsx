import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

export default function NewArrivalsPage() {
  const newArrivals = products.filter((p) => p.newArrival)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-4">New Arrivals</h1>
            <p className="text-lg text-muted-foreground">Discover our latest pieces</p>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No new arrivals at the moment</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
