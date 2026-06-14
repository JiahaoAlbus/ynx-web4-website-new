import { Database, Globe, Lock, Shield } from "lucide-react";
import { DisclosureLayout } from "../components/legal/DisclosureLayout";

export function Privacy() {
  return (
    <DisclosureLayout
      eyebrow="Privacy"
      title="Privacy Notice for the YNX Project"
      summary="This page describes the current project-level privacy posture for ynxweb4.com and related public testnet services. It is written for a public-testnet infrastructure project and should not be read as the final policy of a separately formed legal operating company, because no such public entity has been announced yet."
      effectiveDate="June 14, 2026"
      status="Project Draft Disclosure"
      boundaryTitle="Project, not legal entity"
      boundaryText="YNX is currently presented as a public-testnet infrastructure project. Until an operating entity is publicly formed, this notice explains current handling expectations and boundaries rather than the policy of a launched corporate service provider."
      sections={[
        {
          title: "Data we may process",
          icon: Database,
          bullets: [
            "Basic analytics, uptime telemetry, and operational logs needed to keep public endpoints available and to investigate abuse or failures.",
            "Public wallet addresses, transaction hashes, or route identifiers only when users submit them through testnet tools or support flows.",
            "Contact details that users voluntarily provide when asking for help, reporting bugs, or coordinating validator and builder onboarding.",
          ],
        },
        {
          title: "Data we do not want",
          icon: Lock,
          bullets: [
            "YNX does not ask users to submit private keys, seed phrases, or plaintext signing secrets.",
            "YNX should not receive production personal-finance data through public testnet flows.",
            "The project does not sell personal data to data brokers or advertising networks.",
          ],
        },
        {
          title: "How data is used today",
          icon: Shield,
          bullets: [
            "Operate, secure, and debug public testnet infrastructure and related documentation services.",
            "Support incident response, abuse prevention, and reliability investigations.",
            "Publish aggregate readiness, health, and operator-facing metrics without promising anonymous or zero-log operation.",
          ],
        },
        {
          title: "Cross-border and retention caveats",
          icon: Globe,
          bullets: [
            "Public infrastructure may use multiple regions and service providers, so data may transit or be processed outside a visitor's home jurisdiction.",
            "Retention, deletion, and processor inventories are still part of the project's compliance-readiness work and should not be overstated as fully institutionalized controls yet.",
            "No public legal data-controller entity is named on this site yet, so this notice describes present project-stage handling expectations rather than a finished corporate privacy program.",
            "If and when a legal operating entity is formed, this notice should be replaced or updated with entity-specific ownership, processor, and rights information.",
          ],
        },
      ]}
    />
  );
}
