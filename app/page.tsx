"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Preloader } from "@/components/preloader"

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const horizontalRef = useRef<HTMLDivElement | null>(null)

  /* ================= HERO ANIMATIONS ================= */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(".hero-line", {
        y: 160,
        opacity: 0,
        stagger: 0.2,
        duration: 1.6,
        ease: "power4.out",
      }).from(
        ".hero-cta",
        {
          opacity: 0,
          y: 20,
          duration: 1,
        },
        "-=0.8"
      )

      gsap.to(".hero-bg", {
        yPercent: 30,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  /* ================= HORIZONTAL SCROLL ================= */
  useEffect(() => {
    if (!horizontalRef.current) return

    const panels = gsap.utils.toArray(".panel")

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalRef.current,
        pin: true,
        scrub: 1,
        end: () =>
          "+=" + (horizontalRef.current?.offsetWidth || 0),
      },
    })
  }, [])

  /* ================= MANIFESTO TEXT ================= */
  useEffect(() => {
    gsap.from(".manifesto span", {
      opacity: 0.15,
      stagger: 0.08,
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top 75%",
        end: "bottom 50%",
        scrub: true,
      },
    })
  }, [])

  return (
    <>
      {/* ================= PRELOADER ================= */}
      <Preloader />

      <div
        ref={rootRef}
        className="bg-[#030303] text-[#e8e8e3] overflow-x-hidden"
      >
        <SiteHeader />

        {/* ================= HERO ================= */}
        <section className="hero relative h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop"
            alt="Hero"
            fill
            priority
            className="hero-bg object-cover opacity-60 scale-110"
          />

          <div className="relative z-10 text-center mix-blend-difference">
            <p className="uppercase tracking-[0.5em] text-xs mb-6">
              Fall Winter 2025
            </p>

            <h1 className="hero-line text-[14vw] leading-[0.8] font-serif">
              ETHEREAL
            </h1>
            <h1 className="hero-line text-[14vw] leading-[0.8] font-serif italic text-gray-400">
              SHADOWS
            </h1>

            <div className="hero-cta mt-14">
              <Link
                href="/shop"
                className="inline-block px-10 py-4 border border-white/50 rounded-full uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
              >
                View The Lookbook
              </Link>
            </div>
          </div>
        </section>

        {/* ================= MANIFESTO ================= */}
        <section className="min-h-screen flex items-center justify-center px-6 md:px-32">
          <p className="manifesto text-3xl md:text-5xl font-serif text-center leading-relaxed text-gray-300">
            {"We believe in the quiet power of silence. In a world of noise, Noir is the absence of it. We strip away the unnecessary to reveal the essential structure of the human form. This is not just clothing; this is architecture for the soul."
              .split(" ")
              .map((word, i) => (
                <span key={i} className="inline-block mr-2">
                  {word}
                </span>
              ))}
          </p>
        </section>

        {/* ================= HORIZONTAL RUNWAY ================= */}
        <section ref={horizontalRef} className="overflow-hidden">
          <div className="flex w-[400vw] h-screen">
            {/* Panel 1 */}
            <div className="panel w-screen h-full flex items-center px-24 relative">
              <span className="absolute text-9xl opacity-10 top-10 left-10 font-serif">
                01
              </span>
              <div>
                <h2 className="text-6xl font-serif mb-6">The Runway</h2>
                <p className="uppercase text-xs tracking-widest text-gray-400 max-w-sm mb-8">
                  Featuring raw hems, structured shoulders, liquid silk drapes.
                </p>
                <span className="text-xs border-b">
                  Scroll to Explore →
                </span>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576"
                  alt=""
                  fill
                  className="object-cover opacity-50 grayscale"
                />
              </div>
            </div>

            {/* Panel 2 */}
            <div className="panel w-screen h-full flex items-center justify-center">
              <div className="relative w-[400px] h-[600px]">
                <Image
                  src="https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=2694"
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-serif italic">
                    Vantablack Coat
                  </h3>
                  <p className="uppercase text-xs mt-2">$2,400</p>
                </div>
              </div>
            </div>

            {/* Panel 3 */}
            <div className="panel w-screen h-full flex items-center justify-center">
              <div className="relative w-[400px] h-[600px]">
                <Image
                  src="https://images.unsplash.com/photo-1529139574466-a302c2d56aee?q=80&w=2576"
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-serif italic">
                    Marble Silk
                  </h3>
                  <p className="uppercase text-xs mt-2">$1,850</p>
                </div>
              </div>
            </div>

            {/* Panel 4 */}
            <div className="panel w-screen h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-8xl font-serif mb-8">FIN</h2>
                <Link
                  href="/shop"
                  className="inline-block px-14 py-5 border border-white/20 rounded-full uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all"
                >
                  Shop The Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}
