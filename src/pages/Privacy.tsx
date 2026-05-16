import { Shield, Database, Lock, Globe } from "lucide-react";

const sections = [
  {
    title: "What We Collect",
    icon: <Database className="w-5 h-5 text-klein" />,
    points: [
      "Website analytics and operational logs used for reliability and abuse prevention.",
      "Public wallet addresses or transaction hashes only when users submit them through public testnet tools.",
      "Support contact details provided voluntarily through community channels.",
    ],
  },
  {
    title: "What We Do Not Collect",
    icon: <Lock className="w-5 h-5 text-klein" />,
    points: [
      "No custody of private keys or seed phrases.",
      "No storage of plaintext wallet secrets.",
      "No sale of personal data to third parties.",
    ],
  },
  {
    title: "How Data Is Used",
    icon: <Shield className="w-5 h-5 text-klein" />,
    points: [
      "Maintain and secure public testnet infrastructure.",
      "Troubleshoot incidents and improve service quality.",
      "Publish aggregate health metrics and readiness reports.",
    ],
  },
  {
    title: "Cross-Border Access",
    icon: <Globe className="w-5 h-5 text-klein" />,
    points: [
      "Public infrastructure may be distributed across multiple regions.",
      "By using the service, users consent to processing required for network operation.",
      "Compliance obligations are handled according to the non-custodial model described in official docs.",
    ],
  },
];

export function Privacy() {
  return (
    <div className="pt-28 pb-24">
      <section className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-klein font-mono mb-3">
            Privacy
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink mb-4">
            Privacy Policy
          </h1>
          <p className="text-ink/60 text-lg leading-relaxed">
            Effective date: May 16, 2026. This policy applies to YNX public
            testnet services and documentation website.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-ink flex items-center gap-3 mb-4">
                {section.icon}
                {section.title}
              </h2>
              <ul className="space-y-2 text-ink/70">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="text-sm text-ink/50 mt-10">
          For policy and compliance details, refer to YNX canonical documents in
          the docs center.
        </p>
      </section>
    </div>
  );
}
