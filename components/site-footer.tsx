import Link from "next/link"
import { Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/shipping" className="hover:text-foreground transition-colors">
              Shipping & Returns
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ATELIER. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
