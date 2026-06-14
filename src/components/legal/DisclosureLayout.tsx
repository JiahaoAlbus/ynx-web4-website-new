import { ArrowUpRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type DisclosureSection = {
  title: string;
  icon: LucideIcon;
  summary?: string;
  bullets?: string[];
};

export function DisclosureLayout({
  eyebrow,
  title,
  summary,
  effectiveDate,
  status,
  boundaryTitle,
  boundaryText,
  sections,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  status: string;
  boundaryTitle: string;
  boundaryText: string;
  sections: DisclosureSection[];
}) {
  return (
    <div className="pb-24 pt-32">
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_320px]">
            <div className="rounded-[32px] border border-klein/10 bg-white/92 p-8 shadow-[0_30px_90px_rgba(0,47,167,0.08)] backdrop-blur-xl md:p-10">
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-klein/72">
                {eyebrow}
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-display font-bold tracking-[-0.06em] text-ink md:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-ink/68">{summary}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-klein/12 bg-klein/6 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-klein">
                  {status}
                </div>
                <div className="rounded-full border border-border bg-surface px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-ink/52">
                  Effective {effectiveDate}
                </div>
              </div>
            </div>

            <aside className="rounded-[32px] border border-ink/8 bg-ink p-8 text-white shadow-[0_30px_100px_rgba(10,15,28,0.16)]">
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-klein/80">
                Current Boundary
              </div>
              <h2 className="mt-5 text-2xl font-display font-bold tracking-tight">{boundaryTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/68">{boundaryText}</p>

              <div className="mt-8 space-y-3">
                <Link
                  to="/about"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Project status and framing
                  <ArrowUpRight className="h-4 w-4 text-klein" />
                </Link>
                <Link
                  to="/readiness"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Testnet readiness
                  <ArrowUpRight className="h-4 w-4 text-klein" />
                </Link>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.title}
                  className="rounded-[28px] border border-border bg-white/85 p-7 shadow-[0_20px_70px_rgba(10,15,28,0.05)] backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-klein/10 bg-klein/6 p-3 text-klein">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-display font-bold tracking-tight text-ink">
                      {section.title}
                    </h2>
                  </div>
                  {section.summary ? (
                    <p className="mt-5 text-sm leading-7 text-ink/68">{section.summary}</p>
                  ) : null}
                  {section.bullets?.length ? (
                    <ul className="mt-5 space-y-3 text-sm leading-7 text-ink/74">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-klein" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
