import { lazy, Suspense, useState, useMemo, useEffect, useDeferredValue } from "react";
import { motion } from "motion/react";
import {
  Menu,
  X,
  Search,
  ExternalLink,
  Download,
  MessageSquareWarning,
  Loader2,
} from "lucide-react";
import { Magnetic } from "../components/ui/Magnetic";
import { Link, useLocation } from "react-router-dom";
import { motionEase } from "../lib/motion";

type DocItem = {
  id: string;
  title: string;
  language: string;
  category: string;
  sourcePath: string;
  publicPath: string;
  description?: string;
  tags?: string[];
};

type DocCategory = {
  title: string;
  items: DocItem[];
};

let registryCache: DocCategory[] | null = null;
let registryPromise: Promise<DocCategory[]> | null = null;
const docContentCache = new Map<string, string>();
const pendingDocContent = new Map<string, Promise<string>>();
const markdownDocumentPromise = import("../components/docs/MarkdownDocument");

function loadRegistry() {
  if (registryCache) return Promise.resolve(registryCache);
  if (!registryPromise) {
    registryPromise = fetch("/docs/registry.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Registry unavailable (${res.status})`);
        return res.json();
      })
      .then((data: DocCategory[]) => {
        registryCache = data;
        return data;
      });
  }
  return registryPromise;
}

async function loadDocContent(doc: DocItem) {
  const cached = docContentCache.get(doc.publicPath);
  if (cached) return cached;

  const pending = pendingDocContent.get(doc.publicPath);
  if (pending) return pending;

  const promise = fetch(doc.publicPath, { cache: "force-cache" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Document not found");

      const text = await response.text();
      if (/^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text)) {
        throw new Error("Document route returned HTML instead of markdown");
      }

      docContentCache.set(doc.publicPath, text);
      return text;
    })
    .finally(() => {
      pendingDocContent.delete(doc.publicPath);
    });

  pendingDocContent.set(doc.publicPath, promise);
  return promise;
}

function preloadDoc(doc: DocItem) {
  if (docContentCache.has(doc.publicPath) || pendingDocContent.has(doc.publicPath)) return;
  void loadDocContent(doc).catch(() => {});
}

const MarkdownDocument = lazy(() => markdownDocumentPromise.then((module) => ({ default: module.MarkdownDocument })));

function DocsContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-slate-200 rounded w-2/3 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

function DocArticle({
  doc,
  onLoaded,
}: {
  doc: DocItem;
  onLoaded: (content: string | null) => void;
}) {
  const [content, setContent] = useState<string | null>(() => docContentCache.get(doc.publicPath) || null);
  const [loading, setLoading] = useState(!docContentCache.has(doc.publicPath));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = docContentCache.get(doc.publicPath);
    if (cached) {
      setContent(cached);
      setLoading(false);
      setError(null);
      onLoaded(cached);
      return;
    }

    let isActive = true;
    setLoading(true);
    setContent(null);
    setError(null);
    onLoaded(null);

    loadDocContent(doc)
      .then((text) => {
        if (!isActive) return;
        setContent(text);
        setLoading(false);
        onLoaded(text);
      })
      .catch((err) => {
        if (!isActive) return;
        console.error("Failed to load document", err);
        setContent(null);
        setLoading(false);
        setError(`Failed to fetch from ${doc.sourcePath}. Missing public output at ${doc.publicPath}`);
        onLoaded(null);
      });

    return () => {
      isActive = false;
    };
  }, [doc.id, doc.publicPath, doc.sourcePath, onLoaded]);

  if (loading) return <DocsContentSkeleton />;

  if (error) {
    return (
      <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-red-500 bg-red-50 p-6 rounded-lg text-center">
        <MessageSquareWarning className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="font-bold mb-2">Error Loading Document</h3>
        <p>{error}</p>
        <p className="text-sm mt-4 text-red-400">
          If you are the developer, try running <code>npm run sync:docs</code>.
        </p>
      </motion.div>
    );
  }

  if (!content) return <DocsContentSkeleton />;

  return (
    <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24 }} className="mb-20 pb-12">
      <Suspense fallback={<DocsContentSkeleton />}>
        <MarkdownDocument content={content} />
      </Suspense>
    </motion.div>
  );
}

