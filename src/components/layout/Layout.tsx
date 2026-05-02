import { AnimatePresence, motion } from "motion/react";
import { useLocation, Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Cursor } from "../ui/Cursor";
import { Background } from "../ui/Background";
import { useEffect } from "react";
import { motionDuration, motionEase } from "../../lib/motion";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-ink font-sans selection:bg-klein selection:text-white overflow-x-hidden">
      <Cursor />
      <Background />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: motionDuration.standard, ease: motionEase.standard }}
          className="pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
