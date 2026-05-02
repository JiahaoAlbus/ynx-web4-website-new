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
  const routeGroup = location.pathname.split("/")[1] || "home";
  const isDocsRoute = routeGroup === "docs";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-ink font-sans selection:bg-klein selection:text-white overflow-x-hidden">
      {!isDocsRoute && <Cursor />}
      {!isDocsRoute && <Background />}
      <Header />
      <AnimatePresence initial={false} mode="sync">
        <motion.main
          key={routeGroup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: motionDuration.quick, ease: motionEase.standard }}
          className="pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
