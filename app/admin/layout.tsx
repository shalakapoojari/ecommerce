import type React from "react"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, CreditCard, FolderOpen } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col w-64 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="flex-1 p-6 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Orders
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Package className="w-5 h-5" />
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              Categories
            </Link>
            <Link
              href="/admin/payments"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Payments
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Users className="w-5 h-5" />
              Customers
            </Link>
          </nav>
          <div className="p-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500">Admin Panel v1.0</p>
          </div>
        </aside>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-2 py-3">
          <nav className="flex items-center justify-around">
            <Link href="/admin" className="flex flex-col items-center gap-1 text-xs">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/orders" className="flex flex-col items-center gap-1 text-xs">
              <ShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <Link href="/admin/products" className="flex flex-col items-center gap-1 text-xs">
              <Package className="w-5 h-5" />
              <span>Products</span>
            </Link>
            <Link href="/admin/categories" className="flex flex-col items-center gap-1 text-xs">
              <FolderOpen className="w-5 h-5" />
              <span>Categories</span>
            </Link>
            <Link href="/admin/payments" className="flex flex-col items-center gap-1 text-xs">
              <CreditCard className="w-5 h-5" />
              <span>Payments</span>
            </Link>
            <Link href="/admin/customers" className="flex flex-col items-center gap-1 text-xs">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </Link>
          </nav>
        </div>

        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>
    </div>
  )
}
