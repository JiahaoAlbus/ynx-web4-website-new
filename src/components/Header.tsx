import { useMemo, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";
import { Button } from "./ui/button";

type NavItem = { name: string; href: string };
type NavGroup = { title: string; items: NavItem[] };

export function Header() {
  const { t } = useTranslation();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  const primaryLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.testnet"), href: "/testnet" },
    { name: t("nav.ai"), href: "/ai" },
    { name: t("nav.docs"), href: "/docs" },
    { name: t("nav.about"), href: "/about" },
  ];

  const groupedMenus = useMemo<NavGroup[]>(
    () => [
      {
        title: "Build",
        items: [
          { name: t("nav.builders"), href: "/builders" },
          { name: t("nav.validators"), href: "/validators" },
          { name: t("nav.assets"), href: "/test-assets" },
        ],
      },
      {
        title: "Operate",
        items: [
          { name: t("nav.bridge"), href: "/bridge" },
          { name: t("nav.withdraw"), href: "/withdraw" },
          { name: t("nav.trade"), href: "/trading" },
          { name: t("nav.readiness"), href: "/readiness" },
        ],
      },
      {
        title: "Learn",
        items: [
          { name: t("nav.faq"), href: "/faq" },
          { name: "Risk", href: "/risk" },
          { name: "Security", href: "/security" },
        ],
      },
    ],
    [t],
  );

  const mobileGroups = [
    { title: "Primary", items: primaryLinks },
    ...groupedMenus,
  ];

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/45 bg-white/42 shadow-[0_14px_45px_rgba(10,15,28,0.05)] backdrop-blur-[28px]"
          : "bg-transparent"
      }`}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-klein/0 via-klein to-klein/0"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-3 text-ink transition-colors hover:text-klein">
          <span className="font-display text-[1.9rem] font-semibold tracking-[-0.07em]">YNX</span>
          <span className="hidden rounded-full border border-klein/10 bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-klein/75 shadow-sm xl:inline-flex">
            Public Testnet Project
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.name} active={location.pathname === link.href} />
          ))}

          <div className="mx-2 h-5 w-px bg-border/80" />

          {groupedMenus.map((group) => (
            <NavDropdown
              key={group.title}
              title={group.title}
              items={group.items}
              currentPath={location.pathname}
              active={group.items.some((item) => item.href === location.pathname)}
              open={activeDropdown === group.title}
              onOpen={() => setActiveDropdown(group.title)}
              onClose={() => setActiveDropdown((current) => (current === group.title ? null : current))}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="sm" asChild className="text-ink/60 hover:text-ink">
            <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-full border-klein/12 bg-white/80 px-4 hover:border-klein/25"
          >
            <Link to="/readiness">Readiness</Link>
          </Button>
          <Button variant="klein" size="sm" asChild className="rounded-full shadow-lg shadow-klein/18">
            <Link to="/docs/en/ai-web4-official-demo">{t("hero.cta.build")}</Link>
          </Button>
        </div>

        <button
          className="rounded-full p-2 text-ink transition-colors hover:bg-surface lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          className="absolute inset-x-0 top-20 z-40 border-b border-white/45 bg-white/68 p-6 shadow-xl backdrop-blur-[28px] lg:hidden"
        >
          <div className="space-y-5">
            {mobileGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">{group.title}</p>
                <div className="grid gap-2">
                  {group.items.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`rounded-2xl px-4 py-3 text-base font-medium ${
                        location.pathname === link.href ? "bg-klein/6 text-klein" : "text-ink"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="my-5 h-px bg-border" />
          <div className="grid gap-3">
            <Button variant="outline" className="w-full justify-center rounded-2xl" asChild>
              <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button variant="klein" className="w-full justify-center rounded-2xl" asChild>
              <Link to="/docs/en/ai-web4-official-demo" onClick={() => setMobileMenuOpen(false)}>
                {t("hero.cta.build")}
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={href}
      className={`relative rounded-full px-3 py-2 text-sm transition-colors ${
        active ? "text-klein" : "text-ink/62 hover:text-ink"
      }`}
    >
      {label}
      {active ? (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-klein"
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
      ) : null}
    </Link>
  );
}

function NavDropdown({
  title,
  items,
  currentPath,
  active,
  open,
  onOpen,
  onClose,
}: {
  title: string;
  items: NavItem[];
  currentPath: string;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-colors ${
          active ? "text-klein" : "text-ink/52 hover:text-ink"
        }`}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="ynx-frost absolute right-0 top-full z-50 mt-3 min-w-[240px] rounded-[1.5rem] p-3 shadow-2xl">
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                  item.href === currentPath
                    ? "bg-klein/6 text-klein"
                    : "text-ink/70 hover:bg-surface hover:text-ink"
                }`}
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
