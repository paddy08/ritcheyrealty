import type { Metadata } from "next";
import Link from "next/link";
import { MessageForm } from "@/components/MessageForm";
import { Reveal } from "@/components/Reveal";
import { officeAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, text or email Ritchey Realty, or send a message from the page. The office is on Hillwood Parkway in Fort Worth.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    // pt-32: this page has no hero, so the fixed header sits on the same
    // limestone as the type and nothing else holds it off the headline.
    <section className="container-edge pb-20 pt-32 md:pb-28 md:pt-36">
      <Reveal className="max-w-2xl">
        <p className="label">Contact</p>
        <h1 className="display mt-4 text-4xl text-ink sm:text-5xl md:text-6xl">
          Tell us what you&apos;re looking for
        </h1>
        <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
          One conversation with a named agent — no call centre, no drip
          campaign. Use whichever of these suits you; the form goes to the same
          place as the phone.
        </p>
      </Reveal>

      {/* The details first on a phone, where a tap-to-call is usually what
          someone came for, and beside the form from md up. */}
      <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16 lg:gap-20">
        <Reveal>
          <dl className="space-y-8">
            <div>
              <dt className="label">Call or text</dt>
              <dd>
                <a
                  href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                  className="display mt-2 inline-block text-3xl text-ink transition-colors hover:text-brass-deep sm:text-4xl"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">Email</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-2 inline-block break-words text-lg text-ink-soft transition-colors hover:text-brass-deep"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">Office</dt>
              <dd className="mt-2">
                {/* Opens the address in whatever map app the visitor uses,
                    rather than committing the site to one provider's embed. */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${site.name}, ${officeAddress}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="not-italic leading-relaxed text-ink-soft transition-colors hover:text-brass-deep"
                >
                  {site.address.street}
                  <br />
                  {site.address.locality}, {site.address.region}{" "}
                  {site.address.postalCode}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">Where we work</dt>
              <dd className="mt-2 leading-relaxed text-ink-soft">
                {site.serviceArea}.{" "}
                <Link
                  href="/communities/fort-worth"
                  className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
                >
                  Start with Fort Worth
                </Link>
                .
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* The only enquiry form on the site. The docked widget used to carry a
            copy of it in a modal; it now offers the phone number and nothing
            else, and every "Send a message" on the site arrives here instead.
            See components/MessageForm.tsx and components/MessageWidget.tsx. */}
        <Reveal delay={80}>
          <MessageForm />
        </Reveal>
      </div>
    </section>
  );
}
