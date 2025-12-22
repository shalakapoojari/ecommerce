import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products, collections } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured)
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center bg-muted">
          <Image src="/minimal-fashion-editorial-hero-image-model-wearing.jpg" alt="Hero" fill className="object-cover" priority />
          <div className="relative z-10 text-center space-y-6 px-4">
            <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-balance text-foreground">
              Crafted for the Modern Era
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Discover timeless pieces designed with intention and made to last
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/shop">Shop Collection</Link>
            </Button>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="container py-20 md:py-32">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-balance">
              Curated Collections
            </h2>
            <p className="mt-4 text-muted-foreground text-balance">Explore our seasonal offerings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group relative aspect-[4/5] overflow-hidden bg-muted"
              >
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                  <h3 className="font-serif text-2xl font-light mb-2">{collection.name}</h3>
                  <p className="text-sm text-background/80">{collection.description}</p>
                  <span className="inline-block mt-4 text-sm underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                    View Collection
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="bg-secondary/30 py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-balance">Best Sellers</h2>
              <p className="mt-4 text-muted-foreground text-balance">Our most loved pieces</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">View All</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="container py-20 md:py-32">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-balance">New Arrivals</h2>
              <p className="mt-4 text-muted-foreground text-balance">Latest additions to our collection</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Brand Story */}
        <section className="bg-muted">
          <div className="container py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/5] overflow-hidden bg-background">
                <Image src="/artisan-hands-crafting-fabric-minimal-elegant.jpg" alt="Craftsmanship" fill className="object-cover" />
              </div>
              <div className="space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-balance">
                  A Commitment to Quality
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every piece in our collection is thoughtfully designed and crafted using premium materials sourced
                  from the finest mills around the world. We believe in creating garments that stand the test of time,
                  both in style and construction.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our dedication to sustainable practices and ethical production ensures that each item not only looks
                  beautiful but also respects the people and planet behind its creation.
                </p>
                <Button asChild variant="outline">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
