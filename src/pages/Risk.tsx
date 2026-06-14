import { AlertTriangle, Coins, ShieldAlert, Waves } from "lucide-react";
import { DisclosureLayout } from "../components/legal/DisclosureLayout";

export function Risk() {
  return (
    <DisclosureLayout
      eyebrow="Risk"
      title="Risk Disclosures for the YNX Public Testnet"
      summary="YNX is still an early public-testnet infrastructure project. The most important diligence principle is simple: public testnet evidence is useful, but it is not the same thing as audited production readiness, licensed financial operations, or real-asset safety at scale."
      effectiveDate="June 14, 2026"
      status="Public Risk Draft"
      boundaryTitle="How to read current evidence"
      boundaryText="Use live endpoints, route evidence, and demos as proof that infrastructure exists and operates. Do not treat them as proof that all production, legal, custody, governance, or decentralization gates have already been passed."
      sections={[
        {
          title: "Testnet and service risk",
          icon: Waves,
          bullets: [
            "Public testnet services may reset, degrade, or change while the project hardens infrastructure.",
            "Availability, latency, or route behavior may vary across public endpoints and integrated services.",
            "Current hosted infrastructure should not be equated with institution-grade disaster recovery or production on-call maturity.",
          ],
        },
        {
          title: "Asset and bridge risk",
          icon: Coins,
          bullets: [
            "Wrapped assets shown on YNX today are public-testnet representations and route evidence, not proof of real mainnet custody, redemption, or official liquidity.",
            "A route marked full-loop-tested or automatic-loop-ready still requires careful interpretation and does not automatically mean production-safe.",
            "Users should never send production funds into public testnet flows or assume testnet outputs can be redeemed for real-world value.",
          ],
        },
        {
          title: "Security and operational risk",
          icon: ShieldAlert,
          bullets: [
            "No external security audit opinion for the full stack is published on this website yet.",
            "Operator controls, validator independence, monitoring depth, and incident workflows are still part of ongoing hardening work.",
            "Security claims should remain conservative until audits, governance controls, and operational drills materially improve.",
          ],
        },
        {
          title: "Legal and organizational risk",
          icon: AlertTriangle,
          bullets: [
            "No public legal operating entity has been announced yet, so company-level legal and compliance implementation remains incomplete by definition.",
            "Project disclosures, privacy, terms, and security pages should be understood as current-stage drafts and boundaries rather than final company policies.",
            "Any future expansion into custody, exchange, stablecoin, or regulated services would require separate legal, technical, and governance work.",
            "Until those prerequisites are complete, YNX is better suited to grants, sponsorships, or exploratory diligence than standard no-surprises institutional underwriting.",
          ],
        },
      ]}
    />
  );
}
