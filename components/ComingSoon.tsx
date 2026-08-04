import Link from "next/link";

type ComingSoonProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  secondaryCta?: { label: string; href: string } | null;
  /**
   * Promote the CTA to the solid button and demote "Back home" to the outline.
   * Off by default: on a page with nothing behind it yet, leaving is the honest
   * lead. Turn it on where the CTA goes somewhere genuinely written, so the page
   * points at the thing that exists rather than at the way out.
   */
  ctaLeads?: boolean;
};

/**
 * Placeholder for a route that's linked from the nav/CTAs but not built yet.
 * Renders real content (not a redirect or empty shell) so the page is a
 * legitimate, indexable-if-needed landing spot rather than a dead link.
 */
export function ComingSoon({
  title,
  description,
  children,
  secondaryCta = { label: "Get in touch", href: "/contact" },
  ctaLeads = false,
}: ComingSoonProps) {
  // The solid button leads, so the order follows the emphasis rather than
  // being fixed — a demoted "Back home" sitting in front of the primary would
  // read as the first thing to do.
  const lead = ctaLeads && secondaryCta;
  return (
    <section className="container-edge flex min-h-dvh flex-col justify-center pb-24 pt-40 md:pb-32">
      <p className="label">Coming soon</p>
      <h1 className="display mt-4 max-w-2xl text-4xl text-ink sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
        {description}
      </p>
      {children}
      <div className="mt-10 flex flex-wrap gap-4">
        {lead && (
          <Link href={secondaryCta.href} className="btn-solid">
            {secondaryCta.label}
          </Link>
        )}
        <Link href="/" className={lead ? "btn-line" : "btn-solid"}>
          Back home
        </Link>
        {secondaryCta && !lead && (
          <Link href={secondaryCta.href} className="btn-line">
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
