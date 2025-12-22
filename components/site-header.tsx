"use client"

import Link from "next/link"
import { ShoppingBag, Search, Menu, User, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { products } from "@/lib/data"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const { items } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const searchResults = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push("/")
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-serif font-light tracking-wide">
            ATELIER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Shop
            </Link>
            <Link href="/collections" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Collections
            </Link>
            <Link href="/new-arrivals" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              New Arrivals
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium hover:text-muted-foreground transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <span className="text-xl font-serif font-light tracking-wide">ATELIER</span>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="h-8 w-8">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="flex flex-col p-6 space-y-1 flex-1">
                    <Link
                      href="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                    >
                      Shop
                    </Link>
                    <Link
                      href="/collections"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                    >
                      Collections
                    </Link>
                    <Link
                      href="/new-arrivals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                    >
                      New Arrivals
                    </Link>
                    <div className="h-px bg-border my-4" />
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                          >
                            Admin
                          </Link>
                        )}
                        <Link
                          href="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                        >
                          Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors text-left"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                      >
                        Sign In
                      </Link>
                    )}
                    <Link
                      href="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium py-3 hover:text-muted-foreground transition-colors"
                    >
                      Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                  </nav>

                  <div className="p-6 border-t border-border space-y-4">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-foreground">
                        About
                      </Link>
                      <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-foreground">
                        Contact
                      </Link>
                      <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="hover:text-foreground">
                        Help
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
              autoFocus
            />

            {searchQuery && (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <p className="font-medium">${product.price}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No products found</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
