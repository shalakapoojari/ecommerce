"use client"

import { useState } from "react"
import { use } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [showDescription, setShowDescription] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  if (!product) {
    notFound()
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
    })

    router.push("/cart")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden bg-muted border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="sticky top-24 h-fit">
              <h1 className="font-serif text-3xl md:text-4xl font-light tracking-tight mb-2 text-balance">
                {product.name}
              </h1>
              <p className="text-2xl mb-6">${product.price}</p>

              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Size Selector */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-medium">Select Size</label>
                  {!product.inStock && <span className="text-sm text-destructive">Out of Stock</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-full" size="lg">
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              {/* Collapsible Sections */}
              <div className="mt-8 border-t border-border">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span className="font-medium">Description</span>
                  {showDescription ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {showDescription && (
                  <div className="pb-4 text-sm text-muted-foreground leading-relaxed">{product.description}</div>
                )}
              </div>

              {(product.fabric || product.care) && (
                <div className="border-t border-border">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-between w-full py-4 text-left"
                  >
                    <span className="font-medium">Fabric & Care</span>
                    {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  {showDetails && (
                    <div className="pb-4 space-y-2 text-sm text-muted-foreground">
                      {product.fabric && <p>Fabric: {product.fabric}</p>}
                      {product.care && <p>Care: {product.care}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <h2 className="font-serif text-3xl font-light tracking-tight mb-8 text-balance">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
