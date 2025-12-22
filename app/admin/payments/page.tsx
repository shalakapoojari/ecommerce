"use client"

import { orders } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function PaymentsPage() {
  const completedPayments = orders.filter((o) => o.paymentStatus === "completed")
  const pendingPayments = orders.filter((o) => o.paymentStatus === "pending")
  const failedPayments = orders.filter((o) => o.paymentStatus === "failed")
  const refundedPayments = orders.filter((o) => o.paymentStatus === "refunded")

  const totalRevenue = completedPayments.reduce((sum, o) => sum + o.total, 0)
  const pendingAmount = pendingPayments.reduce((sum, o) => sum + o.total, 0)
  const failedAmount = failedPayments.reduce((sum, o) => sum + o.total, 0)

  const paymentsByMethod = orders.reduce(
    (acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Tracking</h1>
        <p className="text-neutral-600 mt-1">Monitor all payment transactions and statuses</p>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-neutral-600 mt-1">{completedPayments.length} completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Pending</CardTitle>
            <Clock className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-neutral-600 mt-1">{pendingPayments.length} pending payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Failed</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${failedAmount.toLocaleString()}</div>
            <p className="text-xs text-red-600 mt-1">{failedPayments.length} failed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Refunded</CardTitle>
            <CreditCard className="w-4 h-4 text-neutral-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundedPayments.length}</div>
            <p className="text-xs text-neutral-600 mt-1">Total refunds issued</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(paymentsByMethod).map(([method, amount]) => (
              <div
                key={method}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-neutral-400" />
                  <span className="font-medium">{method}</span>
                </div>
                <span className="font-bold">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Payments */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <p className="font-medium">{order.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-neutral-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">{order.date}</td>
                    <td className="py-4 px-4 text-sm">{order.paymentMethod}</td>
                    <td className="py-4 px-4 font-bold">${order.total}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          order.paymentStatus === "completed"
                            ? "default"
                            : order.paymentStatus === "pending"
                              ? "outline"
                              : order.paymentStatus === "failed"
                                ? "destructive"
                                : "secondary"
                        }
                      >
                        {order.paymentStatus === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {order.paymentStatus === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {order.paymentStatus === "failed" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium hover:underline">
                        View Details
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
