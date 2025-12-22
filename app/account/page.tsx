import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Package, User } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="font-serif text-4xl font-light tracking-tight mb-8">My Account</h1>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <Link
              href="/account/orders"
              className="group border border-border rounded p-8 hover:border-foreground transition-colors"
            >
              <Package className="h-8 w-8 mb-4" />
              <h2 className="font-serif text-2xl font-light mb-2">Orders</h2>
              <p className="text-muted-foreground text-sm">View your order history and track shipments</p>
              <span className="inline-block mt-4 text-sm underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                View Orders
              </span>
            </Link>

            <Link
              href="/account/profile"
              className="group border border-border rounded p-8 hover:border-foreground transition-colors"
            >
              <User className="h-8 w-8 mb-4" />
              <h2 className="font-serif text-2xl font-light mb-2">Profile</h2>
              <p className="text-muted-foreground text-sm">Manage your account details and preferences</p>
              <span className="inline-block mt-4 text-sm underline underline-offset-4 group-hover:translate-x-1 transition-transform">
                Edit Profile
              </span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
