"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import type { Product } from "@/lib/data"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const rootRef = useRef<HTMLAnchorElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, { y: 18, opacity: 0, duration: 0.8, ease: "power3.out" })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const handleHover = () => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, { scale: 1.04, duration: 0.5, ease: "power2.out" })
    gsap.to(rootRef.current, { boxShadow: "0 10px 30px rgba(0,0,0,0.08)", duration: 0.35 })
  }

  const handleLeave = () => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, { scale: 1, duration: 0.35, ease: "power2.out" })
    gsap.to(rootRef.current, { boxShadow: "0 0px 0px rgba(0,0,0,0)", duration: 0.35 })
  }

  const contextClasses = `${product.featured ? "featured-card" : ""} ${product.newArrival ? "arrival-card" : ""}`

  return (
    <Link
      href={`/product/${product.id}`}
      ref={rootRef}
      className={`group block rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${contextClasses}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-md">
        <Image
          src={product.images[currentImage] || "/placeholder.svg"}
          alt={product.name}
          fill
          ref={imgRef as any}
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
