"use client"

import { orders } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all")

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") return order.status === "pending" || order.status === "processing"
    if (activeTab === "completed") return order.status === "shipped" || order.status === "delivered"
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-neutral-600 mt-1">Manage and track all orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all" ? "border-black text-black" : "border-transparent text-neutral-600 hover:text-black"
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "pending" ? "border-black text-black" : "border-transparent text-neutral-600 hover:text-black"
          }`}
        >
          Pending ({orders.filter((o) => o.status === "pending" || o.status === "processing").length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "completed"
              ? "border-black text-black"
              : "border-transparent text-neutral-600 hover:text-black"
          }`}
        >
          Completed ({orders.filter((o) => o.status === "shipped" || o.status === "delivered").length})
        </button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 font-medium">{order.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-neutral-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-sm">{order.items.length} items</td>
                    <td className="py-4 px-4 font-medium">${order.total}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status === "shipped"
                              ? "bg-blue-50 text-blue-700"
                              : order.status === "processing"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
