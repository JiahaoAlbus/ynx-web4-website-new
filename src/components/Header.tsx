import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Globe2, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";
import { Button } from "./ui/button";

type NavItem = { name: string; href: string; description?: string };
type NavGroup = { title: string; items: NavItem[] };

export function Header() {
  const { t } = useTranslation();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openDropdown(title: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveDropdown(title);
  }

  function scheduleCloseDropdown(title: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown((current) => (current === title ? null : current));
      closeTimerRef.current = null;
    }, 220);
  }

  const primaryLinks: NavItem[] = [
    { name: t("nav.start"), href: "/test-assets", description: t("nav.desc.start") },
    { name: t("nav.bridge"), href: "/bridge", description: t("nav.desc.bridge") },
    { name: t("nav.withdraw"), href: "/withdraw", description: t("nav.desc.withdraw") },
    { name: t("nav.readiness"), href: "/readiness", description: t("nav.desc.readiness") },
    { name: t("nav.docs"), href: "/docs", description: t("nav.desc.docs") },
  ];

  const groupedMenus = useMemo<NavGroup[]>(
    () => [
      {
        title: t("nav.use"),
        items: [
          { name: t("nav.trade"), href: "/trading", description: t("nav.desc.trade") },
          { name: t("nav.ai"), href: "/ai", description: t("nav.desc.ai") },
          { name: t("nav.testnet"), href: "/testnet", description: t("nav.desc.testnet") },
        ],
      },
      {
        title: t("nav.build"),
        items: [
          { name: t("nav.builders"), href: "/builders", description: t("nav.desc.builders") },
          { name: t("nav.validators"), href: "/validators", description: t("nav.desc.validators") },
          { name: t("nav.ai_demo"), href: "/docs/en/ai-web4-official-demo", description: t("nav.desc.ai_demo") },
        ],
      },
      {
        title: t("nav.project"),
        items: [
          { name: t("nav.about"), href: "/about", description: t("nav.desc.about") },
          { name: t("nav.support"), href: "/support", description: t("nav.desc.support") },
          { name: t("nav.faq"), href: "/faq", description: t("nav.desc.faq") },
          { name: t("nav.risk"), href: "/risk", description: t("nav.desc.risk") },
          { name: t("nav.security"), href: "/security", description: t("nav.desc.security") },
        ],
      },
    ],
    [t],
  );

  const mobileGroups: NavGroup[] = [
    { title: t("nav.main_path"), items: primaryLinks },
    ...groupedMenus,
  ];

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/70 bg-white/78 shadow-[0_14px_45px_rgba(10,15,28,0.05)] backdrop-blur-[16px]"
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
            <NavLink key={link.href} href={link.href} label={link.name} active={isPathActive(location.pathname, link.href)} />
          ))}

          <div className="mx-2 h-5 w-px bg-border/80" />

          {groupedMenus.map((group) => (
            <NavDropdown
              key={group.title}
              title={group.title}
              items={group.items}
              currentPath={location.pathname}
              active={group.items.some((item) => isPathActive(location.pathname, item.href))}
              open={activeDropdown === group.title}
              onOpen={() => openDropdown(group.title)}
              onClose={() => scheduleCloseDropdown(group.title)}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild className="text-ink/60 hover:text-ink">
            <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer">
              {t("nav.github")}
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-full border-klein/12 bg-white/80 px-4 hover:border-klein/25"
          >
            <Link to="/support">{t("nav.support")}</Link>
          </Button>
          <Button variant="klein" size="sm" asChild className="rounded-full shadow-lg shadow-klein/18">
            <Link to="/test-assets">{t("nav.get_assets")}</Link>
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
          className="absolute inset-x-0 top-20 z-40 border-b border-white/70 bg-white/92 p-6 shadow-xl backdrop-blur-[16px] lg:hidden"
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
                        isPathActive(location.pathname, link.href) ? "bg-klein/6 text-klein" : "text-ink"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="block">{link.name}</span>
                      {link.description ? (
                        <span className="mt-1 block text-sm font-normal text-ink/45">{link.description}</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="my-5 h-px bg-border" />
          <LanguageSwitcher mobile />
          <div className="my-5 h-px bg-border" />
          <div className="grid gap-3">
            <Button variant="outline" className="w-full justify-center rounded-2xl" asChild>
              <Link to="/support" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.support")}
              </Link>
            </Button>
            <Button variant="klein" className="w-full justify-center rounded-2xl" asChild>
              <Link to="/test-assets" onClick={() => setMobileMenuOpen(false)}>
                {t("nav.get_assets")}
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { locale, languages, setLanguage, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = languages.find((item) => item.code === locale) || languages[0];

  if (mobile) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">{t("language.label")}</p>
          <p className="text-xs text-ink/45">{t("language.content_note")}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              data-testid={`language-option-${item.code}`}
              onClick={() => setLanguage(item.code)}
              className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                item.code === locale
                  ? "border-klein/30 bg-klein text-white"
                  : "border-border bg-white text-ink/72 hover:border-klein/20 hover:text-ink"
              }`}
            >
              <span className="block font-semibold">{item.nativeLabel}</span>
              <span className={`mt-1 block text-xs ${item.code === locale ? "text-white/68" : "text-ink/40"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        data-testid="language-trigger"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-3 text-sm font-semibold text-ink/72 shadow-sm transition hover:border-klein/20 hover:text-ink"
        aria-label={t("language.label")}
      >
        <Globe2 className="h-4 w-4 text-klein" />
        <span>{current.shortLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-[260px] rounded-[1.5rem] border border-border bg-white p-3 text-ink shadow-[0_22px_70px_rgba(10,15,28,0.12)]">
          <div className="px-2 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-klein/70">{t("language.note")}</p>
            <p className="mt-1 text-xs leading-5 text-ink/45">{t("language.content_note")}</p>
          </div>
          <div className="space-y-1">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                data-testid={`language-option-${item.code}`}
                onClick={() => {
                  setLanguage(item.code);
                  setOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  item.code === locale ? "bg-klein/6 text-klein" : "text-ink/70 hover:bg-surface hover:text-ink"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{item.nativeLabel}</span>
                  <span className="text-xs text-ink/38">{item.shortLabel}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isPathActive(currentPath: string, href: string) {
  if (href === "/") return currentPath === "/";
  if (href === "/docs") return currentPath === "/docs" || currentPath.startsWith("/docs/");
  return currentPath === href || currentPath.startsWith(`${href}/`);
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
        <div className="absolute right-0 top-full z-50 mt-3 min-w-[240px] rounded-[1.5rem] border border-border bg-white p-3 text-ink shadow-[0_22px_70px_rgba(10,15,28,0.12)]">
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block rounded-xl px-3 py-3 text-sm transition ${
                  isPathActive(currentPath, item.href)
                    ? "bg-klein/6 text-klein"
                    : "text-ink/70 hover:bg-surface hover:text-ink"
                }`}
                onClick={onClose}
              >
                <span className="block font-medium">{item.name}</span>
                {item.description ? (
                  <span className="mt-1 block text-xs leading-5 text-ink/48">{item.description}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
