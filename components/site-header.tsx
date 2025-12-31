"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export function SiteHeader() {
  const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-50 mix-blend-difference"
    >
      {/* Brand */}
      <Link
        href="/"
        className="text-2xl font-serif tracking-widest font-bold"
      >
        NOIR.
      </Link>

      {/* Links */}
      <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.25em] font-medium">
        <Link href="/collections" className="hover:text-gray-400 transition-colors">
          Collections
        </Link>
        <Link href="/campaign" className="hover:text-gray-400 transition-colors">
          Campaign
        </Link>
        <Link href="/maison" className="hover:text-gray-400 transition-colors">
          Maison
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <span className="hidden md:block text-xs uppercase tracking-widest">
          Cart (0)
        </span>

        {/* Menu Button */}
        <button className="w-10 h-10 border border-white/30 rounded-full flex flex-col justify-center items-center gap-1">
          <span className="w-4 h-[1px] bg-white"></span>
          <span className="w-4 h-[1px] bg-white"></span>
        </button>
      </div>
    </nav>
  )
}
