"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"

export default function BestsellersPage() {
  const bestsellers = products.filter((p) => p.bestseller)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-12 text-center">
            <h1 className="font-serif text-4xl font-light tracking-tight mb-4">Bestsellers</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most popular pieces, loved by customers worldwide
            </p>
          </div>

          {bestsellers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No bestsellers available at the moment</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
