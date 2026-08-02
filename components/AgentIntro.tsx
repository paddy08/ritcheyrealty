import Image from "next/image";
import Link from "next/link";
import { AgentRoster } from "@/components/AgentRoster";
import { IntroVideo } from "@/components/IntroVideo";
import { Reveal } from "@/components/Reveal";
import { agent, team } from "@/lib/site";
import type { TeamMember } from "@/lib/site";

/**
 * The stand-in portrait.
 *
 * A drawn figure, not a face: flat, frontal and featureless, so it reads at a
 * glance as a blank waiting to be filled rather than as a photograph of the
 * person named beneath it. It sits in the page's own palette — brass on
 * limestone, the plate's edge unchanged — so a roster of five of them still
 * scans as one set instead of five broken images.
 *
 * Marked decorative: the accessible content is the name and role set below the
 * plate, and the notice under the roster says these are placeholders in words.
 */
function PlaceholderPortrait() {
  return (
    <div className="plate aspect-[4/5] w-full">
      <svg
        viewBox="0 0 80 100"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-brass-deep/30"
      >
        <circle cx="40" cy="41" r="14" fill="currentColor" />
        <path d="M11 100v-9a29 29 0 0 1 58 0v9Z" fill="currentColor" />
      </svg>
    </div>
  );
}

function Portrait({
  member,
  sizes,
}: {
  member: Pick<TeamMember, "name" | "role" | "photo">;
  sizes: string;
}) {
  if (member.photo) {
    return (
      <div className="plate aspect-[4/5] w-full">
        <Image
          src={member.photo}
          // Named only if a name was supplied — an anonymous slot describes
          // the role rather than printing "undefined" into the alt text.
          alt={`${member.name ? `${member.name}, ` : ""}${
            member.role
          } at Ritchey Realty`}
          fill
          loading="lazy"
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }
  // No photograph supplied. See the note on `team` in lib/site.ts.
  return <PlaceholderPortrait />;
}

export function AgentIntro() {
  return (
    <section className="container-edge py-20 md:py-28">
      <Reveal className="max-w-xl">
        <p className="label">The team</p>
        <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
          Six agents, one office, eight towns
        </h2>
      </Reveal>

      {/* The video is the dark moment in this section — no background fill is
          doing that job. Kallie's portrait then breaks its bottom edge so the
          two read as one composition rather than two stacked blocks.

          The two reveal in sequence: the plate uncovers from its bottom edge,
          then her portrait rises into the corner it overlaps. You watch the
          composition assemble instead of finding it already built. */}
      <Reveal className="mt-12" variant="plate" repeat>
        <IntroVideo />
      </Reveal>

      <div className="relative z-10 -mt-12 grid gap-8 md:-mt-24 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-12">
        <Reveal className="w-40 sm:w-48 md:ml-8 md:w-auto" delay={260} repeat>
          <Portrait
            member={{ name: agent.name, role: agent.role, photo: agent.photo }}
            sizes="(max-width: 640px) 10rem, (max-width: 768px) 12rem, 20rem"
          />
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-muted">
            Licensing: {agent.license}
          </p>
        </Reveal>

        <Reveal delay={80} className="md:pt-28">
          <p className="label">{agent.role}</p>
          <p className="display mt-3 text-4xl text-ink">{agent.name}</p>
          <p className="display-sm mt-5 text-xl leading-[1.45] text-ink-soft">
            {agent.statement}
          </p>

          <div className="mt-7 max-w-2xl space-y-5 leading-relaxed text-ink-soft">
            {agent.bio.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          {/* Figures published on ritcheyrealty.com, so they can be checked. */}
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-7 border-t border-ink/15 pt-6 sm:grid-cols-4">
            {agent.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ink-muted">
                  {fact.label}
                </dt>
                <dd className="display-sm mt-2 text-2xl text-brass-deep">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link href="/about" className="btn-line mt-9">
            More about Kallie
          </Link>
        </Reveal>
      </div>

      {/* The rest of the team, hung from a datum. */}
      <div className="mt-20">
        <p className="label mb-6">The agents</p>
        <AgentRoster>
          {team.map((member) => (
            <div key={member.slot}>
              <Portrait
                member={member}
                sizes="(max-width: 640px) 9.5rem, (max-width: 1024px) 33vw, 20vw"
              />
              {/* The slot number takes the name's exact setting, only muted:
                  when a real name lands here nothing about the card moves, and
                  until then the greyed line reads as a blank rather than as
                  somebody called "Team member 01". */}
              <p
                className={`display-sm mt-4 text-lg leading-tight ${
                  member.name ? "text-ink" : "text-ink-muted"
                }`}
              >
                {member.name ?? member.slot}
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-brass-deep">
                {member.role}
              </p>
              {/* Licence only, and only if one is supplied. Bios are out: a row
                  where half the cards carry a paragraph reads as missing data
                  rather than as design. */}
              {member.license && (
                <p className="mt-2 font-mono text-[11px] text-ink-muted">
                  TREC #{member.license}
                </p>
              )}
            </div>
          ))}
        </AgentRoster>
        {/* Set as one caption, not a warning banner: the greyed slots and blank
            plates already read as placeholders, so this only has to say so in
            words and be precise about how little is being claimed. */}
        <p className="mt-10 max-w-xl font-mono text-[11px] leading-relaxed text-ink-muted">
          Placeholder roster. The photographs, names and licence numbers of the
          real team have been removed — nothing on these cards identifies
          anyone. Only the size of the team and each role is real.
        </p>
      </div>
    </section>
  );
}