export function Docs() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const location = useLocation();

  const [registry, setRegistry] = useState<DocCategory[]>(() => registryCache || []);
  const [isRegistryLoading, setIsRegistryLoading] = useState(!registryCache);

  useEffect(() => {
    let isMounted = true;
    loadRegistry()
      .then((data) => {
        if (isMounted) {
          setRegistry(data);
          setIsRegistryLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load registry", err);
        if (isMounted) setIsRegistryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (registry.length > 0 && isRegistryLoading) {
      setIsRegistryLoading(false);
    }
  }, [isRegistryLoading, registry.length]);

  const currentPath = location.pathname
    .replace(/^\/docs\/?/, "")
    .replace(/\/$/, "");

  const [docContent, setDocContent] = useState<string | null>(null);

  const currentDoc = useMemo(() => {
    for (const category of registry) {
      const found = category.items.find((item) => item.id === currentPath);
      if (found) return found;
    }
    return null;
  }, [currentPath, registry]);
  const registryReady = registry.length > 0;

  const filteredDocs = useMemo(
    () =>
      registry
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => {
            const query = deferredSearchQuery.toLowerCase();
            return (
              item.title.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query) ||
              item.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
              item.sourcePath.toLowerCase().includes(query)
            );
          }),
        }))
        .filter((category) => category.items.length > 0),
    [deferredSearchQuery, registry],
  );

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
          <motion.div
            className="mb-8 relative"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.16 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-klein/50 transition-colors"
            />
            {searchQuery && (
              <motion.div
                className="absolute inset-y-0 right-3 flex items-center text-[10px] font-mono uppercase text-klein"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
              >
                live
              </motion.div>
            )}
          </motion.div>

          <nav className="space-y-8 pb-12">
            {filteredDocs.map((category, i) => (
              <div key={i}>
                <h3 className="text-xs font-mono font-bold text-ink/40 uppercase tracking-widest mb-4 px-2">
                  {category.title}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`/docs/${item.id}`}
                        onMouseEnter={() => preloadDoc(item)}
                        onFocus={() => preloadDoc(item)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group relative overflow-hidden
                          ${
                            currentPath === item.id
                              ? "bg-klein/5 text-klein font-medium"
                              : "text-ink/60 hover:text-ink hover:bg-surface"
                          }
                        `}
                      >
                        {currentPath === item.id && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-klein" />}
                        <span className="truncate">{item.title}</span>
                        {currentPath === item.id && <span className="w-1.5 h-1.5 rounded-full bg-klein" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto py-12 lg:py-8 min-w-0 scroll-smooth relative">
          <div className="flex justify-end mb-4 gap-4">
            {currentDoc && currentPath !== "docs" && (
              <motion.a
                href={`https://github.com/JiahaoAlbus/YNX/blob/main/${currentDoc.sourcePath}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-ink/60 hover:text-ink hover:bg-surface rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
                View Source
              </motion.a>
            )}
            {currentDoc && docContent && currentPath !== "docs" && (
              <motion.button
                onClick={() => {
                  const blob = new Blob([docContent], {
                    type: "text/markdown",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${currentDoc.id.replace(/\//g, "-")}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-klein bg-klein/5 hover:bg-klein/10 rounded-lg transition-colors"
              >
                <Download size={16} />
                Download Page
              </motion.button>
            )}
          </div>

          <article className="prose prose-lg prose-slate max-w-none min-h-[50vh] relative">
            {currentDoc ? (
              <DocArticle key={currentDoc.id} doc={currentDoc} onLoaded={setDocContent} />
            ) : currentPath && registryReady ? (
              <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-ink/40 py-20">
                <MessageSquareWarning size={48} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-ink mb-2">
                  404: Document Not Found
                </h2>
                <p>
                  No match found for slug: {currentPath}
                </p>
                <Link to="/docs" className="mt-6 text-klein hover:underline bg-klein/5 px-6 py-2 rounded-lg font-medium">
                  Go to Documentation Home
                </Link>
              </motion.div>
            ) : !registryReady || isRegistryLoading ? (
              <motion.div key="registry-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-ink/50">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-klein" />
                <p>Loading document registry...</p>
              </motion.div>
            ) : (
              <motion.div key="index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-ink py-10">
                <h1 className="text-4xl font-display font-bold text-ink mb-4 tracking-tight">YNX v2 Documentation</h1>
                <p className="text-xl text-ink/60 mb-12">Select a topic from the sidebar or explore the key areas below.</p>
                
                <div className="grid md:grid-cols-2 gap-6 not-prose">
                  {registry.slice(0, 4).map((category, index) => (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.38, delay: index * 0.06, ease: motionEase.emphasized }}
                      whileHover={{ y: -6, scale: 1.012 }}
                      className="p-6 rounded-2xl bg-surface border border-border group relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-klein to-transparent opacity-0 group-hover:opacity-100"
                        animate={{ x: ["-120%", "120%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                      />
                      <h3 className="text-lg font-bold font-mono tracking-widest uppercase mb-4 text-klein">{category.title}</h3>
                      <ul className="space-y-3">
                        {category.items.slice(0, 3).map(item => (
                          <li key={item.id}>
                            <Link to={`/docs/${item.id}`} className="text-ink/70 hover:text-klein transition-colors font-medium flex items-center gap-2">
                              <ExternalLink className="w-3 h-3 text-ink/30" />
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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
              Protocol GitHub
            </a>
          </div>
        </main>

        {/* Table of Contents (Right Sidebar - Desktop Only) */}
        <aside className="hidden xl:block w-64 h-full overflow-y-auto pt-8 pb-10">
          <h4 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-4">
            On this page
          </h4>
          <ul className="space-y-2 border-l border-border pl-4">
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
