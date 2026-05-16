import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "nav.home": "Home",
    "nav.builders": "Builders",
    "nav.validators": "Validators",
    "nav.testnet": "Testnet",
    "nav.docs": "Docs",
    "hero.badge": "AI-Native Public Testnet Live",
    "hero.title": "Sovereign Execution for Humans and Agents",
    "hero.subtitle": "YNX is an EVM-compatible execution network where humans, apps, and AI agents coordinate through policy-bounded sessions, machine-payment vaults, and verifiable settlement.",
    "hero.cta.explorer": "View Explorer",
    "hero.cta.build": "Run AI Demo",
    "hero.cta.join": "Join Testnet",
    "hero.stats.chain": "EVM Chain ID 9102",
    "hero.stats.nodes": "Live Validator Gate",
    "status.title": "Network Health",
    "status.desc": "Real-time monitoring of our AI/Web4 infrastructure nodes.",
    "dev.title": "Web4 Infrastructure",
    "dev.desc": "Connect your autonomous agents and machine-native apps to YNX.",
    "dev.rpc": "Cosmos RPC",
    "dev.evm": "EVM RPC",
    "dev.chain_id": "Chain ID",
    "dev.faucet": "Test Faucet",
    "caps.title": "Settlement Primitives",
    "caps.desc": "Native support for AI job lifecycles and machine-to-machine payment boundaries.",
    "demo.title": "AI Settlement Demo",
    "demo.step1": "Create Policy",
    "demo.step2": "Bounded Session",
    "demo.step3": "Job Settlement",
    "demo.desc": "Grant bounded authority, agent executes task, YNX settles reward automatically.",
    "roadmap.title": "Progress Tracks",
    "roadmap.testnet": "Public Testnet",
    "roadmap.mainnet": "Mainnet Readiness",
    "roadmap.testnet_status": "Ready for External Stress",
    "roadmap.mainnet_gate": "Audit & On-call Drills",
    "footer.risk": "Test tokens have no mainnet value. Distributed infrastructure under active security polish.",
    "nav.faq": "FAQ",
    "nav.about": "Research",
    "status.online": "Stable",
    "status.offline": "Critical",
    "status.degraded": "Investigating",
    "status.details": "Hub Status",
  },
  zh: {
    "nav.home": "首页",
    "nav.builders": "开发者",
    "nav.validators": "验证者",
    "nav.testnet": "测试网",
    "nav.docs": "文档",
    "hero.badge": "AI 原生公开测试网运行中",
    "hero.title": "为人与智能体而生的主权执行层",
    "hero.subtitle": "YNX 是兼容 EVM 的执行网络。人类、应用与 AI 智能体在此通过策略受限会话、机器支付金库及可验证结算进行高效协作。",
    "hero.cta.explorer": "区块浏览器",
    "hero.cta.build": "运行 AI 演示",
    "hero.cta.join": "加入测试网",
    "hero.stats.chain": "EVM 链 ID 9102",
    "hero.stats.nodes": "验证者实时门禁",
    "status.title": "网络健康度",
    "status.desc": "AI/Web4 基础设施节点的实时健康监测。",
    "dev.title": "Web4 基础设施",
    "dev.desc": "将您的自主智能体与机器原生应用连接至 YNX。",
    "dev.rpc": "Cosmos RPC",
    "dev.evm": "EVM RPC",
    "dev.chain_id": "链 ID",
    "dev.faucet": "测试水龙头",
    "caps.title": "结算原语",
    "caps.desc": "原生支持 AI 任务生命周期与机器间支付边界控制。",
    "demo.title": "AI 结算演示",
    "demo.step1": "创建策略",
    "demo.step2": "受限会话",
    "demo.step3": "任务结算",
    "demo.desc": "用户授予有限权限，Agent 完成任务，YNX 协议自动完成奖励结算。",
    "roadmap.title": "发展轨道",
    "roadmap.testnet": "公开测试网",
    "roadmap.mainnet": "主网就绪",
    "roadmap.testnet_status": "已进入外部压力测试阶段",
    "roadmap.mainnet_gate": "审计与运维恢复演练进行中",
    "footer.risk": "测试代币不具主网价值。分布式基础设施正处于安全调优阶段。",
    "nav.faq": "常见问题",
    "nav.about": "研究",
    "status.online": "稳定",
    "status.offline": "关键故障",
    "status.degraded": "调查中",
    "status.details": "中心节点状态",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("ynx-lang");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("ynx-lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
