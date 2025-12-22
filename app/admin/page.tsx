"use client"

import { orders, products } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, CreditCard, Users, ArrowUp } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const totalProducts = products.length
  const lowStock = products.filter((p) => !p.inStock).length

  const completedPayments = orders.filter((o) => o.paymentStatus === "completed").length
  const pendingPayments = orders.filter((o) => o.paymentStatus === "pending").length
  const failedPayments = orders.filter((o) => o.paymentStatus === "failed").length

  // Calculate conversion and growth metrics
  const avgOrderValue = totalRevenue / totalOrders
  const uniqueCustomers = new Set(orders.map((o) => o.customerId)).size

  // Recent orders
  const recentOrders = orders.slice(0, 5)

  const productSales = orders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        acc[item.productId] = (acc[item.productId] || 0) + item.quantity
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const topProducts = Object.entries(productSales)
    .map(([id, quantity]) => ({
      product: products.find((p) => p.id === id),
      quantity,
    }))
    .filter((item) => item.product)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-neutral-600 mt-1">{pendingOrders} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Products</CardTitle>
            <Package className="w-4 h-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-neutral-600 mt-1">
              {products.filter((p) => p.inStock).length} in stock, {lowStock} low
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Avg Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +0.5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Completed Payments</CardTitle>
            <CreditCard className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
            <p className="text-xs text-neutral-600 mt-1">
              $
              {orders
                .filter((o) => o.paymentStatus === "completed")
                .reduce((sum, o) => sum + o.total, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Pending Payments</CardTitle>
            <CreditCard className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-neutral-600 mt-1">
              $
              {orders
                .filter((o) => o.paymentStatus === "pending")
                .reduce((sum, o) => sum + o.total, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Failed Payments</CardTitle>
            <CreditCard className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedPayments}</div>
            <p className="text-xs text-red-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +8 this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-neutral-600">{order.customerName}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">${order.total}</p>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "shipped"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                      <Badge
                        variant={
                          order.paymentStatus === "completed"
                            ? "default"
                            : order.paymentStatus === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Selling Products</CardTitle>
              <Link href="/admin/products" className="text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((item, index) => (
                <div
                  key={item.product?.id}
                  className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-neutral-600">{item.product?.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity} sold</p>
                    <p className="text-sm text-neutral-600">${item.product?.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
