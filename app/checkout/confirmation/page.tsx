import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 max-w-md">
          <CheckCircle className="h-16 w-16 text-foreground mx-auto" />
          <h1 className="font-serif text-4xl font-light">Order Confirmed</h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for your purchase. You will receive a confirmation email shortly with your order details and
            tracking information.
          </p>
          <div className="pt-4 space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
