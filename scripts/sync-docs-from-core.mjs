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
  { sourcePath: 'docs/en/V2_PUBLIC_TESTNET_JOIN_GUIDE.md', category: 'Start Here', id: 'en/public-testnet-join', title: 'Public Testnet Join Guide', language: 'en' },
  { sourcePath: 'docs/en/AI_WEB4_OFFICIAL_DEMO.md', category: 'Start Here', id: 'en/ai-web4-official-demo', title: 'AI/Web4 Official Demo', language: 'en' },
  { sourcePath: 'docs/en/BUILDER_QUICKSTART.md', category: 'Start Here', id: 'en/builder-quickstart', title: 'Builder Quickstart', language: 'en' },
  { sourcePath: 'docs/en/EXTERNAL_VALIDATOR_ONBOARDING_PACKET.md', category: 'Start Here', id: 'en/external-validator-onboarding', title: 'Validator Onboarding', language: 'en' },

  // AI / Web4
  { sourcePath: 'docs/en/WEB4_FOR_YNX.md', category: 'AI / Web4', id: 'en/web4-for-ynx', title: 'Web4 Definition', language: 'en' },
  { sourcePath: 'docs/en/YNX_v2_WEB4_API.md', category: 'AI / Web4', id: 'en/ynx-v2-web4-api', title: 'Web4 API', language: 'en' },
  { sourcePath: 'docs/en/YNX_v2_AI_SETTLEMENT_API.md', category: 'AI / Web4', id: 'en/ynx-v2-ai-settlement-api', title: 'AI Settlement API', language: 'en' },
  { sourcePath: 'infra/openapi/ynx-v2-web4.yaml', category: 'AI / Web4', id: 'openapi/ynx-v2-web4-yaml', title: 'Web4 Hub OpenAPI', language: 'en' },
  { sourcePath: 'infra/openapi/ynx-v2-ai.yaml', category: 'AI / Web4', id: 'openapi/ynx-v2-ai-yaml', title: 'AI Gateway OpenAPI', language: 'en' },
  
  // Validators & Testnet Ops
  { sourcePath: 'docs/en/PUBLIC_TESTNET_STATUS_2026_05_02.md', category: 'Validators & Testnet Ops', id: 'en/public-testnet-status-2026-05-02', title: 'Public Testnet Status 2026-05-02', language: 'en' },
  { sourcePath: 'docs/en/TESTNET_LAUNCH_GRADE_RUNBOOK.md', category: 'Validators & Testnet Ops', id: 'en/testnet-launch-grade-runbook', title: 'Testnet Launch-Grade Runbook', language: 'en' },
  { sourcePath: 'docs/en/V2_VALIDATOR_NODE_JOIN_GUIDE.md', category: 'Validators & Testnet Ops', id: 'en/validator-node-join', title: 'Validator Node Join Guide', language: 'en' },
  { sourcePath: 'docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md', category: 'Validators & Testnet Ops', id: 'en/consensus-validator-join', title: 'Consensus Validator Join Guide', language: 'en' },
  
  // Security
  { sourcePath: 'docs/en/V2_HIGH_ASSURANCE_CRYPTO_MODEL.md', category: 'Security', id: 'en/v2-high-assurance-crypto-model', title: 'High Assurance Crypto Model', language: 'en' },
  { sourcePath: 'docs/en/YNX_ARES_HYBRID_CRYPTO_PROTOCOL.md', category: 'Security', id: 'en/ares-hybrid-crypto', title: 'YNX ARES Hybrid Crypto Protocol', language: 'en' },
  { sourcePath: 'docs/en/NON_CUSTODIAL_BUSINESS_AND_COMPLIANCE_BOUNDARY.md', category: 'Security', id: 'en/non-custodial-business-and-compliance-boundary', title: 'Non-Custodial Business and Compliance Boundary', language: 'en' },

  // Mainnet Readiness
  { sourcePath: 'docs/en/MAINNET_AND_INDUSTRY_READINESS_GATES.md', category: 'Mainnet Readiness', id: 'en/mainnet-and-industry-readiness-gates', title: 'Mainnet and Industry Readiness Gates', language: 'en' },
  { sourcePath: 'docs/zh/项目非技术上线手续包.md', category: 'Mainnet Readiness', id: 'zh/project-launch-packet', title: 'Project Non-Technical Launch Packet', language: 'zh' }, // User put in Mainnet Readiness per instructions

  // Chinese Docs
  { sourcePath: 'docs/zh/AI_WEB4_官方演示.md', category: 'Chinese Docs', id: 'zh/ai-web4-official-demo', title: 'AI/Web4 官方演示', language: 'zh' },
  { sourcePath: 'docs/zh/WEB4_在YNX中的定义.md', category: 'Chinese Docs', id: 'zh/web4-definition', title: 'WEB4 在YNX中的定义', language: 'zh' },
  { sourcePath: 'docs/zh/YNX_v2_WEB4_蓝图.md', category: 'Chinese Docs', id: 'zh/ynx-v2-web4-blueprint', title: 'YNX v2 Web4 蓝图', language: 'zh' },
  { sourcePath: 'docs/zh/YNX_v2_WEB4_API_接口说明.md', category: 'Chinese Docs', id: 'zh/ynx-v2-web4-api-spec', title: 'YNX v2 Web4 API 接口说明', language: 'zh' },
  { sourcePath: 'docs/zh/V2_公开测试网加入手册.md', category: 'Chinese Docs', id: 'zh/public-testnet-join', title: 'V2 公开测试网加入手册', language: 'zh' },
  { sourcePath: 'docs/zh/V2_验证节点加入手册.md', category: 'Chinese Docs', id: 'zh/validator-node-join', title: 'V2 验证节点加入手册', language: 'zh' },
  { sourcePath: 'docs/zh/V2_共识验证人加入手册.md', category: 'Chinese Docs', id: 'zh/consensus-validator-join', title: 'V2 共识验证人加入手册', language: 'zh' },
  { sourcePath: 'docs/zh/V2_高保证加密与抗量子安全模型.md', category: 'Chinese Docs', id: 'zh/v2-high-assurance-crypto', title: 'V2 高保证加密与抗量子安全模型', language: 'zh' },
  { sourcePath: 'docs/zh/YNX_ARES_混合抗量子加密协议.md', category: 'Chinese Docs', id: 'zh/ares-hybrid-crypto', title: 'YNX ARES 混合抗量子加密协议', language: 'zh' },
  { sourcePath: 'docs/zh/YNX_非托管商业与合规边界.md', category: 'Chinese Docs', id: 'zh/non-custodial-business', title: 'YNX 非托管商业与合规边界', language: 'zh' },
  { sourcePath: 'docs/zh/主网与行业级上线门禁.md', category: 'Chinese Docs', id: 'zh/mainnet-readiness-gates', title: '主网与行业级上线门禁', language: 'zh' },
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

  const promises = docList.map(async (doc) => {
    let content = '';
    const isYaml = doc.sourcePath.endsWith('.yaml');
    
    if (localRepoPath) {
      const fullPath = path.join(localRepoPath, doc.sourcePath);
      console.log(`Reading locally: ${fullPath}`);
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (err) {
        console.warn(`Local file missing: ${fullPath}, skipping...`);
        return;
      }
    } else {
      const url = `${coreRepoBaseUrl}${doc.sourcePath}`;
      console.log(`Fetching remote: ${url}`);
      try {
        content = await fetchUrl(url);
      } catch (err) {
        console.warn(`Remote file missing: ${url}, skipping...`);
        return;
      }
    }
    
    // Wrap yaml output
    if (isYaml) {
      content = `# ${doc.title}\n\n\`\`\`yaml\n${content}\n\`\`\``;
    }
    
    const fileExt = '.md';
    const filePath = path.join(publicDocsPath, `${doc.id}${fileExt}`);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    registryItems.push({
      id: doc.id,
      title: doc.title,
      language: doc.language,
      category: doc.category,
      sourcePath: doc.sourcePath,
      publicPath: `/docs/${doc.id}${fileExt}`
    });
  });

  await Promise.all(promises);
  
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
    items: registryItems.filter(item => item.category === cat)
  }));
  
  // Also push any uncategorized items if they exist
  const categorizedIds = registry.flatMap(c => c.items).map(i => i.id);
  const uncategorized = registryItems.filter(i => !categorizedIds.includes(i.id));
  if (uncategorized.length > 0) {
    registry.push({ title: 'Other Info', items: uncategorized });
  }

  const registryPath = path.join(publicDocsPath, 'registry.json');
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log('Docs synced and registry generated successfully!');
}

syncDocs().catch(console.error);
