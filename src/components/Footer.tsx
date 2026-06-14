import { ArrowUpRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,47,167,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,47,167,0.12),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-px ynx-hairline" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="ynx-glass rounded-[2rem] border border-white/10 px-8 py-10 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/12 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-klein/80">
              Public Testnet Project
            </div>
            <Link
              to="/"
              className="mt-6 block font-display text-4xl font-semibold tracking-[-0.07em] text-white transition-colors hover:text-klein"
            >
              YNX
            </Link>
            <p className="mt-5 text-base leading-8 text-white/62">
              YNX is currently a Web4 and AI-execution public testnet project.
              This site should not imply that a separate legal operating company,
              custodial product, or regulated financial service is already live.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://github.com/JiahaoAlbus/YNX"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/12 text-white/78 transition-colors hover:border-klein/30 hover:bg-klein hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/72 transition-colors hover:text-white"
              >
                Project status
                <ArrowUpRight className="h-4 w-4 text-klein" />
              </Link>
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={[
              { label: "Home", to: "/" },
              { label: "AI", to: "/ai" },
              { label: "Builders", to: "/builders" },
              { label: "Validators", to: "/validators" },
              { label: "About", to: "/about" },
            ]}
          />

          <FooterColumn
            title="Network"
            links={[
              { label: "Testnet", to: "/testnet" },
              { label: "Bridge", to: "/bridge" },
              { label: "Readiness", to: "/readiness" },
              { label: "Assets", to: "/test-assets" },
              { label: "Docs", to: "/docs" },
            ]}
          />

          <FooterColumn
            title="Disclosures"
            links={[
              { label: "Privacy", to: "/privacy" },
              { label: "Terms", to: "/terms" },
              { label: "Risk", to: "/risk" },
              { label: "Security", to: "/security" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-white/44">&copy; {currentYear} YNX Project.</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/38">
              Public testnet only. Test assets have no mainnet value. Company formation,
              dedicated legal ownership, and broader institutional controls remain in progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-white/44">
            <a
              href="https://explorer.ynxweb4.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              Explorer
              <ArrowUpRight className="h-3.5 w-3.5 text-klein" />
            </a>
            <a
              href="https://faucet.ynxweb4.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              Faucet
              <ArrowUpRight className="h-3.5 w-3.5 text-klein" />
            </a>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; to: string }>;
}) {
  return (
    <div>
      <h4 className="font-display text-lg font-semibold text-white">{title}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-white/58 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
