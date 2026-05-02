/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Builders } from "./pages/Builders";
import { Validators } from "./pages/Validators";
import { Research } from "./pages/Research";
import { Testnet } from "./pages/Testnet";
import { FAQPage } from "./pages/FAQPage";
import { About } from "./pages/About";
import { Docs } from "./pages/Docs";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="builders" element={<Builders />} />
        <Route path="validators" element={<Validators />} />
        <Route path="research" element={<Research />} />
        <Route path="testnet" element={<Testnet />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="about" element={<About />} />
        <Route path="docs" element={<Navigate to="/docs/all" replace />} />
        <Route path="docs/*" element={<Docs />} />
      </Route>
    </Routes>
  );
}
