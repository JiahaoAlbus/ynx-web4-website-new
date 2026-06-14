import { ArrowRight, Building2, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DisclosureLayout } from "../components/legal/DisclosureLayout";

export function About() {
  return (
    <div>
      <DisclosureLayout
        eyebrow="About"
        title="YNX is currently a project with live public-testnet infrastructure."
        summary="YNX should be understood first as a Web4 and AI-execution public testnet project with real endpoints, operator surfaces, and documentation. It should not yet be framed as a launched legal company, a regulated financial operator, or a production custody stack."
        effectiveDate="June 14, 2026"
        status="Project Status Note"
        boundaryTitle="What exists today"
        boundaryText="The strongest evidence today is technical and operational: live public endpoints, public testnet workflows, bridge and settlement evidence, and readable readiness materials. The weakest area is not whether the system exists, but whether company formation, audits, and legal-operating controls have fully caught up."
        sections={[
          {
            title: "Current framing",
            icon: Compass,
            bullets: [
              "YNX is best described today as a Web4 and AI-execution public testnet project.",
              "The current site should not imply a separate operating company has already been publicly formed.",
              "The project is strongest when discussed as execution infrastructure, not as a speculative token or exaggerated consensus-moat story.",
              "The best-fit support posture today is grant, sponsorship, or strategic technical backing while legal entity work remains open.",
            ],
          },
          {
            title: "What is already real",
            icon: Sparkles,
            bullets: [
              "Live public endpoints, a public docs center, bridge route evidence, and operator-facing readiness surfaces.",
              "Policy-bounded AI and Web4 execution flows with verifiable settlement primitives on public testnet.",
              "A public-facing site that shows current stage, not just abstract product ambition.",
            ],
          },
          {
            title: "What is not complete yet",
            icon: Building2,
            bullets: [
              "No public legal company entity is announced on this site yet.",
              "External legal memo, broader organizational controls, and production-grade audit coverage are not yet presented as complete.",
              "Current public-testnet bridge and asset evidence should not be overstated as production custody, redemption, or official real-asset trading.",
              "A standard equity underwriting process would still require entity formation, ownership assignment, and legal sign-off that are not yet shown here.",
            ],
          },
          {
            title: "Why the project exists",
            icon: ShieldCheck,
            bullets: [
              "To let humans define policy before automation starts.",
              "To let apps and agents execute inside bounded sessions instead of relying on permanent trust.",
              "To settle machine actions, service access, and AI work with verifiable evidence on a public execution surface.",
            ],
          },
        ]}
      />

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-klein/10 bg-klein px-8 py-12 text-white shadow-[0_28px_100px_rgba(0,47,167,0.22)] md:px-12">
          <div className="max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/60">
              Next step
            </div>
            <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.06em] md:text-5xl">
              Build from the live surface, but keep the claims disciplined.
            </h2>
            <p className="mt-6 text-lg leading-9 text-white/74">
              The right next milestone is not louder positioning. It is cleaner
              disclosures, stronger operational controls, real external usage,
              and eventual entity formation that can carry ownership and
              accountability.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/readiness"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-klein transition-colors hover:bg-surface"
              >
                View readiness
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-semibold text-white transition-colors hover:bg-white/14"
              >
                Read docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
