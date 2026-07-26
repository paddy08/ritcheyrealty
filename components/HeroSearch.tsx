"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Hero search — one field, one action.
 *
 * The area filter that used to live here is gone: the range line below the
 * hero puts all eight towns one click away, which beats a dropdown of eight
 * items. What's left is the only thing a dropdown can't do — free text.
 *
 * Styled as a ruled line rather than a frosted pill so it sits on the footage
 * as type does, not as a floating panel.
 */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  return (
    <form onSubmit={submit} className="w-full max-w-xl">
      <div className="group flex items-center gap-4 border-b border-limestone/40 pb-3 transition-colors duration-300 focus-within:border-brass-pale">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 shrink-0 text-limestone/50 transition-colors duration-300 group-focus-within:text-brass-pale"
        >
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="m16 16 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Address, city, or ZIP"
          aria-label="Search by address, city, or ZIP"
          className="w-full bg-transparent py-1 font-mono text-sm text-limestone-pale placeholder:text-limestone/45 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 font-mono text-[12px] uppercase tracking-widest text-brass-pale transition-colors duration-200 hover:text-limestone-pale"
        >
          Search
        </button>
      </div>
    </form>
  );
}
