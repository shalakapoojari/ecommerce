import { use } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { collections, products } from "@/lib/data"
import { notFound } from "next/navigation"

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const collection = collections.find((c) => c.id === id)

  if (!collection) {
    notFound()
  }

  // Filter products by collection category
  const collectionProducts = products.filter((p) => {
    if (id === "essentials") return p.category === "Basics"
    if (id === "knitwear") return p.category === "Knitwear"
    if (id === "tailoring") return p.category === "Trousers" || p.category === "Shirts"
    return false
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-4 text-balance">
              {collection.name}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">{collection.description}</p>
          </div>

          {collectionProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products in this collection yet</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
