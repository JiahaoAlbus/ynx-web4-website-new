import { motion } from "motion/react";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Terminal,
  Code,
  Shield,
  BookOpen,
  FileText,
  HelpCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-klein/5 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-klein-dark/5 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-klein animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wide text-ink/70">
            PUBLIC TESTNET LIVE (v2-web4)
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-ink max-w-5xl leading-[1.1]"
        >
          The Execution Layer <br className="hidden md:block" />
          <span className="text-klein">for Web4.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-ink/60 max-w-2xl font-medium leading-relaxed"
        >
          YNX is an AI-native execution chain built on Web3 sovereignty.
          Empowering autonomous, policy-bounded, machine-native coordination
          with an EVM-first developer surface.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap justify-center gap-4 w-full max-w-4xl"
        >
          {/* 1. Primary CTA — “View Explorer” */}
          <Button
            size="lg"
            className="group shadow-lg transition-all border-none"
            style={{ backgroundColor: "#002FA7", color: "#FFFFFF" }}
            asChild
          >
            <a
              href="https://explorer.ynxweb4.com/"
              target="_blank"
              rel="noreferrer"
            >
              View Explorer
              <ArrowRight
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                style={{ color: "#FFFFFF" }}
              />
            </a>
          </Button>

          {/* 2. Secondary CTA — “Join Public Testnet” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#002FA7",
              border: "1px solid #C9D7FF",
            }}
            asChild
          >
            <Link to="/docs/en/public-testnet-join">
              Join Public Testnet
            </Link>
          </Button>

          {/* 3. Secondary CTA — “Validators” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#F7F9FC",
              color: "#0A0F1C",
              border: "1px solid #D7E0F2",
            }}
            asChild
          >
            <Link to="/validators">
              <Shield className="mr-2 w-4 h-4" style={{ color: "#3E5B99" }} />
              Validators
              <ArrowRight
                className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "#3E5B99" }}
              />
            </Link>
          </Button>

          {/* 4. Secondary CTA — “Research” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#F9FAFC",
              color: "#162033",
              border: "1px solid #DCE3F0",
            }}
            asChild
          >
            <Link to="/research">
              <BookOpen className="mr-2 w-4 h-4" style={{ color: "#6E7FA8" }} />
              Research
              <ArrowRight
                className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "#6E7FA8" }}
              />
            </Link>
          </Button>

          {/* 5. Supporting CTA — “Docs” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#1B2435",
              border: "1px solid #D9E1EC",
            }}
            asChild
          >
            <Link to="/docs">
              <FileText className="mr-2 w-4 h-4" style={{ color: "#7B879C" }} />
              Docs
              <ArrowRight
                className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "#7B879C" }}
              />
            </Link>
          </Button>

          {/* 6. Supporting CTA — “FAQ” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#FBFBFC",
              color: "#2A3140",
              border: "1px solid #E2E7EF",
            }}
            asChild
          >
            <Link to="/faq">
              <HelpCircle
                className="mr-2 w-4 h-4"
                style={{ color: "#8A94A6" }}
              />
              FAQ
              <ArrowRight
                className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "#8A94A6" }}
              />
            </Link>
          </Button>

          {/* 7. Supporting CTA — “About” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#202938",
              border: "1px solid #DDE3EC",
            }}
            asChild
          >
            <Link to="/about">
              <Info className="mr-2 w-4 h-4" style={{ color: "#8791A3" }} />
              About
              <ArrowRight
                className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "#8791A3" }}
              />
            </Link>
          </Button>

          {/* 8. Supporting CTA — “Explore GitHub” */}
          <Button
            size="lg"
            className="group transition-all hover:bg-black/5"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#202938",
              border: "1px solid #DDE3EC",
            }}
            asChild
          >
            <a
              href="https://github.com/JiahaoAlbus/YNX"
              target="_blank"
              rel="noreferrer"
            >
              <Terminal className="mr-2 w-4 h-4" style={{ color: "#8791A3" }} />
              Explore GitHub
              <ArrowRight
                className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "#8791A3" }}
              />
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 w-full max-w-4xl mx-auto border-t border-border/50 pt-8 flex flex-wrap justify-center gap-x-12 gap-y-6"
        >
          <div className="flex flex-col items-center group cursor-default">
            <span className="text-3xl font-display font-semibold text-ink group-hover:text-klein transition-colors">
              ynx_9102-1
            </span>
            <span className="text-xs font-mono text-ink/50 uppercase tracking-widest mt-1">
              Chain ID
            </span>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <span className="text-3xl font-display font-semibold text-ink group-hover:text-klein transition-colors">
              NYXT
            </span>
            <span className="text-xs font-mono text-ink/50 uppercase tracking-widest mt-1">
              Native Asset
            </span>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <span className="text-3xl font-display font-semibold text-ink group-hover:text-klein transition-colors">
              EVM
            </span>
            <span className="text-xs font-mono text-ink/50 uppercase tracking-widest mt-1">
              First Surface
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
