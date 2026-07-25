"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the home hero the bar is transparent with light text; once scrolled
  // it becomes a frosted cream bar with charcoal text. Non-home routes and
  // the open mobile panel force the solid state so text stays legible on
  // pages without a dark hero.
  const solid = scrolled || open || pathname !== "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top state: soft scrim that fades into the hero — no hard bottom edge.
          Extends past the bar so the darkening dissolves gradually. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[170%] bg-gradient-to-b from-charcoal/70 via-charcoal/25 to-transparent transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Scrolled state: frosted cream bar */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-cream/85 shadow-[0_1px_0_0_rgba(43,42,38,0.08),0_12px_32px_-24px_rgba(43,42,38,0.35)] backdrop-blur-xl transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="container-edge relative">
        <div
          className={`flex items-center justify-between transition-[padding] duration-300 ${
            solid ? "py-3" : "py-5"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
            aria-label="Ritchey Realty — home"
          >
            <Image
              src="/logo.webp"
              alt="Ritchey Realty"
              width={440}
              height={404}
              priority
              className={`w-auto transition-all duration-300 ${
                solid
                  ? "h-12"
                  : "h-[4.25rem] drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]"
              }`}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link text-sm tracking-wide ${
                    solid
                      ? "text-charcoal-soft hover:text-charcoal"
                      : "text-cream/85 hover:text-cream"
                  } ${active ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={`btn ml-1 px-6 py-2.5 ${
                solid
                  ? "bg-charcoal text-cream hover:bg-charcoal-soft"
                  : "bg-cream text-charcoal hover:bg-cream/90"
              }`}
            >
              Get in touch
            </Link>
          </nav>

          {/* Mobile / tablet toggle */}
          <button
            type="button"
            className={`-mr-2 inline-flex items-center justify-center p-2 transition-colors duration-300 lg:hidden ${
              solid ? "text-charcoal" : "text-cream"
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-200 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-px w-6 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-px w-6 bg-current transition-transform duration-200 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav — slides open beneath the bar, same frosted surface */}
      <nav
        id="mobile-nav"
        className={`relative grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="container-edge flex flex-col gap-1 border-t border-charcoal/10 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-charcoal-soft transition-colors hover:bg-charcoal/5 hover:text-charcoal"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="px-1 pb-2 pt-3">
              <Link
                href="/contact"
                className="btn w-full bg-charcoal text-cream hover:bg-charcoal-soft"
                onClick={() => setOpen(false)}
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
