"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const shipping = 15
  const grandTotal = total + shipping

  const [step, setStep] = useState<"shipping" | "review">("shipping")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("review")
  }

  const handlePlaceOrder = () => {
    // In a real app, this would process the payment
    clearCart()
    router.push("/checkout/confirmation")
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container py-12">
          <h1 className="font-serif text-4xl font-light tracking-tight mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {step === "shipping" ? (
                <div className="bg-background rounded border border-border p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-light mb-6">Shipping Information</h2>
                  <form onSubmit={handleContinue} className="space-y-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continue to Review
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Shipping Info Review */}
                  <div className="bg-background rounded border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-serif text-2xl font-light">Shipping Information</h2>
                      <Button variant="ghost" size="sm" onClick={() => setStep("shipping")}>
                        Edit
                      </Button>
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.email}</p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                      <p>{formData.country}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-background rounded border border-border p-6">
                    <h2 className="font-serif text-2xl font-light mb-6">Order Items</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4">
                          <div className="relative w-16 h-20 shrink-0 bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 text-sm">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">Size: {item.size}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handlePlaceOrder} size="lg" className="w-full">
                    Place Order
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-background rounded border border-border p-6 space-y-6">
                <h2 className="font-serif text-2xl font-light">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
