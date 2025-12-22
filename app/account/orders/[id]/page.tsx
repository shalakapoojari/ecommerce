import { use } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { orders } from "@/lib/data"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const order = orders.find((o) => o.id === id)

  if (!order) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-foreground text-background"
      case "shipped":
        return "bg-foreground text-background"
      case "processing":
        return "bg-muted text-foreground"
      case "pending":
        return "bg-muted text-foreground"
      default:
        return "bg-muted text-foreground"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8">
            <Link
              href="/account/orders"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Orders
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="font-serif text-4xl font-light tracking-tight mb-2">Order {order.id}</h1>
                <p className="text-muted-foreground">
                  Placed on{" "}
                  {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div className="border border-border rounded p-6 mb-6">
              <h2 className="font-serif text-2xl font-light mb-6">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Size {item.size} • Quantity {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-border rounded p-6">
              <h2 className="font-serif text-2xl font-light mb-4">Shipping Address</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.customerName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
