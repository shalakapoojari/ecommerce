import { orders } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CustomersPage() {
  // Extract unique customers from orders
  const customers = orders.reduce((acc, order) => {
    if (!acc.find((c) => c.id === order.customerId)) {
      acc.push({
        id: order.customerId,
        name: order.customerName,
        email: order.customerEmail,
        orders: orders.filter((o) => o.customerId === order.customerId).length,
        totalSpent: orders.filter((o) => o.customerId === order.customerId).reduce((sum, o) => sum + o.total, 0),
        lastOrder: order.date,
      })
    }
    return acc
  }, [] as any[])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-neutral-600 mt-1">View and manage customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Customer ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Total Spent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-neutral-600">{customer.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">{customer.id}</td>
                    <td className="py-4 px-4 font-medium">{customer.orders}</td>
                    <td className="py-4 px-4 font-medium">${customer.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {new Date(customer.lastOrder).toLocaleDateString()}
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
