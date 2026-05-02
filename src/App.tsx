/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Builders = lazy(() => import("./pages/Builders").then((module) => ({ default: module.Builders })));
const Validators = lazy(() => import("./pages/Validators").then((module) => ({ default: module.Validators })));
const Research = lazy(() => import("./pages/Research").then((module) => ({ default: module.Research })));
const Testnet = lazy(() => import("./pages/Testnet").then((module) => ({ default: module.Testnet })));
const FAQPage = lazy(() => import("./pages/FAQPage").then((module) => ({ default: module.FAQPage })));
const About = lazy(() => import("./pages/About").then((module) => ({ default: module.About })));
const Docs = lazy(() => import("./pages/Docs").then((module) => ({ default: module.Docs })));

function warmDocsRoute() {
  void import("./pages/Docs");
  void fetch("/docs/registry.json", { cache: "force-cache" }).catch(() => {});
  void fetch("/docs/en/public-testnet-join.md", { cache: "force-cache" }).catch(() => {});
  void fetch("/docs/en/ai-web4-official-demo.md", { cache: "force-cache" }).catch(() => {});
}

function PageFallback() {
  return (
    <div className="min-h-[60vh] px-6 pt-32">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-4 w-48 rounded-full bg-klein/10" />
        <div className="h-16 w-full max-w-2xl rounded-2xl bg-surface" />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 rounded-2xl border border-border bg-white shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const id = window.setTimeout(warmDocsRoute, 1200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="builders" element={<Builders />} />
          <Route path="validators" element={<Validators />} />
          <Route path="research" element={<Research />} />
          <Route path="testnet" element={<Testnet />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="about" element={<About />} />
          <Route path="docs" element={<Navigate to="/docs/en/public-testnet-join" replace />} />
          <Route path="docs/*" element={<Docs />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
