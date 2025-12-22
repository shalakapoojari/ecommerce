import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { orders } from "@/lib/data"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function OrdersPage() {
  // Filter orders for current user (in a real app, this would be based on authentication)
  const userOrders = orders.slice(0, 2) // Mock: showing first 2 orders

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-foreground"
      case "shipped":
        return "text-foreground"
      case "processing":
        return "text-muted-foreground"
      case "pending":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-8">
            <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Account
            </Link>
          </div>

          <h1 className="font-serif text-4xl font-light tracking-tight mb-8">Order History</h1>

          {userOrders.length > 0 ? (
            <div className="space-y-6 max-w-4xl">
              {userOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block border border-border rounded p-6 hover:border-foreground transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-medium mb-1">Order {order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</p>
                      <ChevronRight className="h-5 w-5 mt-2 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-border pt-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.productName} (Size {item.size}) × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 border border-border rounded hover:border-foreground transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
