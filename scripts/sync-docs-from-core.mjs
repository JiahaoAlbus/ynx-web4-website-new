import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const coreRepoBaseUrl = 'https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/';
const localRepoPath = process.env.YNX_CORE_REPO_PATH;

const publicDocsPath = path.join(projectRoot, 'public', 'docs');

const docList = [
  // Start Here
  { sourcePath: 'docs/en/V2_PUBLIC_TESTNET_JOIN_GUIDE.md', fallbackPath: 'content/fallback-docs/en/public-testnet-join.md', category: 'Start Here', id: 'en/public-testnet-join', title: 'Public Testnet Join Guide', language: 'en', description: 'Guide to joining the V2 public testnet.', tags: ['testnet', 'join', 'guide'] },
  { sourcePath: 'docs/en/AI_WEB4_OFFICIAL_DEMO.md', fallbackPath: 'content/fallback-docs/en/ai-web4-official-demo.md', category: 'Start Here', id: 'en/ai-web4-official-demo', title: 'AI/Web4 Official Demo', language: 'en', description: 'Official demonstration of the AI/Web4 settlement layer.', tags: ['ai', 'web4', 'demo'] },
  { sourcePath: 'docs/en/BUILDER_QUICKSTART.md', fallbackPath: 'content/fallback-docs/en/builder-quickstart.md', category: 'Start Here', id: 'en/builder-quickstart', title: 'Builder Quickstart', language: 'en', description: 'Quickstart guide for builders on YNX.', tags: ['builder', 'quickstart'] },
  { sourcePath: 'docs/en/EXTERNAL_VALIDATOR_ONBOARDING_PACKET.md', fallbackPath: 'content/fallback-docs/en/external-validator-onboarding.md', category: 'Start Here', id: 'en/external-validator-onboarding', title: 'Validator Onboarding', language: 'en', description: 'Onboarding packet for external validators.', tags: ['validator', 'onboarding'] },
  { sourcePath: 'docs/en/YNX_IOS_FEATURE_MANUAL.md', fallbackPath: 'content/fallback-docs/en/ynx-ios-feature-manual.md', category: 'Start Here', id: 'en/ynx-ios-feature-manual', title: 'YNX iOS Feature Manual', language: 'en', description: 'Feature map and install guidance for the YNX iOS client.', tags: ['ios', 'manual', 'app'] },

  // AI / Web4
  { sourcePath: 'docs/en/WEB4_FOR_YNX.md', fallbackPath: 'content/fallback-docs/en/web4-for-ynx.md', category: 'AI / Web4', id: 'en/web4-for-ynx', title: 'Web4 Definition', language: 'en', description: 'What Web4 means in YNX v2.', tags: ['web4', 'definition'] },
  { sourcePath: 'docs/en/YNX_v2_WEB4_API.md', fallbackPath: 'content/fallback-docs/en/ynx-v2-web4-api.md', category: 'AI / Web4', id: 'en/ynx-v2-web4-api', title: 'Web4 API', language: 'en', description: 'Web4 coordination Hub API specification.', tags: ['web4', 'api'] },
  { sourcePath: 'docs/en/YNX_v2_AI_SETTLEMENT_API.md', fallbackPath: 'content/fallback-docs/en/ynx-v2-ai-settlement-api.md', category: 'AI / Web4', id: 'en/ynx-v2-ai-settlement-api', title: 'AI Settlement API', language: 'en', description: 'AI Settlement Gateway API specification.', tags: ['ai', 'settlement', 'api'] },
  { sourcePath: 'docs/en/UNIVERSAL_BRIDGE_METHOD.md', fallbackPath: 'content/fallback-docs/en/universal-bridge-method.md', category: 'AI / Web4', id: 'en/universal-bridge-method', title: 'Universal Bridge Method', language: 'en', description: 'Multi-chain asset onboarding method for YNX.', tags: ['bridge', 'multichain', 'integration'] },
  { sourcePath: 'infra/openapi/ynx-v2-web4.yaml', fallbackPath: 'content/fallback-docs/openapi/ynx-v2-web4-yaml.md', category: 'AI / Web4', id: 'openapi/ynx-v2-web4-yaml', title: 'Web4 Hub OpenAPI', language: 'en', description: 'OpenAPI spec for Web4 Hub.', tags: ['openapi', 'web4'] },
  { sourcePath: 'infra/openapi/ynx-v2-ai.yaml', fallbackPath: 'content/fallback-docs/openapi/ynx-v2-ai-yaml.md', category: 'AI / Web4', id: 'openapi/ynx-v2-ai-yaml', title: 'AI Gateway OpenAPI', language: 'en', description: 'OpenAPI spec for AI Gateway.', tags: ['openapi', 'ai'] },
  
  // Validators & Testnet Ops
  { sourcePath: 'docs/en/PUBLIC_TESTNET_STATUS_2026_05_02.md', fallbackPath: 'content/fallback-docs/en/public-testnet-status-2026-05-02.md', category: 'Validators & Testnet Ops', id: 'en/public-testnet-status-2026-05-02', title: 'Public Testnet Status 2026-05-02', language: 'en', description: 'Status of the public testnet as of May 2, 2026.', tags: ['testnet', 'status'] },
  { sourcePath: 'docs/en/RELEASES_2_CURRENT_STATUS.md', fallbackPath: 'content/fallback-docs/en/releases-2-current-status.md', category: 'Validators & Testnet Ops', id: 'en/releases-2-current-status', title: 'Releases 2 Current Status', language: 'en', description: 'Current rollout status across chain, gateway, and client surfaces.', tags: ['release', 'status', 'rollout'] },
  { sourcePath: 'docs/en/TESTNET_LAUNCH_GRADE_RUNBOOK.md', fallbackPath: 'content/fallback-docs/en/testnet-launch-grade-runbook.md', category: 'Validators & Testnet Ops', id: 'en/testnet-launch-grade-runbook', title: 'Testnet Launch-Grade Runbook', language: 'en', description: 'Runbook for maintaining launch-grade testnet.', tags: ['testnet', 'runbook'] },
  { sourcePath: 'docs/en/V2_VALIDATOR_NODE_JOIN_GUIDE.md', fallbackPath: 'content/fallback-docs/en/validator-node-join.md', category: 'Validators & Testnet Ops', id: 'en/validator-node-join', title: 'Validator Node Join Guide', language: 'en', description: 'Guide to joining as a validator node.', tags: ['validator', 'node', 'join'] },
  { sourcePath: 'docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md', fallbackPath: 'content/fallback-docs/en/consensus-validator-join.md', category: 'Validators & Testnet Ops', id: 'en/consensus-validator-join', title: 'Consensus Validator Join Guide', language: 'en', description: 'Guide to joining as a consensus validator.', tags: ['validator', 'consensus', 'join'] },
  
  // Security
  { sourcePath: 'docs/en/V2_HIGH_ASSURANCE_CRYPTO_MODEL.md', fallbackPath: 'content/fallback-docs/en/v2-high-assurance-crypto-model.md', category: 'Security', id: 'en/v2-high-assurance-crypto-model', title: 'High Assurance Crypto Model', language: 'en', description: 'YNX v2 high assurance cryptography model.', tags: ['security', 'crypto'] },
  { sourcePath: 'docs/en/YNX_ARES_HYBRID_CRYPTO_PROTOCOL.md', fallbackPath: 'content/fallback-docs/en/ares-hybrid-crypto.md', category: 'Security', id: 'en/ares-hybrid-crypto', title: 'YNX ARES Hybrid Crypto Protocol', language: 'en', description: 'ARES Hybrid Quantum-Resistant Crypto Protocol.', tags: ['security', 'crypto', 'ares'] },
  { sourcePath: 'docs/en/NON_CUSTODIAL_BUSINESS_AND_COMPLIANCE_BOUNDARY.md', fallbackPath: 'content/fallback-docs/en/non-custodial-business-and-compliance-boundary.md', category: 'Security', id: 'en/non-custodial-business-and-compliance-boundary', title: 'Non-Custodial Business and Compliance Boundary', language: 'en', description: 'Non-custodial and compliance boundaries of YNX.', tags: ['compliance', 'business'] },

  // Mainnet Readiness
  { sourcePath: 'docs/en/MAINNET_AND_INDUSTRY_READINESS_GATES.md', fallbackPath: 'content/fallback-docs/en/mainnet-and-industry-readiness-gates.md', category: 'Mainnet Readiness', id: 'en/mainnet-and-industry-readiness-gates', title: 'Mainnet and Industry Readiness Gates', language: 'en', description: 'Gates for mainnet and industry readiness.', tags: ['mainnet', 'readiness'] },
  { sourcePath: 'docs/zh/项目非技术上线手续包.md', fallbackPath: 'content/fallback-docs/zh/project-launch-packet.md', category: 'Mainnet Readiness', id: 'zh/project-launch-packet', title: 'Project Non-Technical Launch Packet', language: 'zh', description: 'Project non-technical launch packet.', tags: ['mainnet', 'readiness', 'zh'] }, // User put in Mainnet Readiness per instructions

  // Chinese Docs
  { sourcePath: 'docs/zh/AI_WEB4_官方演示.md', fallbackPath: 'content/fallback-docs/zh/ai-web4-official-demo.md', category: 'Chinese Docs', id: 'zh/ai-web4-official-demo', title: 'AI/Web4 官方演示', language: 'zh', description: 'AI/Web4 结算层官方演示。', tags: ['ai', 'web4', 'demo', 'zh'] },
  { sourcePath: 'docs/zh/WEB4_在YNX中的定义.md', fallbackPath: 'content/fallback-docs/zh/web4-definition.md', category: 'Chinese Docs', id: 'zh/web4-definition', title: 'WEB4 在YNX中的定义', language: 'zh', description: 'Web4 在 YNX v2 中的意义。', tags: ['web4', 'definition', 'zh'] },
  { sourcePath: 'docs/zh/YNX_iOS_功能手册.md', fallbackPath: 'content/fallback-docs/zh/ynx-ios-feature-manual.md', category: 'Chinese Docs', id: 'zh/ynx-ios-feature-manual', title: 'YNX iOS 功能手册', language: 'zh', description: 'YNX iOS 客户端功能与入口说明。', tags: ['ios', 'manual', 'zh'] },
  { sourcePath: 'docs/zh/YNX_v2_WEB4_蓝图.md', fallbackPath: 'content/fallback-docs/zh/ynx-v2-web4-blueprint.md', category: 'Chinese Docs', id: 'zh/ynx-v2-web4-blueprint', title: 'YNX v2 Web4 蓝图', language: 'zh', description: 'YNX v2 Web4 架构蓝图。', tags: ['web4', 'blueprint', 'zh'] },
  { sourcePath: 'docs/zh/YNX_v2_WEB4_API_接口说明.md', fallbackPath: 'content/fallback-docs/zh/ynx-v2-web4-api-spec.md', category: 'Chinese Docs', id: 'zh/ynx-v2-web4-api-spec', title: 'YNX v2 Web4 API 接口说明', language: 'zh', description: 'Web4 API 接口说明文档。', tags: ['web4', 'api', 'zh'] },
  { sourcePath: 'docs/zh/V2_公开测试网加入手册.md', fallbackPath: 'content/fallback-docs/zh/public-testnet-join.md', category: 'Chinese Docs', id: 'zh/public-testnet-join', title: 'V2 公开测试网加入手册', language: 'zh', description: '加入 V2 公开测试网的手册。', tags: ['testnet', 'join', 'zh'] },
  { sourcePath: 'docs/zh/V2_验证节点加入手册.md', fallbackPath: 'content/fallback-docs/zh/validator-node-join.md', category: 'Chinese Docs', id: 'zh/validator-node-join', title: 'V2 验证节点加入手册', language: 'zh', description: '加入验证节点手册。', tags: ['validator', 'node', 'zh'] },
  { sourcePath: 'docs/zh/V2_共识验证人加入手册.md', fallbackPath: 'content/fallback-docs/zh/consensus-validator-join.md', category: 'Chinese Docs', id: 'zh/consensus-validator-join', title: 'V2 共识验证人加入手册', language: 'zh', description: '加入共识验证人手册。', tags: ['validator', 'consensus', 'zh'] },
  { sourcePath: 'docs/zh/V2_高保证加密与抗量子安全模型.md', fallbackPath: 'content/fallback-docs/zh/v2-high-assurance-crypto.md', category: 'Chinese Docs', id: 'zh/v2-high-assurance-crypto', title: 'V2 高保证加密与抗量子安全模型', language: 'zh', description: 'V2 高保证加密模型。', tags: ['security', 'crypto', 'zh'] },
  { sourcePath: 'docs/zh/YNX_ARES_混合抗量子加密协议.md', fallbackPath: 'content/fallback-docs/zh/ares-hybrid-crypto.md', category: 'Chinese Docs', id: 'zh/ares-hybrid-crypto', title: 'YNX ARES 混合抗量子加密协议', language: 'zh', description: 'ARES 混合抗量子加密协议。', tags: ['security', 'crypto', 'ares', 'zh'] },
  { sourcePath: 'docs/zh/YNX_非托管商业与合规边界.md', fallbackPath: 'content/fallback-docs/zh/non-custodial-business.md', category: 'Chinese Docs', id: 'zh/non-custodial-business', title: 'YNX 非托管商业与合规边界', language: 'zh', description: 'YNX 的非托管合规边界。', tags: ['compliance', 'business', 'zh'] },
  { sourcePath: 'docs/zh/主网与行业级上线门禁.md', fallbackPath: 'content/fallback-docs/zh/mainnet-readiness-gates.md', category: 'Chinese Docs', id: 'zh/mainnet-readiness-gates', title: '主网与行业级上线门禁', language: 'zh', description: '主网上线必须满足的门禁。', tags: ['mainnet', 'readiness', 'zh'] },
];

