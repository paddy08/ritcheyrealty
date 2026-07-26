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

  // Over the home hero the bar is transparent with light type; once scrolled it
  // becomes a solid limestone bar with ink type. Matte in both states — no
  // frosted glass anywhere on this site. Non-home routes and the open mobile
  // panel force the solid state so type stays legible without a dark hero.
  const solid = scrolled || open || pathname !== "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Over the hero: a soft ink scrim that dissolves into the footage. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[180%] bg-gradient-to-b from-ink/75 via-ink/25 to-transparent transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Scrolled: solid limestone with a hairline datum along the bottom. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border-b border-ink/10 bg-limestone-pale transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="container-edge relative">
        <div
          className={`flex items-center justify-between transition-[padding] duration-300 ${
            solid ? "py-3" : "py-5"
          }`}
        >
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
                  ? "h-11"
                  : "h-[4rem] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
              }`}
            />
          </Link>

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
                  className={`nav-link text-[13px] ${
                    solid
                      ? "text-ink-soft hover:text-ink"
                      : "text-limestone/80 hover:text-limestone-pale"
                  } ${active ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={`btn ml-1 px-5 py-2.5 ${
                solid
                  ? "bg-ink text-limestone-pale hover:bg-ink-soft"
                  : "bg-brass-pale text-ink hover:bg-limestone-pale"
              }`}
            >
              Join us
            </Link>
          </nav>

          <button
            type="button"
            className={`-mr-2 inline-flex items-center justify-center p-2 transition-colors duration-300 lg:hidden ${
              solid ? "text-ink" : "text-limestone-pale"
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

      {/* Mobile nav — opens beneath the bar on the same limestone surface. */}
      <nav
        id="mobile-nav"
        className={`relative grid bg-limestone-pale transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="container-edge flex flex-col border-t border-ink/10 py-3">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-ink/[0.07]">
                <Link
                  href={item.href}
                  className="block py-3 text-ink-soft transition-colors hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pb-2 pt-5">
              <Link
                href="/contact"
                className="btn-solid w-full"
                onClick={() => setOpen(false)}
              >
                Join us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
