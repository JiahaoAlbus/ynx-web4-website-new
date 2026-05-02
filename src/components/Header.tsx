import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../contexts/LanguageContext";

export function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.builders"), href: "/builders" },
    { name: t("nav.validators"), href: "/validators" },
    { name: t("nav.docs"), href: "/docs" },
    { name: t("nav.testnet"), href: "/testnet" },
    { name: t("nav.faq"), href: "/faq" },
    { name: t("nav.about"), href: "/about" },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-display font-bold text-2xl tracking-tighter text-ink hover:text-klein transition-colors">
            YNX
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-dark/50 border border-border/50 text-ink text-[10px] font-mono font-medium uppercase tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("hero.badge")}
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors relative group ${
                location.pathname === link.href ? "text-klein" : "text-ink/60 hover:text-ink"
              }`}
            >
              {link.name}
              {location.pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-klein rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            className="text-ink/60 hover:text-ink flex items-center gap-2"
          >
            <Languages size={16} />
            {language === "en" ? "中文" : "EN"}
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-ink/60 hover:text-ink">
            <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
          <Button variant="klein" size="sm" asChild className="shadow-lg shadow-klein/20 hover:shadow-klein/30 transition-all">
            <Link to="/docs/en/ai-web4-official-demo">{t("hero.cta.build")}</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-ink hover:bg-surface rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-20 inset-x-0 bg-white/95 backdrop-blur-xl border-b border-border p-6 flex flex-col gap-4 shadow-xl z-40"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-lg font-medium ${
                location.pathname === link.href ? "text-klein" : "text-ink"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Button
            variant="outline"
            className="w-full justify-center flex items-center gap-2"
            onClick={() => {
              setLanguage(language === "en" ? "zh" : "en");
              setMobileMenuOpen(false);
            }}
          >
            <Languages size={18} />
            {language === "en" ? "Switch to 中文" : "切换到 English"}
          </Button>
          <Button variant="outline" className="w-full justify-center" asChild>
            <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
          <Button variant="klein" className="w-full justify-center" asChild>
            <Link to="/docs/en/ai-web4-official-demo" onClick={() => setMobileMenuOpen(false)}>
              {t("hero.cta.build")}
            </Link>
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
