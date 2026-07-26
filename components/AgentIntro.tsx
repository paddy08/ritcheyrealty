import Image from "next/image";
import Link from "next/link";
import { AgentRoster } from "@/components/AgentRoster";
import { IntroVideo } from "@/components/IntroVideo";
import { Reveal } from "@/components/Reveal";
import { agent, team } from "@/lib/site";
import type { TeamMember } from "@/lib/site";

/** Initials in the display face — the same monogram logic as the mark. */
function monogram(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
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
          alt={`${member.name}, ${member.role} at Ritchey Realty`}
          fill
          loading="lazy"
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }
  // No published photograph. A stock face under a real person's name would
  // misrepresent them, so the plate carries their initials instead.
  return (
    <div className="plate flex aspect-[4/5] w-full items-center justify-center bg-limestone-deep">
      <span aria-hidden="true" className="display text-5xl text-brass-deep/70">
        {monogram(member.name)}
      </span>
    </div>
  );
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
            <div key={member.name}>
              <Portrait
                member={member}
                sizes="(max-width: 640px) 9.5rem, (max-width: 1024px) 33vw, 20vw"
              />
              <p className="display-sm mt-4 text-lg leading-tight text-ink">
                {member.name}
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-brass-deep">
                {member.role}
              </p>
              {/* Licence only. Bios are out: three of the six published one
                  and three didn't, and a row where half the cards carry a
                  paragraph reads as missing data rather than as design. */}
              {member.license && (
                <p className="mt-2 font-mono text-[11px] text-ink-muted">
                  TREC #{member.license}
                </p>
              )}
            </div>
          ))}
        </AgentRoster>
        <p className="mt-10 font-mono text-[11px] text-ink-muted">
          Team names, roles and licence numbers from ritcheyrealty.com.
        </p>
      </div>
    </section>
  );
}
