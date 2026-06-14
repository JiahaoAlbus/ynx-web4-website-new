import { Bug, LockKeyhole, ShieldCheck, Siren } from "lucide-react";
import { DisclosureLayout } from "../components/legal/DisclosureLayout";

export function Security() {
  return (
    <DisclosureLayout
      eyebrow="Security"
      title="Security Disclosure for the YNX Project"
      summary="YNX has a real security reporting path and active public infrastructure, but it should not pretend to have a fully institutional security organization already in place. This page explains the current project-stage security posture and where more maturity is still needed."
      effectiveDate="June 14, 2026"
      status="Working Security Disclosure"
      boundaryTitle="Current maturity level"
      boundaryText="The current documented dedicated intake path is GitHub Security Advisories for the repository. A company-managed security alias, broader legal ownership, and later-stage institutional controls remain work to be completed."
      sections={[
        {
          title: "How to report issues",
          icon: Bug,
          bullets: [
            "Use GitHub Security Advisories for private reporting whenever possible.",
            "If GitHub Advisories are unavailable, use the official website contact path and explicitly request a security reporting channel.",
            "Include impact, affected components, steps to reproduce, and whether the issue may already be public or exploited.",
          ],
        },
        {
          title: "What current security claims do mean",
          icon: ShieldCheck,
          bullets: [
            "YNX has public infrastructure that can be tested, observed, and patched.",
            "The project maintains testnet-stage response expectations and public security documentation.",
            "Security language should remain anchored to current evidence, not to implied institution-grade maturity.",
          ],
        },
        {
          title: "What current security claims do not mean",
          icon: LockKeyhole,
          bullets: [
            "They do not mean there is already a 24/7 staffed security operations team.",
            "They do not mean the full stack has a published external audit opinion.",
            "They do not mean public-testnet bridge routes should be interpreted as production custody controls.",
          ],
        },
        {
          title: "Open security gaps",
          icon: Siren,
          bullets: [
            "Dedicated company-managed security contact infrastructure still needs to be created.",
            "Production-grade persistence, disaster recovery, and broader incident drills remain part of ongoing hardening.",
            "Audit completion, governance control hardening, and clearer operator ownership are still needed before stronger production language is credible.",
          ],
        },
      ]}
    />
  );
}
