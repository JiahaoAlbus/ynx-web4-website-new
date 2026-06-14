import { AlertTriangle, Scale, Wallet, Wrench } from "lucide-react";
import { DisclosureLayout } from "../components/legal/DisclosureLayout";

export function Terms() {
  return (
    <DisclosureLayout
      eyebrow="Terms"
      title="Terms of Use for the YNX Project Site and Public Testnet"
      summary="These are current project-level terms for using ynxweb4.com, public documentation, and public testnet surfaces. They are intentionally conservative: the site should not imply that YNX is already a launched custodial, exchange, or regulated financial service, and these terms should be updated once a legal operating entity exists."
      effectiveDate="June 14, 2026"
      status="Project Draft Terms"
      boundaryTitle="Current operating posture"
      boundaryText="Use of the site and public endpoints is governed as access to a public-testnet infrastructure project. The project is still early, experimental, and subject to change; no user should infer production guarantees or regulated-service status from access to the current website."
      sections={[
        {
          title: "Testnet scope only",
          icon: Wrench,
          bullets: [
            "YNX currently operates as a public testnet environment, and behavior, parameters, endpoints, and availability may change without advance notice.",
            "Testnet assets, balances, bridge routes, AI settlement flows, and route evidence are for testing and evaluation only.",
            "Nothing on the site should be read as a statement that real external assets are officially tradable, redeemable, or production-safe on YNX today.",
          ],
        },
        {
          title: "No custody or key management",
          icon: Wallet,
          bullets: [
            "Users remain responsible for their own wallets, private keys, signing devices, and any third-party tools they connect.",
            "The YNX project does not take custody of user wallets, seed phrases, or production funds through this website.",
            "Any public bridge evidence shown on the site must be understood as testnet-scoped architecture and workflow evidence, not production custody.",
          ],
        },
        {
          title: "No financial promise",
          icon: AlertTriangle,
          bullets: [
            "Testnet tokens and synthetic test assets have no monetary value and are not investment products.",
            "The site does not provide investment advice, broker or dealer services, or guaranteed return language.",
            "Use of YNX materials should not be treated as an offer of regulated financial services in any jurisdiction.",
          ],
        },
        {
          title: "Acceptable use",
          icon: Scale,
          bullets: [
            "Do not abuse public endpoints, bypass policy controls, spam faucet or bridge services, or attempt unauthorized access.",
            "Do not submit sensitive production secrets or illegal content through public interfaces.",
            "YNX may restrict, rate-limit, or suspend abusive activity to protect public infrastructure and other users.",
          ],
        },
      ]}
    />
  );
}
