import React, { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import {
  Menu,
  X,
  Copy,
  Check,
  Search,
  ExternalLink,
  Download,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import { docsData as rawDocsData, expectedFilesCount, expectedWordsCount, expectedCorpusSha256, expectedFilePaths, expectedFileShas, expectedCorpusBytes, buildStamp } from "../data/docs";
import { Magnetic } from "../components/ui/Magnetic";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const ALLOWED_DOCS = [
  "docs/en/V2_PUBLIC_TESTNET_JOIN_GUIDE.md",
  "docs/en/V2_VALIDATOR_NODE_JOIN_GUIDE.md",
  "docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md",
  "docs/en/RELEASE_YNXWEB4.md",
  "docs/en/YNX_v2_WEB4_SPEC.md",
  "docs/en/YNX_v2_WEB4_API.md",
  "docs/en/YNX_v2_AI_SETTLEMENT_API.md",
  "docs/zh/V2_公开测试网加入手册.md",
  "docs/zh/V2_验证节点加入手册.md",
  "docs/zh/V2_共识验证人加入手册.md",
  "docs/zh/YNXWEB4_版本说明.md",
  "docs/zh/WEB4_在YNX中的定义.md",
  "docs/zh/YNX_v2_WEB4_API_接口说明.md",
  "docs/zh/YNX_v2_WEB4_蓝图.md",
  "infra/openapi/ynx-v2-ai.yaml",
  "infra/openapi/ynx-v2-web4.yaml"
];

const StartFromZero = ({ lang }: { lang: "en" | "zh" }) => {
  const isEn = lang === "en";
  return (
    <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg mb-8 not-prose">
      <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
        <Terminal className="w-5 h-5" />
        {isEn ? "[Rapid Join Flow]" : "[快速加入流程]"}
      </h4>
      <p className="text-blue-900 mb-4">
        {isEn
          ? "The official YNX Web4 CLI one-liner (GCP track). Run on a clean Ubuntu 22.04+ server:"
          : "官方 YNX Web4 CLI 一键安装脚本（GCP 赛道）。请在全新的 Ubuntu 22.04+ 服务器上运行："}
      </p>

      <div className="space-y-4">
        <div>
          <div className="relative group">
            <pre className="bg-blue-900/10 p-4 rounded-md text-sm font-mono text-blue-900 overflow-x-auto whitespace-pre-wrap">
              curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText("curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash")}
              className="absolute right-2 top-2 p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-blue-900 mb-2">
            {isEn ? "Select your network role:" : "选择您的网络角色："}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to={isEn ? "/docs/en/public-testnet-join" : "/docs/zh/public-testnet-join"}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline text-sm font-medium"
            >
              {isEn ? "Full Node (State Sync)" : "全节点 (状态同步)"}
            </Link>
            <Link
              to={isEn ? "/docs/en/validator-node-join" : "/docs/zh/validator-node-join"}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors no-underline text-sm font-medium"
            >
              {isEn ? "Validator (Consensus)" : "验证者 (共识)"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const START_FROM_ZERO_EN = `<div><start-from-zero lang="en"></start-from-zero></div>`;
const START_FROM_ZERO_ZH = `<div><start-from-zero lang="zh"></start-from-zero></div>`;

const allRawItems = rawDocsData.flatMap(c => c.items);
const allowedItems = allRawItems.filter(item => ALLOWED_DOCS.includes(item.path));

const docsData = rawDocsData.map(category => ({
  ...category,
  items: category.items.filter(item => ALLOWED_DOCS.includes(item.path))
})).filter(category => category.items.length > 0);

export function Docs() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active doc based on URL
  const currentPath = location.pathname.replace(/^\/docs\//, "").replace(/\/$/, "");

  const allItems = useMemo(() => rawDocsData.flatMap(c => c.items).filter(item => ALLOWED_DOCS.includes(item.path)), []);

  const isIncomplete = false;

  // Find current doc content
  let currentDoc = null;
  if (currentPath === "all") {
    currentDoc = {
      id: "all",
      title: "All Documentation",
      path: "",
      content: allItems.map(item => item.content.trim().startsWith('# ') ? item.content : `# ${item.title}\n\n${item.content}`).join('\n\n---\n\n')
    };
  } else {
    for (const category of docsData) {
      const found = category.items.find((item) => item.id === currentPath);
      if (found) {
        currentDoc = found;
        break;
      }
    }
  }

  // If no specific doc is selected (e.g. /docs root), redirect to first doc
  if (location.pathname === "/docs" || location.pathname === "/docs/") {
    // Handled by router
  }

  const filteredDocs = docsData
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="h-[calc(100vh-5rem)] bg-white overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-24 right-6 z-40">
        <Magnetic>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 bg-white border border-border rounded-full shadow-lg text-ink hover:text-klein transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </Magnetic>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex items-start gap-12 h-full">
        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-border transform transition-transform duration-300 ease-in-out 
            lg:static lg:translate-x-0 lg:w-64 lg:h-full lg:border-none shrink-0 overflow-y-auto
            ${isMobileMenuOpen ? "translate-x-0 pt-24 px-6 shadow-2xl" : "-translate-x-full lg:pt-8 lg:px-0 lg:shadow-none"}
          `}
        >
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-klein/50 transition-colors"
            />
          </div>

          <nav className="space-y-8 pb-12">
            <div>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/docs/all"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group
                      ${
                        currentPath === "all"
                          ? "bg-klein/5 text-klein font-medium"
                          : "text-ink/60 hover:text-ink hover:bg-surface"
                      }
                    `}
                  >
                    All Documentation
                    {currentPath === "all" && (
                      <motion.div
                        layoutId="activeDoc"
                        className="w-1.5 h-1.5 rounded-full bg-klein"
                      />
                    )}
                  </Link>
                </li>
              </ul>
            </div>
            {filteredDocs.map((category, i) => (
              <div key={i}>
                <h3 className="text-xs font-mono font-bold text-ink/40 uppercase tracking-widest mb-4 px-2">
                  {category.title}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/docs/${item.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group
                          ${
                            currentPath === item.id
                              ? "bg-klein/5 text-klein font-medium"
                              : "text-ink/60 hover:text-ink hover:bg-surface"
                          }
                        `}
                      >
                        {item.title}
                        {currentPath === item.id && (
                          <motion.div
                            layoutId="activeDoc"
                            className="w-1.5 h-1.5 rounded-full bg-klein"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto py-12 lg:py-8 min-w-0 scroll-smooth">
          <div className="flex justify-end mb-4 gap-4">
            {currentDoc && currentPath !== "all" && (
              <a
                href={`https://github.com/JiahaoAlbus/YNX/blob/main/${currentDoc.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink/60 hover:text-ink hover:bg-surface rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
                View Source
              </a>
            )}
            {currentDoc && currentPath !== "all" && (
              <button
                onClick={() => {
                  const blob = new Blob([currentDoc.content], {
                    type: "text/markdown",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${currentDoc.id}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-klein bg-klein/5 hover:bg-klein/10 rounded-lg transition-colors"
              >
                <Download size={16} />
                Download Page
              </button>
            )}
            <button
              onClick={() => {
                const allContent = docsData
                  .map((cat) =>
                    cat.items.map((item) => item.content).join("\n\n---\n\n"),
                  )
                  .join("\n\n---\n\n");
                const blob = new Blob([allContent], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ynx-docs-all.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-klein hover:bg-klein/90 rounded-lg transition-colors"
            >
              <Download size={16} />
              Download All
            </button>
          </div>
          <article className="prose prose-lg prose-slate max-w-none">
            {currentDoc ? (
              <div className="mb-20 pb-12">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    "start-from-zero": ({ lang }: any) => <StartFromZero lang={lang} />,
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-4xl font-display font-bold text-ink mb-6 tracking-tight"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-display font-semibold text-ink mt-12 mb-4 flex items-center gap-2 group"
                        {...props}
                      >
                        {props.children}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-klein/40 ml-2">
                          #
                        </span>
                      </h2>
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-bold text-ink mt-8 mb-3"
                        {...props}
                      />
                    ),
                    p: ({ node, children, ...props }: any) => {
                      const childrenArray = React.Children.toArray(children);
                      const isBlock = childrenArray.some((child: any) => {
                        const tagName = child?.props?.node?.tagName || child?.type;
                        return ["div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "table", "pre", "p", "start-from-zero"].includes(tagName);
                      });
                      
                      if (isBlock) {
                        return <div className="mb-6" {...props}>{children}</div>;
                      }
                      
                      return (
                        <p
                          className="text-ink/70 leading-relaxed mb-6"
                          {...props}
                        >
                          {children}
                        </p>
                      );
                    },
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-outside ml-6 mb-6 text-ink/70 space-y-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-outside ml-6 mb-6 text-ink/70 space-y-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="pl-2" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-klein hover:underline underline-offset-4 font-medium inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {props.children}
                      </a>
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-klein/30 pl-6 italic text-ink/60 my-8 bg-surface/50 py-4 rounded-r-lg"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-8">
                        <table className="min-w-full text-left border-collapse" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border-b border-border py-3 px-4 font-bold text-ink bg-surface/50" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border-b border-border py-3 px-4 text-ink/70" {...props} />
                    ),
                    pre: ({ node, children, ref, ...props }) => (
                      <div className="not-prose" {...(props as any)}>
                        {children}
                      </div>
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;

                      if (isInline) {
                        return (
                          <code
                            className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-klein font-medium border border-border/50"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      return (
                        <div className="relative group my-6 rounded-xl overflow-hidden border border-border bg-[#0d1117] shadow-lg">
                          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                            </div>
                            <span className="text-xs font-mono text-white/30 uppercase">
                              {match?.[1] || "text"}
                            </span>
                          </div>
                          <div className="p-4 overflow-x-auto">
                            <code
                              className={`text-sm font-mono text-emerald-400 block ${className}`}
                              {...props}
                            >
                              {children}
                            </code>
                          </div>
                          <CopyButton
                            text={String(children).replace(/\n$/, "")}
                          />
                        </div>
                      );
                    },
                  } as any}
                >
                  {currentDoc.content}
                </ReactMarkdown>
              </div>
            ) : currentPath && currentPath !== "docs" ? (
              <div className="flex flex-col items-center justify-center h-full text-ink/40 py-20">
                <AlertTriangle size={48} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-ink mb-2">404 - Document Not Found</h2>
                <p>The document you are looking for does not exist or is not available.</p>
                <Link to="/docs" className="mt-6 text-klein hover:underline">Return to Documentation</Link>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-ink/40 py-20">
                Select a document to view
              </div>
            )}
          </article>

          <div className="mt-20 pt-10 border-t border-border flex justify-between text-sm text-ink/40 pb-10">
            <p>© 2026 YNX Protocol. All rights reserved.</p>
            <a
              href="https://github.com/JiahaoAlbus/YNX"
              target="_blank"
              rel="noreferrer"
              className="hover:text-klein transition-colors"
            >
              Edit this page on GitHub
            </a>
          </div>
        </main>

        {/* Table of Contents (Right Sidebar - Desktop Only) */}
        <aside className="hidden xl:block w-64 h-full overflow-y-auto pt-8 pb-10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-4">
            On this page
          </h4>
          <ul className="space-y-2 border-l border-border pl-4">
            {/* Since we are rendering markdown, we don't have easy access to headers without parsing. 
                For now, we can just show the current doc title as active. 
                A full TOC parser would be needed for sub-headers. */}
            {currentDoc && (
              <li>
                <button className="text-sm text-left transition-colors text-klein font-medium">
                  {currentDoc.title}
                </button>
              </li>
            )}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
