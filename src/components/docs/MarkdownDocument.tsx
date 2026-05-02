import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, ExternalLink, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";

function StartFromZero({ lang }: { lang: "en" | "zh" }) {
  const isEn = lang === "en";
  return (
    <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg mb-8 not-prose">
      <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
        <Terminal className="w-5 h-5" />
        {isEn ? "[Rapid Join Flow]" : "[快速加入流程]"}
      </h4>
      <p className="text-blue-900 mb-4">
        {isEn
          ? "The official YNX Web4 CLI one-liner. Run on a clean Ubuntu 22.04+ server:"
          : "官方 YNX Web4 CLI 一键安装脚本。请在全新的 Ubuntu 22.04+ 服务器上运行："}
      </p>

      <div className="space-y-4">
        <div className="relative group">
          <pre className="bg-blue-900/10 p-4 rounded-md text-sm font-mono text-blue-900 overflow-x-auto whitespace-pre-wrap">
            curl -fsSL
            https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh
            | bash
          </pre>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                "curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash",
              )
            }
            className="absolute right-2 top-2 p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
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
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ y: -1, scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className="absolute top-3 right-3 p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
      aria-label="Copy code"
    >
      <motion.span
        key={copied ? "copied" : "copy"}
        initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 24 }}
        className="block"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </motion.span>
    </motion.button>
  );
}

export function MarkdownDocument({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={
        {
          "start-from-zero": ({ lang }: any) => <StartFromZero lang={lang} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-display font-bold text-ink mb-6 tracking-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-display font-semibold text-ink mt-12 mb-4 flex items-center gap-2 group" {...props}>
              {props.children}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-klein/40 ml-2">#</span>
            </h2>
          ),
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-ink mt-8 mb-3" {...props} />,
          p: ({ node, children, ...props }: any) => {
            const childrenArray = React.Children.toArray(children);
            const isBlock = childrenArray.some((child: any) => {
              const tagName = child?.props?.node?.tagName || child?.type;
              return [
                "div",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "li",
                "blockquote",
                "table",
                "pre",
                "p",
                "start-from-zero",
              ].includes(tagName);
            });

            if (isBlock) {
              return (
                <div className="mb-6" {...props}>
                  {children}
                </div>
              );
            }

            return (
              <p className="text-ink/70 leading-relaxed mb-6" {...props}>
                {children}
              </p>
            );
          },
          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-6 text-ink/70 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-6 text-ink/70 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
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
            <blockquote className="border-l-4 border-klein/30 pl-6 italic text-ink/60 my-8 bg-surface/50 py-4 rounded-r-lg" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full text-left border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="border-b border-border py-3 px-4 font-bold text-ink bg-surface/50" {...props} />,
          td: ({ node, ...props }) => <td className="border-b border-border py-3 px-4 text-ink/70" {...props} />,
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
                <code className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-klein font-medium border border-border/50" {...props}>
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
                  <span className="text-xs font-mono text-white/30 uppercase">{match?.[1] || "text"}</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <code className={`text-sm font-mono text-emerald-400 block ${className}`} {...props}>
                    {children}
                  </code>
                </div>
                <CopyButton text={String(children).replace(/\\n$/, "")} />
              </div>
            );
          },
        } as any
      }
    >
      {content}
    </ReactMarkdown>
  );
}
