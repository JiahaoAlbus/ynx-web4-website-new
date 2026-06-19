import {
  ArrowUpRight,
  FileText,
  Flag,
  HandCoins,
  Mail,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DisclosureLayout } from "../components/legal/DisclosureLayout";
import { useTranslation } from "../contexts/LanguageContext";

const REPO_BASE = "https://github.com/JiahaoAlbus/YNX/blob/main";

export function Support() {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div>
      <DisclosureLayout
        eyebrow={isEn ? "Support" : "资助与尽调"}
        title={
          isEn
            ? "Support YNX from the public evidence, not from implied maturity."
            : "基于公开证据支持 YNX，而不是基于被暗示的成熟度。"
        }
        summary={
          isEn
            ? "This page is the shortest route for grant reviewers, sponsors, accelerators, partners, and exploratory early-stage investors. YNX has real public-testnet evidence and public technical work, but it should still be evaluated as a project-stage infrastructure effort rather than as a fully formed operating company."
            : "这页是 grant reviewer、赞助方、加速器、合作方和探索性早期投资人进入 YNX 的最短路径。YNX 已经有真实公网测试网证据和公开技术资产，但当前仍应被视为项目阶段基础设施，而不是已完整公司化的经营主体。"
        }
        effectiveDate="June 19, 2026"
        status={isEn ? "Project-Stage Support Entry" : "项目阶段支持入口"}
        boundaryTitle={isEn ? "Current support boundary" : "当前支持边界"}
        boundaryText={
          isEn
            ? "YNX is strongest today as a public-testnet infrastructure project with real technical artifacts. It is not yet a publicly announced legal operating entity, a mainnet-grade production network, or a completed institutional compliance stack."
            : "YNX 当前最强的定位是具有真实技术资产的公网测试网基础设施项目。它还不是已公开法律主体，不是主网级生产网络，也不是已完成机构级合规栈的公司。"
        }
        sections={[
          {
            title: isEn ? "What is already real" : "已经真实存在的部分",
            icon: Sparkles,
            bullets: isEn
              ? [
                  "Public website, public repository, and public technical and diligence materials.",
                  "Live public-testnet infrastructure across RPC, indexer, explorer, AI gateway, and Web4 surfaces.",
                  "Public evidence for policy-bounded execution, AI settlement rails, and testnet bridge-route readiness.",
                ]
              : [
                  "公开官网、公开仓库，以及公开技术与尽调材料。",
                  "RPC、indexer、explorer、AI gateway、Web4 等真实公网测试网基础设施。",
                  "policy-bounded execution、AI settlement rails、测试网桥路由 readiness 的公开证据。",
                ],
          },
          {
            title: isEn ? "What support would accelerate" : "资金最该加速什么",
            icon: HandCoins,
            bullets: isEn
              ? [
                  "Security review, remediation, and incident-response hardening.",
                  "Observability, backups, disaster recovery, and operator maturity.",
                  "Builder tooling, SDKs, docs, and ecosystem integration packaging.",
                  "Entity, terms, privacy, and other company-readiness basics.",
                ]
              : [
                  "安全审查、修复与 incident-response hardening。",
                  "监控、备份、灾备与 operator 成熟度建设。",
                  "Builder tooling、SDK、文档和生态集成包装。",
                  "主体、terms、privacy 等公司化基础设施。",
                ],
          },
          {
            title: isEn ? "What YNX is not claiming" : "YNX 当前不应声称的内容",
            icon: ShieldAlert,
            bullets: isEn
              ? [
                  "No publicly announced legal operating entity yet.",
                  "No published external audit opinion yet.",
                  "No published external legal memo yet.",
                  "No production-grade custody, regulated exchange, or real-asset trading claim.",
                ]
              : [
                  "尚未公开宣布法律经营主体。",
                  "尚未公开外部审计意见。",
                  "尚未公开外部法律意见书。",
                  "不应声称已有生产级托管、受监管交易所或真实资产交易能力。",
                ],
          },
          {
            title: isEn ? "Best-fit support posture" : "当前最匹配的支持方式",
            icon: Flag,
            bullets: isEn
              ? [
                  "Grant programs that support open infrastructure, developer tooling, or safe AI execution.",
                  "Sponsors or ecosystem partners that want to harden real public infrastructure.",
                  "Exploratory early-stage investors who understand entity formation is still open work.",
                ]
              : [
                  "支持开放基础设施、开发者工具或安全 AI 执行的 grant 项目。",
                  "愿意帮助真实公网基础设施继续硬化的赞助方或生态合作方。",
                  "理解主体设立仍未完成的探索性早期投资人。",
                ],
          },
        ]}
      />

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-klein/10 bg-white/92 p-8 shadow-[0_30px_90px_rgba(0,47,167,0.08)] backdrop-blur-xl md:p-10">
          <div className="max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-klein/72">
              {isEn ? "Fast public links" : "公开材料快捷入口"}
            </div>
            <h2 className="mt-5 text-4xl font-display font-bold tracking-[-0.06em] text-ink md:text-5xl">
              {isEn ? "Use the shortest path." : "直接使用最短路径。"}
            </h2>
            <p className="mt-6 text-lg leading-9 text-ink/68">
              {isEn
                ? "If someone asks for the fastest way to evaluate YNX, send these first. They are intentionally conservative and cross-checkable."
                : "如果有人要用最快方式评估 YNX，先发这些。它们都是刻意保持克制并且可交叉核验的公开材料。"}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[
              {
                title: isEn ? "Start here for support" : "资助与尽调入口",
                text: isEn
                  ? "Single public entry point for grants, sponsors, and early diligence."
                  : "grant、赞助和早期尽调的单入口。",
                href: `${REPO_BASE}/START_HERE_FOR_SUPPORT.md`,
                icon: FileText,
              },
              {
                title: isEn ? "One-pager PDF" : "One-pager PDF",
                text: isEn
                  ? "Short public funding summary suitable for forms and first replies."
                  : "适合表单和首轮回复的简洁公开资金支持摘要。",
                href: `${REPO_BASE}/docs/en/YNX_OUTLIER_ONE_PAGER_2026_06_18.pdf`,
                icon: FileText,
              },
              {
                title: isEn ? "Standard response pack" : "标准答复包",
                text: isEn
                  ? "Short, medium, and long answers for grants and accelerators."
                  : "grant 和加速器可直接复用的短答、中答、长答。",
                href: `${REPO_BASE}/docs/en/EXTERNAL_RESPONSE_PACK_2026_06_19.md`,
                icon: FileText,
              },
              {
                title: isEn ? "Founder contact" : "创始人联系",
                text: isEn
                  ? "Use email for grant, sponsor, or diligence follow-up."
                  : "grant、赞助或尽调跟进统一用邮箱联系。",
                href: "mailto:founder@ynxweb4.com",
                icon: Mail,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="group rounded-[28px] border border-border bg-surface/60 p-6 transition hover:-translate-y-0.5 hover:border-klein/20 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-klein/10 bg-klein/6 p-3 text-klein">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-2xl font-display font-semibold tracking-tight text-ink">{item.title}</h3>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-ink/60">{item.text}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink/25 transition-all group-hover:translate-x-1 group-hover:text-klein" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-klein/12 bg-klein px-6 py-4 font-semibold text-white transition-colors hover:bg-klein-dark"
            >
              {isEn ? "Project status" : "项目状态"}
            </Link>
            <Link
              to="/readiness"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-6 py-4 font-semibold text-ink transition-colors hover:border-klein/20 hover:text-klein"
            >
              {isEn ? "Readiness and evidence" : "查看门禁与证据"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
