"use client"

import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-[#050505] pt-32 pb-12 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Huge Background Text */}
      <h1 className="text-[20vw] font-serif font-bold text-[#0a0a0a] absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none leading-none">
        NOIR
      </h1>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {/* Newsletter */}
        <div>
          <h4 className="text-3xl font-serif mb-8">Join the Cult.</h4>
          <div className="flex border-b border-white/20 pb-4 max-w-md">
            <input
              type="email"
              placeholder="ENTER EMAIL"
              className="bg-transparent w-full outline-none text-white placeholder-gray-600 uppercase tracking-widest text-sm"
            />
            <button className="text-xs uppercase hover:text-gray-400 transition-colors">
              Submit
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs uppercase tracking-widest text-gray-500">
          <ul className="space-y-3">
            <li className="text-white mb-4">Shop</li>
            <li><Link href="/shop">New Arrivals</Link></li>
            <li><Link href="/shop">Best Sellers</Link></li>
            <li><Link href="/archive">Archive</Link></li>
          </ul>

          <ul className="space-y-3">
            <li className="text-white mb-4">Studio</li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/stores">Stores</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>

          <ul className="space-y-3">
            <li className="text-white mb-4">Social</li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 flex justify-between text-[10px] uppercase tracking-widest text-gray-700">
        <span>&copy; 2025 NOIR Maison</span>
        <span>Privacy & Cookies</span>
      </div>
    </footer>
  )
}
