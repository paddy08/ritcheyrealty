import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { officeAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <ComingSoon
      title="Contact"
      description="A proper contact form is on its way. In the meantime, reach Kallie directly:"
      secondaryCta={null}
    >
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="label">Call or text</dt>
          <dd>
            <a
              href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
              className="display mt-1 inline-block text-2xl text-ink transition-colors hover:text-brass-deep sm:text-3xl"
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
              className="mt-1 inline-block text-lg text-ink-soft transition-colors hover:text-brass-deep"
            >
              {site.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="label">Office</dt>
          <dd>
            {/* Opens the address in whatever map app the visitor uses, rather
                than committing the site to one provider's embed. */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${site.name}, ${officeAddress}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block not-italic leading-relaxed text-ink-soft transition-colors hover:text-brass-deep"
            >
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </a>
          </dd>
        </div>
      </dl>
    </ComingSoon>
  );
}