async function fetchUrl(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  return await res.text();
}

if (!fs.existsSync(publicDocsPath)) {
  fs.mkdirSync(publicDocsPath, { recursive: true });
}

async function syncDocs() {
  const registryItems = [];
  let successCount = 0;
  let fallbackCount = 0;
  const failedPaths = [];
  const fallbackedPaths = [];

  const promises = docList.map(async (doc, index) => {
    let content = '';
    const isYaml = doc.sourcePath.endsWith('.yaml');
    let isSuccess = true;
    let didFallback = false;
    
    try {
      if (localRepoPath) {
        const fullPath = path.join(localRepoPath, doc.sourcePath);
        console.log(`Reading locally: ${fullPath}`);
        content = fs.readFileSync(fullPath, 'utf8');
      } else {
        const url = `${coreRepoBaseUrl}${doc.sourcePath}`;
        console.log(`Fetching remote: ${url}`);
        content = await fetchUrl(url);
      }
    } catch (err) {
      if (doc.fallbackPath && fs.existsSync(path.join(projectRoot, doc.fallbackPath))) {
        console.warn(`Source missing, using fallback for: ${doc.sourcePath}`);
        content = fs.readFileSync(path.join(projectRoot, doc.fallbackPath), 'utf8');
        didFallback = true;
      } else {
        console.error(`ERROR: Failed to source ${doc.sourcePath} and no fallback found!`);
        isSuccess = false;
      }
    }

    if (isSuccess && !didFallback) {
      successCount++;
    } else if (didFallback) {
      fallbackCount++;
      fallbackedPaths.push(doc.sourcePath);
    } else {
      failedPaths.push(doc.sourcePath);
      return; // Will cause exit(1) later
    }
    
    // Wrap yaml output
    if (isYaml && !content.trimStart().startsWith('# ')) {
      content = `# ${doc.title}\n\n\`\`\`yaml\n${content}\n\`\`\``;
    }
    
    const fileExt = '.md';
    const filePath = path.join(publicDocsPath, `${doc.id}${fileExt}`);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    registryItems.push({
      order: index,
      id: doc.id,
      title: doc.title,
      language: doc.language,
      category: doc.category,
      sourcePath: doc.sourcePath,
      publicPath: `/docs/${doc.id}${fileExt}`,
      description: doc.description,
      tags: doc.tags
    });
  });

  await Promise.all(promises);
  registryItems.sort((a, b) => a.order - b.order);
  
  if (failedPaths.length > 0) {
    console.error('\n!!! SYNC FAILED !!!');
    console.error('The following documents were not found and have no fallback:');
    failedPaths.forEach(p => console.error(`  - ${p}`));
    process.exit(1);
  }

  const categories = [
    'Start Here',
    'AI / Web4',
    'Validators & Testnet Ops',
    'Security',
    'Mainnet Readiness',
    'Chinese Docs'
  ];
  
  const registry = categories.map(cat => ({
    title: cat,
    items: registryItems.filter(item => item.category === cat).map(({ order, ...item }) => item)
  }));
  
  // Also push any uncategorized items if they exist
  const categorizedIds = registry.flatMap(c => c.items).map(i => i.id);
  const uncategorized = registryItems.filter(i => !categorizedIds.includes(i.id));
  if (uncategorized.length > 0) {
    registry.push({ title: 'Other Info', items: uncategorized.map(({ order, ...item }) => item) });
  }

  const registryPath = path.join(publicDocsPath, 'registry.json');
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  
  console.log('--- Sync Summary ---');
  console.log(`Successfully synced from source: ${successCount} files`);
  console.log(`Successfully synced from fallback: ${fallbackCount} files`);
  if (fallbackedPaths.length > 0) {
    console.log('Fallback source paths:');
    fallbackedPaths.forEach(p => console.log(`  - ${p}`));
  }
  console.log('Docs synced and registry generated successfully!');
}

syncDocs().catch((err) => {
  console.error('Unhandled sync error:', err);
  process.exit(1);
});
