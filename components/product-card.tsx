"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/data"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.images[currentImage] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300"
          onMouseEnter={() => {
            if (product.images.length > 1) setCurrentImage(1)
          }}
          onMouseLeave={() => setCurrentImage(0)}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-balance group-hover:text-muted-foreground transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">${product.price}</p>
      </div>
    </Link>
  )
}
