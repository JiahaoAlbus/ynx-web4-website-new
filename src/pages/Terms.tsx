import { AlertTriangle, Scale, Wallet, Wrench } from "lucide-react";

const termsBlocks = [
  {
    title: "Testnet Scope",
    icon: <Wrench className="w-5 h-5 text-klein" />,
    text: "YNX public network is currently a testnet environment. Features, APIs, uptime, and behavior may change without prior notice.",
  },
  {
    title: "No Asset Custody",
    icon: <Wallet className="w-5 h-5 text-klein" />,
    text: "YNX does not take custody of user wallets, private keys, or seed phrases. Users are fully responsible for key management and signing actions.",
  },
  {
    title: "No Financial Promise",
    icon: <AlertTriangle className="w-5 h-5 text-klein" />,
    text: "Testnet tokens have no monetary value and are provided for development and testing only. Nothing on this site is investment advice.",
  },
  {
    title: "Acceptable Use",
    icon: <Scale className="w-5 h-5 text-klein" />,
    text: "Users must not abuse public endpoints, bypass policy controls, attempt unauthorized access, or run activities that disrupt network availability.",
  },
];

export function Terms() {
  return (
    <div className="pt-28 pb-24">
      <section className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-klein font-mono mb-3">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink mb-4">
            Terms of Service
          </h1>
          <p className="text-ink/60 text-lg leading-relaxed">
            Effective date: May 16, 2026. These terms govern use of the YNX
            website and public testnet services.
          </p>
        </div>

        <div className="grid gap-6">
          {termsBlocks.map((item) => (
            <article
              key={item.title}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-ink flex items-center gap-3 mb-3">
                {item.icon}
                {item.title}
              </h2>
              <p className="text-ink/70 leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>

        <p className="text-sm text-ink/50 mt-10">
          Continued use of the service indicates acceptance of these terms.
        </p>
      </section>
    </div>
  );
}
