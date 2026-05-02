import { motion } from "motion/react";
import { Check, Clock, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";

export function Roadmap() {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("roadmap.testnet"),
      desc: t("roadmap.testnet_status"),
      status: "completed",
      icon: <Zap className="w-5 h-5" />,
      items: ["Public Testnet Infrastructure", "Multi-validator Consensus", "AI Settlement Primitives"]
    },
    {
      title: "Public Stress Check",
      desc: "Community onboarding & load balancing.",
      status: "current",
      icon: <ActivityIcon className="w-5 h-5 text-klein" />,
      items: ["Faucet Stabilization", "Explorer Data Integrity", "Public Node Guides"]
    },
    {
      title: "Final Security Gate",
      desc: t("roadmap.mainnet_gate"),
      status: "pending",
      icon: <ShieldCheck className="w-5 h-5 text-ink/40" />,
      items: ["External Security Audit", "Bug Bounty Program", "Final Protocol Freeze"]
    },
    {
      title: t("roadmap.mainnet"),
      desc: "Stable release candidate.",
      status: "pending",
      icon: <Clock className="w-5 h-5 text-ink/40" />,
      items: ["Genesis Generation", "Token Swap Gateway", "Mainnet Live"]
    }
  ];

  return (
    <div className="py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-border -z-10" />
            )}
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-6 transition-all ${
              step.status === 'completed' ? 'bg-klein border-klein text-white' : 
              step.status === 'current' ? 'bg-white border-klein text-klein shadow-lg shadow-klein/20' : 
              'bg-white border-border text-ink/20'
            }`}>
              {step.status === 'completed' ? <Check className="w-6 h-6" /> : step.icon}
            </div>
            <div className="space-y-3">
              <h4 className={`text-lg font-bold ${step.status === 'pending' ? 'text-ink/40' : 'text-ink'}`}>
                {step.title}
              </h4>
              <p className="text-sm text-ink/60 leading-relaxed">
                {step.desc}
              </p>
              <ul className="space-y-2 mt-4">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-ink/40 font-medium font-mono">
                    <div className={`w-1 h-1 rounded-full ${step.status === 'pending' ? 'bg-border' : 'bg-klein'}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
