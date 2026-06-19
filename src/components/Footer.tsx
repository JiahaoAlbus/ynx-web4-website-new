import { ArrowUpRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,47,167,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,47,167,0.12),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-px ynx-hairline" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,30,0.98)_0%,rgba(9,15,28,0.96)_100%)] px-8 py-10 shadow-[0_28px_90px_rgba(0,0,0,0.28)] lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-klein/85">
              {t("footer.badge")}
            </div>
            <Link
              to="/"
              className="mt-6 block font-display text-4xl font-semibold tracking-[-0.07em] text-white transition-colors hover:text-klein"
            >
              YNX
            </Link>
            <p className="mt-5 text-base leading-8 text-white/78">
              {t("footer.body")}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/62">
              {t("footer.path")}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://github.com/JiahaoAlbus/YNX"
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/84 transition-colors hover:border-klein/30 hover:bg-klein hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <Link
                to="/readiness"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/82 transition-colors hover:text-white"
              >
                {t("footer.readiness")}
                <ArrowUpRight className="h-4 w-4 text-klein" />
              </Link>
            </div>
          </div>

          <FooterColumn
            title={t("footer.start_here")}
            links={[
              { label: t("nav.get_assets"), to: "/test-assets" },
              { label: t("nav.bridge"), to: "/bridge" },
              { label: t("nav.trade"), to: "/trading" },
              { label: t("nav.withdraw"), to: "/withdraw" },
              { label: t("nav.readiness"), to: "/readiness" },
            ]}
          />

          <FooterColumn
            title={t("footer.build")}
            links={[
              { label: t("nav.testnet"), to: "/testnet" },
              { label: t("nav.builders"), to: "/builders" },
              { label: t("nav.validators"), to: "/validators" },
              { label: t("nav.ai"), to: "/ai" },
              { label: t("nav.docs"), to: "/docs" },
            ]}
          />

          <FooterColumn
            title={t("footer.project")}
            links={[
              { label: t("nav.about"), to: "/about" },
              { label: t("nav.support"), to: "/support" },
              { label: t("nav.risk"), to: "/risk" },
              { label: t("nav.security"), to: "/security" },
              { label: "Privacy", to: "/privacy" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-white/58">&copy; {currentYear} YNX Project.</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/58">
              {t("footer.boundary")}
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-white/62">
            <a
              href="https://explorer.ynxweb4.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              {t("footer.explorer")}
              <ArrowUpRight className="h-3.5 w-3.5 text-klein" />
            </a>
            <a
              href="https://faucet.ynxweb4.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              {t("footer.faucet")}
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
            <Link to={link.to} className="text-sm text-white/72 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
