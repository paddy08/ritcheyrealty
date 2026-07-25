"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { communities } from "@/lib/site";

type Option = { value: string; label: string };

const areaOptions: Option[] = [
  { value: "", label: "All areas" },
  ...communities.map((c) => ({ value: c.name, label: c.name })),
];

// Filterable combobox (typeahead) so a long area list doesn't need scrolling
// and the menu matches the site palette — a native <select> popup is drawn by
// the OS and can't be styled to fit. Type to filter; the active option is
// tracked with aria-activedescendant per the ARIA combobox pattern.
function AreaSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? areaOptions.filter((o) => o.label.toLowerCase().includes(q))
    : areaOptions;

  // While open the input shows the live query; while closed it shows the
  // committed area name (empty falls back to the "All areas" placeholder).
  const inputValue = open ? query : value;

  const openList = () => {
    setQuery("");
    const idx = areaOptions.findIndex((o) => o.value === value);
    setActive(idx < 0 ? 0 : idx);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setQuery("");
  };
  const choose = (o: Option) => {
    onChange(o.value);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Keep the highlighted option in range and scrolled into view.
  useEffect(() => {
    if (active > filtered.length - 1) setActive(filtered.length > 0 ? filtered.length - 1 : 0);
  }, [filtered.length, active]);
  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`#area-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open) setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      // When open, pick the highlighted option; otherwise let the form submit.
      if (open && filtered[active]) {
        e.preventDefault();
        choose(filtered[active]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
    } else if (e.key === "Tab") {
      if (open) close();
    }
  };

  return (
    <div ref={wrapRef} className="relative w-full sm:w-44">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="area-listbox"
        aria-autocomplete="list"
        aria-label="Area"
        aria-activedescendant={
          open && filtered[active] ? `area-opt-${active}` : undefined
        }
        autoComplete="off"
        value={inputValue}
        placeholder={open ? "Search areas…" : "All areas"}
        onFocus={openList}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          if (!open) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full cursor-pointer bg-transparent pr-6 text-cream placeholder:text-cream/55 focus:outline-none"
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={open ? "Close area list" : "Open area list"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => (open ? close() : inputRef.current?.focus())}
        className="absolute inset-y-0 right-0 flex items-center text-cream/60"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id="area-listbox"
          ref={listRef}
          role="listbox"
          aria-label="Area"
          className="absolute left-0 right-0 top-[calc(100%+0.85rem)] z-50 max-h-72 overflow-auto rounded-2xl border border-charcoal/10 bg-cream p-1.5 shadow-[0_26px_60px_-18px_rgba(43,42,38,0.55)] sm:right-auto sm:w-56"
        >
          {filtered.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-charcoal-muted">
              No matching areas
            </li>
          ) : (
            filtered.map((o, i) => {
              const isSel = o.value === value;
              const isActive = i === active;
              return (
                <li
                  key={o.value || "all"}
                  id={`area-opt-${i}`}
                  role="option"
                  aria-selected={isSel}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(o)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-sage-pale/70 text-charcoal"
                      : "text-charcoal-soft"
                  }`}
                >
                  <span className={isSel ? "font-medium text-charcoal" : ""}>
                    {o.label}
                  </span>
                  {isSel && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 shrink-0 text-sage-deep"
                    >
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

// Frosted-glass search bar that floats over the hero video. Submits to the
// /search route with query params (consistent with the site's other links).
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (area) params.set("area", area);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  return (
    <form onSubmit={submit} className="mt-10 w-full max-w-2xl">
      <div className="glass-search flex flex-col gap-1 rounded-[1.6rem] p-2 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:py-2 sm:pl-6 sm:pr-2">
        {/* Location */}
        <div className="flex flex-1 items-center gap-3 px-4 py-2.5 sm:px-0">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 shrink-0 text-cream/70"
          >
            <path
              d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="City, neighborhood, or ZIP"
            aria-label="Search by city, neighborhood, or ZIP"
            className="w-full bg-transparent text-cream placeholder:text-cream/55 focus:outline-none"
          />
        </div>

        {/* Divider */}
        <div className="mx-2 hidden h-8 w-px bg-white/25 sm:block" />

        {/* Area — the communities Kallie serves */}
        <div className="flex items-center px-4 py-2.5 sm:px-2">
          <AreaSelect value={area} onChange={setArea} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn w-full bg-cream px-7 py-3 text-charcoal hover:bg-cream/90 sm:w-auto"
        >
          Search
        </button>
      </div>
    </form>
  );
}
