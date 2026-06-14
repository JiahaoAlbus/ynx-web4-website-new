import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type FlowStep = {
  title: string;
  description: string;
  href: string;
  state?: "current" | "next" | "later";
};

export function TaskFlowBand({
  eyebrow,
  title,
  description,
  steps,
}: {
  eyebrow: string;
  title: string;
  description: string;
  steps: FlowStep[];
}) {
  return (
    <section className="mb-8 rounded-[2rem] border border-klein/12 bg-[linear-gradient(180deg,rgba(248,251,255,0.92)_0%,rgba(255,255,255,0.92)_100%)] p-6 shadow-sm">
      <div className="max-w-3xl">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-klein/75">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-ink/62">{description}</p>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Link
            key={step.href}
            to={step.href}
            className={`group rounded-[1.5rem] border p-4 transition hover:-translate-y-0.5 ${
              step.state === "current"
                ? "border-klein/18 bg-klein/6"
                : "border-border bg-white/82 hover:border-klein/20"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/40">Step {index + 1}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                  step.state === "current"
                    ? "bg-klein text-white"
                    : step.state === "next"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-surface text-ink/55"
                }`}
              >
                {step.state === "current" ? "current" : step.state === "next" ? "next" : "later"}
              </span>
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</p>
            <p className="mt-2 text-sm leading-6 text-ink/58">{step.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-klein">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
