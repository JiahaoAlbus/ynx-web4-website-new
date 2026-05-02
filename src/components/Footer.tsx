import { motion } from "motion/react";
import { Github, Twitter, Disc as Discord, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,47,167,0.15),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2">
            <Link to="/" className="font-display font-bold text-3xl tracking-tighter text-white mb-6 block hover:text-klein transition-colors">
              YNX
            </Link>
            <p className="text-white/60 max-w-sm leading-relaxed mb-8">
              The AI-native Web4 execution chain. Built on Web3 sovereignty, empowering autonomous, policy-bounded, machine-native coordination.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/JiahaoAlbus/YNX" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-klein hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              {/* Add other social links if needed */}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/builders" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  Builders
                </Link>
              </li>
              <li>
                <Link to="/validators" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  Validators
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Network</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/testnet" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  Testnet Status
                  <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </Link>
              </li>
              <li>
                <a href="https://explorer.ynxweb4.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  Explorer
                  <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a href="https://faucet.ynxweb4.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-klein transition-colors flex items-center group">
                  Faucet
                  <ArrowUpRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} YNX Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
