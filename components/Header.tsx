"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/85 backdrop-blur-sm">
      <div className="container-edge flex h-16 items-center justify-between md:h-20">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex flex-col leading-none"
          onClick={() => setOpen(false)}
        >
          <span className="font-serif text-xl tracking-tight text-charcoal md:text-2xl">
            Ritchey Realty
          </span>
          <span className="mt-0.5 hidden text-[10px] uppercase tracking-widest text-sage-deep sm:block">
            Fort Worth · DFW
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-charcoal-soft transition-colors hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary py-2">
            Get in touch
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 inline-flex items-center justify-center p-2 text-charcoal md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-6 bg-charcoal transition-transform duration-200 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-px w-6 bg-charcoal transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-px w-6 bg-charcoal transition-transform duration-200 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile nav panel */}
      <nav
        id="mobile-nav"
        className={`overflow-hidden border-t border-charcoal/10 bg-cream md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <ul className="container-edge flex flex-col py-3">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-charcoal-soft transition-colors hover:text-charcoal"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pb-2 pt-3">
            <Link
              href="/contact"
              className="btn-primary w-full"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
