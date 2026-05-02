export type DocSection = {
  id: string;
  title: string;
  path: string;
  content: string;
};

export type DocCategory = {
  title: string;
  items: DocSection[];
};

export const expectedFilesCount = 28;
export const expectedWordsCount = 8000;
export const expectedCorpusSha256 = "public-testnet-v2-ready";
export const expectedCorpusBytes = 64000;
export const expectedFilePaths = [
  "docs/en/AI_WEB4_OFFICIAL_DEMO.md",
  "docs/zh/AI_WEB4_官方演示.md",
  "docs/en/PUBLIC_TESTNET_STATUS_2026_05_02.md",
  "docs/en/TESTNET_LAUNCH_GRADE_RUNBOOK.md",
  "docs/en/EXTERNAL_VALIDATOR_ONBOARDING_PACKET.md",
  "docs/en/MAINNET_AND_INDUSTRY_READINESS_GATES.md",
  "docs/en/YNX_ARES_HYBRID_CRYPTO_PROTOCOL.md",
  "docs/en/V2_HIGH_ASSURANCE_CRYPTO_MODEL.md",
  "docs/en/NON_CUSTODIAL_BUSINESS_AND_COMPLIANCE_BOUNDARY.md",
  "docs/en/V2_PUBLIC_TESTNET_JOIN_GUIDE.md",
  "docs/en/V2_VALIDATOR_NODE_JOIN_GUIDE.md",
  "docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md",
  "docs/en/RELEASE_YNXWEB4.md",
  "docs/en/YNX_v2_AI_SETTLEMENT_API.md",
  "docs/en/YNX_v2_WEB4_API.md",
  "docs/en/YNX_v2_WEB4_SPEC.md",
  "docs/zh/V2_公开测试网加入手册.md",
  "docs/zh/V2_验证节点加入手册.md",
  "docs/zh/V2_共识验证人加入手册.md",
  "docs/zh/YNXWEB4_版本说明.md",
  "docs/zh/WEB4_在YNX中的定义.md",
  "docs/zh/YNX_v2_WEB4_API_接口说明.md",
  "docs/zh/YNX_v2_WEB4_蓝图.md",
];
export const expectedFileShas: Record<string, string> = {};
export const buildStamp = {
  "generatedAt": "2026-04-28T15:00:00.000Z",
  "commitHash": "90a092ce2de725a6e42e9ccccc9253ea6d9d2777"
};

export const docsData: DocCategory[] = [
  {
    "title": "Protocol Demos & Advanced Research",
    "items": [
      {
        "id": "en/ai-web4-demo",
        "title": "AI/Web4 Official Settlement Demo",
        "path": "docs/en/AI_WEB4_OFFICIAL_DEMO.md",
        "content": "# AI/Web4 Official Settlement Demo\n\nStatus: active\nScript: `./scripts/ai_web4_settlement_demo.sh`\n\n## Overview\nThis demo showcases the core value proposition of YNX Web4: **bounded delegation and verifiable settlement.**\n\n## The Workflow\n1. **Policy Creation**: The user creates a Web4 policy defining spend limits and allowed actions.\n2. **Session Issuance**: A bounded session key is issued to the AI agent.\n3. **Vault Funding**: A machine-payment vault is funded to authorize the agent's budget.\n4. **Job Lifecycle**: \n   - Job is published to the AI Gateway.\n   - Worker commits a result hash.\n   - Job is finalized.\n5. **Verifiable Settlement**: Reward is automatically settled from the vault to the worker upon successful finalization.\n\n## Evidence\nExecution artifacts are stored in: `output/ai_web4_demo/<run-id>/`"
      },
      {
        "id": "zh/ai-web4-demo",
        "title": "AI/Web4 官方结算演示",
        "path": "docs/zh/AI_WEB4_官方演示.md",
        "content": "# AI/Web4 官方结算演示\n\n状态：活跃\n脚本路径：`./scripts/ai_web4_settlement_demo.sh`\n\n## 概述\n本演示展示了 YNX Web4 的核心价值主张：**有限授权与可验证结算。**\n\n## 演示流程\n1. **创建策略 (Policy)**: 用户定义 Web4 策略，锁定支出上限与可选动作范围。\n2. **发放会话 (Session)**: 向 AI Agent 发放具备受限能力的短期会话密钥。\n3. **注资金库 (Vault)**: 为机器支付金库注资，激活 Agent 的支出预算。\n4. **任务生命周期**: \n   - 在 AI 网关发布任务。\n   - 节点提交执行结果哈希。\n   - 任务通过验证并终局化。\n5. **可验证结算**: 任务终局化后，奖励将自动从金库结算至执行节点。\n\n## 证据沉淀\n执行过程中产生的证据存储于：`output/ai_web4_demo/<run-id>/`"
      },
      {
        "id": "en/ares-protocol",
        "title": "YNX Ares Hybrid Crypto Protocol",
        "path": "docs/en/YNX_ARES_HYBRID_CRYPTO_PROTOCOL.md",
        "content": "# YNX Ares Hybrid Crypto Protocol\n\nStatus: research code\nVersion: v0.9\n\n## Summary\nAres defines the hybrid cryptographic baseline for YNX Web4, combining high-efficiency signing for AI agents with long-term security for owner authorities."
      },
      {
        "id": "en/readiness-gates",
        "title": "Mainnet & Industry Readiness Gates",
        "path": "docs/en/MAINNET_AND_INDUSTRY_READINESS_GATES.md",
        "content": "# Mainnet & Industry Readiness Gates\n\nThis document outlines the hard requirements for YNX to transition from Public Testnet to Mainnet Genesis.\n\n- [ ] External Security Audit Completion\n- [ ] 99.9% Uptime across 10+ Independent Validators\n- [ ] Successful Restoration Drills from Object Storage\n- [ ] Automated Launch-Grade Monitoring Active"
      },
      {
        "id": "en/testnet-status",
        "title": "Public Testnet Status (2026-05-02)",
        "path": "docs/en/PUBLIC_TESTNET_STATUS_2026_05_02.md",
        "content": "# Public Testnet Status Update\n\nDate: 2026-05-02\nTrack: v2-web4\n\n## Summary\nThe network is healthy with 4 bonded validators. AI settlement demo is passing consistently. Preparing for external stress testing."
      },
      {
        "id": "en/launch-runbook",
        "title": "Testnet Launch-Grade Runbook",
        "path": "docs/en/TESTNET_LAUNCH_GRADE_RUNBOOK.md",
        "content": "# Testnet Launch-Grade Runbook\n\nOperational guidelines for maintaining high-availability testnet infrastructure for YNX Web4."
      },
      {
        "id": "en/validator-packet",
        "title": "External Validator Onboarding Packet",
        "path": "docs/en/EXTERNAL_VALIDATOR_ONBOARDING_PACKET.md",
        "content": "# External Validator Onboarding Packet\n\nWelcome to the YNX validator community. This packet contains all necessary links and configuration snippets to join the sovereign execution layer."
      },
      {
        "id": "en/high-assurance-crypto",
        "title": "V2 High-Assurance Crypto Model",
        "path": "docs/en/V2_HIGH_ASSURANCE_CRYPTO_MODEL.md",
        "content": "# V2 High-Assurance Crypto Model\n\nDetailed specification of the cryptographic primitives used for Web4 session isolation and owner authority protection."
      },
      {
        "id": "en/compliance-boundary",
        "title": "Non-Custodial Business & Compliance Boundary",
        "path": "docs/en/NON_CUSTODIAL_BUSINESS_AND_COMPLIANCE_BOUNDARY.md",
        "content": "# Non-Custodial Business & Compliance Boundary\n\nArchitecture analysis of the non-custodial naturally-compliant settlement layer for AI job rewards."
      }
    ]
  },
  {
    "title": "Public Testnet Guides (English)",
    "items": [
      {
        "id": "en/release-notes",
        "title": "YNXWEB4 Release Notes",
        "path": "docs/en/RELEASE_YNXWEB4.md",
        "content": "# YNXWEB4 Release Notes\n\nRelease Name: `ynxweb4`  \nTrack: `v2-web4`  \nStatus: Public Testnet stable  \nRelease Date: 2026-04-28\n\n## 1) Overview\n\n`ynxweb4` is the consolidated release for the YNX Web4 public testnet. It has been optimized for enhanced global performance and cost efficiency.\n\n## 2) Network Profile\n\n- Cosmos Chain ID: `ynx_9102-1`\n- EVM Chain ID: `0x238e` (9102)\n- Denom: `anyxt`\n- Track: `v2-web4` (Public Mesh)\n\n## 3) Public Endpoints (Public Cluster)\n\n- **RPC:** `https://rpc.ynxweb4.com`\n- **EVM RPC:** `https://evm.ynxweb4.com`\n- **gRPC:** `https://grpc.ynxweb4.com`\n- **REST:** `https://rest.ynxweb4.com`\n- **Faucet:** `https://faucet.ynxweb4.com`\n- **Explorer:** `https://explorer.ynxweb4.com`\n- **Indexer:** `https://indexer.ynxweb4.com`\n\n## 4) Major Capabilities\n\n- **Chain Baseline**: EVM-first runtime with Geth-compatible JSON-RPC.\n- **Web4 Sovereignty**: Hierarchical authorization (Owner/Policy/Session).\n- **AI Settlement**: Proof-of-result lifecycle management.\n- **Operator Stack**: One-click bootstrap scripts for validators.\n\n## 5) Onboarding\n\n- [Public Testnet Join Guide](/docs/en/public-testnet-join)\n- [Validator Node Join Guide](/docs/en/validator-node-join)\n- [Consensus Validator Join Guide](/docs/en/consensus-validator-join)\n"
      },
      {
        "id": "en/public-testnet-join",
        "title": "Public Testnet Join Guide",
        "path": "docs/en/V2_PUBLIC_TESTNET_JOIN_GUIDE.md",
        "content": "# YNX v2 Public Testnet Join Guide (Web4 Track)\n\nStatus: active\nAudience: public users, builders, and external validators\nLast updated: 2026-04-19\n\n## 1. Quick Start (Rapid Path)\n\nThe fastest way to join from a clean Linux server is using the official YNX Web4 CLI. This installs the `ynx` binary and all required libraries.\n\n### Join as Full Node (Read-only / Builder)\n```bash\ncurl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash\nexport PATH=\"$HOME/.local/bin:$PATH\"\nynx join --role full-node\n```\n\n### Join as Validator Candidate\n```bash\ncurl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash\nexport PATH=\"$HOME/.local/bin:$PATH\"\nynx join --role validator\n```\n\n> **State Sync Note:** The public testnet join flow defaults to state sync. This is required for current live-testnet compatibility because fresh nodes should sync from the live state snapshot instead of replaying old genesis history.\n\n## 2. Network Basics\n\n- **Network name:** `YNX v2 Public Testnet (Web4 Track)`\n- **Cosmos Chain ID:** `ynx_9102-1`\n- **EVM Chain ID:** `0x238e` (decimal `9102`)\n- **Denom:** `anyxt`\n\n### Public Endpoints\n- **RPC:** `https://rpc.ynxweb4.com`\n- **EVM RPC:** `https://evm.ynxweb4.com`\n- **EVM WS:** `wss://evm-ws.ynxweb4.com`\n- **REST:** `https://rest.ynxweb4.com`\n- **Faucet:** `https://faucet.ynxweb4.com`\n- **Indexer:** `https://indexer.ynxweb4.com`\n- **Explorer:** `https://explorer.ynxweb4.com`\n- **AI Gateway:** `https://ai.ynxweb4.com`\n- **Web4 Hub:** `https://web4.ynxweb4.com`\n\nOfficial repository:\n`https://github.com/JiahaoAlbus/YNX`\n\n## 3. Faucet Usage\nRequest test tokens (`anyxt`) to interact with the network.\n\n```bash\n# Request via curl\ncurl -s \"https://faucet.ynxweb4.com/faucet?address=0x...\" | jq\n```\nOr use the web interface at `https://faucet.ynxweb4.com`.\n\n## 4. Verification\n```bash\n# Check network name and block height\ncurl -s https://rpc.ynxweb4.com/status | jq -r '.result.node_info.network,.result.sync_info.latest_block_height'\n\n# Check service health\ncurl -s https://ai.ynxweb4.com/ready | jq\ncurl -s https://web4.ynxweb4.com/ready | jq\n```\n"
      },
      {
        "id": "en/validator-node-join",
        "title": "Validator Node Join (Non-Consensus)",
        "path": "docs/en/V2_VALIDATOR_NODE_JOIN_GUIDE.md",
        "content": "# Validator Node Join Guide (Non-Consensus)\n\nStatus: active\nLast updated: 2026-04-19\n\nThis guide covers running a validator node that is NOT yet bonded for consensus voting. This is a prerequisite step before becoming a bonded validator.\n\n## 1. Setup\nUse the official installer:\n```bash\ncurl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash\nexport PATH=\"$HOME/.local/bin:$PATH\"\n```\n\n## 2. Initialize Validator Profile\n```bash\nynx join --role validator\n```\nThis command will configure the chain-id to `ynx_9102-1` and enable state-sync to the public hub.\n\n## 3. Verify Sync\n```bash\n# Check if the node is catching up\nynx status | jq .SyncInfo.catching_up\n```\nWait until `catching_up` is `false` before proceeding to consensus bonding guides.\n"
      },
      {
        "id": "en/consensus-validator-join",
        "title": "Consensus Validator Join (BONDED)",
        "path": "docs/en/V2_CONSENSUS_VALIDATOR_JOIN_GUIDE.md",
        "content": "# YNX v2 Consensus Validator Join Guide\n\nStatus: active\nLast updated: 2026-04-19\n\n## Prerequisites\n1. A synchronized YNX node (following the Public Testnet Join Guide).\n2. YNX CLI installed.\n\n## 1. Key Creation\nCreate your validator key using the Ethereum secp256k1 key type:\n```bash\n./ynxd keys add validator \\\n  --home \"$YNX_HOME\" \\\n  --keyring-backend os \\\n  --key-type eth_secp256k1\n```\n\n## 2. Submit Create-Validator Transaction (JSON Flow)\n\nGenerate your validator's public key and create the configuration JSON file:\n\n```bash\nPUBKEY=$(./ynxd comet show-validator --home \"$YNX_HOME\")\ncat >/tmp/ynx-create-validator.json <<JSON\n{\n  \"pubkey\": $PUBKEY,\n  \"amount\": \"1000000000000000000anyxt\",\n  \"moniker\": \"<YOUR_MONIKER>\",\n  \"identity\": \"\",\n  \"website\": \"\",\n  \"security\": \"\",\n  \"details\": \"YNX public testnet consensus validator\",\n  \"commission-rate\": \"0.10\",\n  \"commission-max-rate\": \"0.20\",\n  \"commission-max-change-rate\": \"0.01\",\n  \"min-self-delegation\": \"1\"\n}\nJSON\n\n./ynxd tx staking create-validator /tmp/ynx-create-validator.json \\\n  --from validator \\\n  --home \"$YNX_HOME\" \\\n  --keyring-backend os \\\n  --chain-id ynx_9102-1 \\\n  --node http://127.0.0.1:36657 \\\n  --gas 450000 --fees 450000000000000anyxt \\\n  --yes -o json\n```\n\n## 3. Verification\nMonitor your validator signing info:\n```bash\n./ynxd query slashing signing-info $(./ynxd comet show-address) --home \"$YNX_HOME\"\n```\n"
      },
      {
        "id": "en/ynx-v2-ai-settlement-api",
        "title": "AI Settlement API",
        "path": "docs/en/YNX_v2_AI_SETTLEMENT_API.md",
        "content": "\n# YNX v2 AI Settlement API (Draft)\n\nStatus: Draft  \nLast updated: 2026-02-25\n\n## 1. Purpose\n\nThis document defines the first public API surface for the YNX v2 AI settlement workflow.\n\nThe API is designed for:\n\n- AI task publishers\n- AI worker operators\n- verifiers/challengers\n- indexers and explorers\n\n## 2. Job Lifecycle\n\n1. `created`: job posted with reward, deadline, and verification policy.\n2. `committed`: worker submits result hash / attestation pointer.\n3. `revealed`: optional reveal payload submitted.\n4. `challenged`: challenger opens a dispute with stake.\n5. `finalized`: reward payout or slash resolution.\n\n## 3. Canonical Data Model\n\n- `job_id` (string)\n- `creator` (address)\n- `worker` (address, optional before commitment)\n- `vault_id` (string, optional funding source)\n- `reward` (base denom amount)\n- `stake` (base denom amount)\n- `input_uri` (off-chain pointer)\n- `result_hash` (hex)\n- `attestation_uri` (optional)\n- `status` (enum)\n- `created_height` / `finalized_height`\n- `payout_payment_id` (string, set when reward is settled from vault)\n\n## 4. Suggested Endpoints\n\n- `POST /ai/jobs` — create job\n- `GET /ai/jobs/:id` — job detail\n- `POST /ai/jobs/:id/commit` — commit result\n- `POST /ai/jobs/:id/challenge` — open dispute\n- `POST /ai/jobs/:id/finalize` — finalize settlement\n- `GET /ai/stats` — aggregate metrics\n- `POST /ai/vaults` — create machine-payment vault\n- `GET /ai/vaults/:id` — vault detail\n- `POST /ai/vaults/:id/deposit` — increase vault balance\n- `POST /ai/payments/quote` — quote payment amount\n- `POST /ai/payments/charge` — execute charge from vault\n- `GET /x402/resource` — x402-style paywalled resource\n\n## 5. Security Requirements\n\n- Every state transition MUST be authorized by signer address.\n- Challenge windows MUST be explicit and time-bounded.\n- Reward release MUST happen only after finalization.\n- Slash decisions MUST be reproducible from on-chain data.\n- Vault spend MUST be bounded by per-payment and per-day limits.\n- x402-style endpoints MUST return deterministic payment requirements when unpaid.\n- Settlement actions MUST be audit-recorded.\n\n## 6. Rollout Policy\n\n- v2 public testnet uses this API as integration contract.\n- Breaking changes MUST increment version and include migration notes.\n"
      },
      {
        "id": "en/ynx-v2-web4-api",
        "title": "Web4 API Reference",
        "path": "docs/en/YNX_v2_WEB4_API.md",
        "content": "\n# YNX v2 Web4 API Reference\n\nStatus: Active  \nLast updated: 2026-03-07\n\n## 1. Model\n\nYNX v2 Web4 APIs follow sovereignty order:\n\n1. Owner (root authority)\n2. Policy (budget + action boundaries)\n3. Session (short-lived delegated capability)\n4. Agent action (must pass policy/session checks)\n\n## 2. Headers\n\n- `content-type: application/json`\n- `x-ynx-owner: <owner secret or owner id>` (owner actions)\n- `x-ynx-session: <session token>` (delegated actions)\n\n## 3. Wallet Bootstrap\n\n- `POST /web4/wallet/bootstrap`\n  - Creates bootstrap challenge and wallet bootstrap record\n- `POST /web4/wallet/verify`\n  - Confirms bootstrap with signature-like proof and returns API key\n\n## 4. Policy and Session\n\n- `GET /web4/policies`\n- `POST /web4/policies`\n  - Creates policy with limits:\n    - `max_total_spend`\n    - `max_daily_spend`\n    - `max_children`\n    - `replicate_cooldown_sec`\n- `GET /web4/policies/:policy_id`\n- `POST /web4/policies/:policy_id/sessions` (owner header required)\n- `POST /web4/policies/:policy_id/pause` (owner header required)\n- `POST /web4/policies/:policy_id/resume` (owner header required)\n- `POST /web4/policies/:policy_id/revoke` (owner header required)\n\n## 5. Identity and Agent\n\n- `GET /web4/identities`\n- `POST /web4/identities` (session required when policy enforced)\n- `GET /web4/agents`\n- `POST /web4/agents` (session required when policy enforced)\n- `GET /web4/agents/:agent_id`\n- `POST /web4/agents/:agent_id/self-update`\n  - Allowed patch fields: `name`, `model`, `endpoint`, `capabilities`\n- `POST /web4/agents/:agent_id/replicate`\n  - Creates child agent under policy constraints\n\n## 6. Intent Lifecycle\n\n- `GET /web4/intents`\n- `POST /web4/intents`\n- `GET /web4/intents/:intent_id`\n- `POST /web4/intents/:intent_id/claim`\n- `POST /web4/intents/:intent_id/challenge`\n- `POST /web4/intents/:intent_id/finalize`\n\n## 7. Observability\n\n- `GET /health`\n- `GET /web4/overview`\n- `GET /web4/stats`\n- `GET /web4/audit`\n\n## 8. Error Patterns\n\nCommon error strings:\n\n- `policy_required`\n- `policy_action_denied`\n- `session_required`\n- `invalid_session`\n- `session_expired`\n- `session_spend_exceeded`\n- `replication_limit_reached`\n- `replication_cooldown`\n"
      },
      {
        "id": "en/ynx-v2-web4-spec",
        "title": "Protocol Specification",
        "path": "docs/en/YNX_v2_WEB4_SPEC.md",
        "content": "\n# YNX Protocol Specification (v2 Web4 Track)\n\nStatus: Active Draft  \nVersion: v2.0-draft  \nLast updated: 2026-02-25  \nCanonical language: English\n\n## 0. Normative Language\n\nThe key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this document are to be interpreted as described in RFC 2119.\n\n## 1. Scope\n\nYNX v2 is defined as an **AI-native Web4 execution chain**:\n\n- Ethereum-grade developer compatibility\n- Solana-class performance targets\n- Fully on-chain governance and treasury control\n- Decentralized validator participation\n- Native AI workload settlement and verification rails\n\nThe v2 track is a protocol reset track, not a minor patch of v1.\n\n## 2. Product Positioning\n\n### 2.1 One-line Positioning\n\nYNX v2 is a **Web4 chain for AI applications** with **EVM-first developer experience** and **high-throughput low-latency execution**.\n\n### 2.2 Target Users\n\n- AI agent and AI application developers\n- Real-time consumer dApp teams\n- Operators who need transparent governance and predictable fees\n- Validator operators joining an open network\n\n## 3. Design Goals and SLOs\n\n### 3.1 Performance Goals\n\n- UX confirmation SHOULD target **≤ 1s** for normal network conditions.\n- Final confirmation SHOULD target **2–4s regional** and **≤ 6s cross-region**.\n- Throughput SHOULD scale via parallel execution and multi-lane mempool design.\n\n### 3.2 Developer Experience Goals\n\n- Ethereum JSON-RPC compatibility MUST remain first-class.\n- Smart contract deployment flow MUST stay compatible with mainstream EVM tools.\n- Account abstraction and sponsored gas flow SHOULD be native protocol capabilities.\n\n### 3.3 AI/Web4 Goals\n\n- The chain MUST support AI task settlement (task registration, result commitment, reward/penalty settlement).\n- AI execution MAY happen off-chain, but result integrity MUST be verifiable on-chain (proofs, attestations, or stake-backed challenge flow).\n- AI-specific economic primitives (job deposits, slashing, dispute windows) MUST be governance-controlled and auditable.\n- Machine-payment flows SHOULD support HTTP 402/x402 shape for service-to-service usage.\n\n### 3.4 Decentralization Goals\n\n- Validator onboarding MUST stay permissionless.\n- Governance changes MUST be on-chain with transparent timelocks.\n- Network health and validator liveness MUST be externally observable via public APIs.\n\n### 3.5 Sovereignty Goals\n\n- User sovereignty MUST remain superior to agent autonomy.\n- The control order MUST be: **Owner > Policy > Session Key > Agent Action**.\n- Owner MUST have immediate pause/revoke authority for all delegated sessions.\n- Delegated session credentials MUST be time-bounded and scope-bounded.\n\n## 4. Architecture Overview\n\n### 4.1 Execution Layer\n\n- EVM compatibility is retained.\n- v2 introduces a **parallel execution roadmap**:\n  - conflict-aware transaction scheduling,\n  - deterministic execution lanes,\n  - state-commit integrity checks.\n\n### 4.2 Consensus Layer\n\n- BFT finality remains the baseline for deterministic final confirmation.\n- Consensus parameters are profile-based:\n  - fast profile (regional low-latency),\n  - resilient profile (cross-region stability).\n\n### 4.3 Mempool and Fee Market\n\n- Local fee market design SHOULD reduce global fee contention.\n- Base fee + priority fee mechanics remain supported.\n- Sponsored transaction and paymaster-like patterns are v2 first-class goals.\n\n### 4.4 AI Settlement Plane\n\nv2 defines a protocol plane for AI jobs:\n\n- Job creation (demand side)\n- Worker commitment and execution proof submission (supply side)\n- Result acceptance/challenge window\n- Reward and slash settlement\n\n### 4.5 Web4 Sovereignty Plane\n\nThe v2 public track includes machine-operable primitives:\n\n- Wallet bootstrap (`/web4/wallet/bootstrap`, `/web4/wallet/verify`)\n- Policy registry (`/web4/policies`)\n- Session issuance and bounded capability delegation (`/web4/policies/:id/sessions`)\n- Agent controlled self-update (`/web4/agents/:id/self-update`)\n- Agent controlled replication (`/web4/agents/:id/replicate`)\n- Audit log surface (`/web4/audit`)\n\n## 5. Governance and Upgrade Safety\n\n- All critical v2 parameters MUST be modifiable only through on-chain governance.\n- Governance executions MUST be timelocked.\n- A staged release policy MUST be followed:\n  1. devnet\n  2. private testnet\n  3. public testnet\n  4. mainnet candidate\n\n## 6. Compatibility Policy\n\n- v1 and v2 are treated as separate network tracks (different chain-id/genesis).\n- Tooling compatibility with EVM wallets and SDKs MUST be preserved.\n- Any breaking change MUST be documented with migration notes before rollout.\n\n## 7. Security Baseline\n\n- No privileged hidden backdoors.\n- Validator and operator key material MUST never be committed.\n- AI settlement logic MUST include anti-spam deposits, challenge periods, and slashable misbehavior criteria.\n- Public observability endpoints MUST be maintained for consensus and governance data.\n- Policy/session controls MUST enforce operation count and spend ceilings.\n- Machine-payment vaults MUST enforce per-payment and per-day limits.\n- Critical autonomous actions MUST be externally auditable.\n\n## 8. Delivery Definition (v2 Public Testnet Exit Criteria)\n\nThe v2 public testnet is considered feature-complete only when:\n\n- Stable block production under multi-validator operation\n- Public RPC/EVM RPC/indexer/explorer/faucet availability\n- AI task settlement endpoints exposed and documented\n- Governance proposal flow validated end-to-end\n- Incident response and watchdog automation active\n"
      }
    ]
  },
  {
    "title": "公测网指南 (中文)",
    "items": [
      {
        "id": "zh/release-notes",
        "title": "YNXWEB4 版本说明",
        "path": "docs/zh/YNXWEB4_版本说明.md",
        "content": "# YNXWEB4 版本说明\n\n发布名：`ynxweb4`  \n赛道：`v2-web4`  \n状态：公开测试网稳定版 (公共集群)  \n发布日期：2026-04-28\n\n## 1）概述\n\n`ynxweb4` 是 YNX Web4 公开测试网的整合发布版本。基础设施已过全面优化，以提升全球性能与成本效率。\n\n## 2）网络参数\n\n- Cosmos Chain ID：`ynx_9102-1`\n- EVM Chain ID：`0x238e`（9102）\n- 代币单位：`anyxt`\n- 赛道：`v2-web4` (Public Mesh)\n\n## 3）公开端点 (公共集群)\n\n- **RPC:** `https://rpc.ynxweb4.com`\n- **EVM RPC:** `https://evm.ynxweb4.com`\n- **gRPC:** `https://grpc.ynxweb4.com`\n- **REST:** `https://rest.ynxweb4.com`\n- **Faucet:** `https://faucet.ynxweb4.com`\n- **Explorer:** `https://explorer.ynxweb4.com`\n- **Indexer:** `https://indexer.ynxweb4.com`\n\n## 4）核心能力\n\n- **链基线**：EVM 优先运行时，兼容 Geth JSON-RPC。\n- **Web4 主权**：分层授权模型 (Owner/Policy/Session)。\n- **AI 结算**：结果证明生命周期管理。\n- **运维栈**：一键引导脚本支持验证人接入。`"
      },
      {
        "id": "zh/public-testnet-join",
        "title": "公开测试网加入手册",
        "path": "docs/zh/V2_公开测试网加入手册.md",
        "content": "# YNX v2 公开测试网加入手册（Web4 赛道）\n\n状态：active\n适用对象：外部体验用户、开发者、外部验证人\n最后更新：2026-04-19\n\n## 1. 官方 YNX Web4 CLI 安装（推荐）\n\n加入网络最快的方式是使用一键 CLI 安装脚本。该脚本会自动安装 `ynx` 二进制文件及其依赖。\n\n```bash\ncurl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash\nexport PATH=\"$HOME/.local/bin:$PATH\"\n```\n\n## 2. 加入网络\n\n### 快速路径：以全节点身份加入（状态同步）\n此命令将初始化环境并立即从最新的网络快照开始同步。\n\n```bash\nynx join --role full-node\n```\n\n### 验证者路径：以验证者候选人身份加入\n此命令将初始化验证者配置并开始状态同步。之后您需要进行代币质押。\n\n```bash\nynx join --role validator\n```\n\n> **状态同步说明：** 公开测试网的加入流程默认使用状态同步（State Sync）。这是目前公测网兼容性的强制要求，新机器应从活跃网络快照同步，而不是从创世块开始重放历史。\n\n## 3. 网络基础信息\n\n- **网络名称：** `YNX v2 Public Testnet (Web4 Track)`\n- **Cosmos Chain ID：** `ynx_9102-1`\n- **EVM Chain ID：** `0x238e`（十进制 `9102`）\n- **代币单位：** `anyxt`\n\n### 公开端点\n- **RPC:** `https://rpc.ynxweb4.com`\n- **EVM RPC:** `https://evm.ynxweb4.com`\n- **EVM WS:** `wss://evm-ws.ynxweb4.com`\n- **REST:** `https://rest.ynxweb4.com`\n- **Faucet:** `https://faucet.ynxweb4.com`\n- **Indexer:** `https://indexer.ynxweb4.com`\n- **Explorer:** `https://explorer.ynxweb4.com`\n- **AI Gateway:** `https://ai.ynxweb4.com`\n- **Web4 Hub:** `https://web4.ynxweb4.com`\n\n官方仓库：\n`https://github.com/JiahaoAlbus/YNX`\n\n## 4. 水龙头（Faucet）使用\n申请测试币 (`anyxt`) 以在网络中进行交互。\n\n```bash\n# 通过 curl 申请\ncurl -s \"https://faucet.ynxweb4.com/faucet?address=0x...\" | jq\n```\n或者使用 Web 界面：`https://faucet.ynxweb4.com`。\n\n## 5. 节点角色区别\n- **全节点 (Full node)：** 同步并提供 RPC 基础设施服务，不参与区块投票。\n- **共识验证者 (Consensus validator)：** 在链上进行质押并参与区块投票和签名，需要持有并锁定 `anyxt`。\n\n## 6. 验证命令\n```bash\ncurl -s https://rpc.ynxweb4.com/status | jq -r '.result.node_info.network,.result.sync_info.latest_block_height'\n```\n"
      },
      {
        "id": "zh/validator-node-join",
        "title": "验证节点加入手册 (非共识)",
        "path": "docs/zh/V2_验证节点加入手册.md",
        "content": "# 验证节点加入手册 (非共识)\n\n状态：active\n最后更新：2026-04-19\n\n本手册涵盖了运行尚未通过质押参与共识投票的验证人节点。这是成为正式共识验证人的前提步骤。\n\n## 1. 环境准备\n使用官方安装程序：\n```bash\ncurl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash\nexport PATH=\"$HOME/.local/bin:$PATH\"\n```\n\n## 2. 初始化验证者配置文件\n```bash\nynx join --role validator\n```\n该命令将：\n- 配置 Chain ID 为 `ynx_9102-1`\n- 开启针对中心节点的状态同步\n- 设置本地环境和种子节点\n\n## 3. 验证同步状态\n```bash\n# 检查节点是否正在同步\nynx status | jq .SyncInfo.catching_up\n```\n在 `catching_up` 为 `false` 之前，请勿进行后续的共识质押操作。\n"
      },
      {
        "id": "zh/consensus-validator-join",
        "title": "共识验证人加入手册 (BONDED)",
        "path": "docs/zh/V2_共识验证人加入手册.md",
        "content": "# YNX v2 共识验证人加入手册\n\n状态：active\n最后更新：2026-04-19\n\n## 前提条件\n1. 已同步且运行正常的 YNX 节点（参考公开测试网加入手册）。\n2. 已安装 YNX CLI。\n\n## 1. 服务器配置\n如果您尚未初始化节点：\n```bash\nynx join --role validator\n```\n\n## 2. 密钥管理\n使用 Ethereum secp256k1 密钥类型创建验证者密钥：\n```bash\n./ynxd keys add validator \\\n  --home \"$YNX_HOME\" \\\n  --keyring-backend os \\\n  --key-type eth_secp256k1\n```\n\n## 3. 申请资金\n从水龙头申请代币以支付质押和交易费用：\n```bash\nVAL_ADDR=$(./ynxd keys show validator -a --keyring-backend os --home \"$YNX_HOME\")\ncurl -s \"https://faucet.ynxweb4.com/faucet?address=${VAL_ADDR}\" | jq\n```\n\n## 4. 提交验证者创建交易\n准备验证者 JSON 配置文件并提交交易。请务必使用指定的 Gas/Fees 参数以确保公测网兼容性。\n\n```bash\n# 创建验证者命令示例\n./ynxd tx staking create-validator /tmp/ynx-create-validator.json \\\n  --from validator \\\n  --home \"$YNX_HOME\" \\\n  --keyring-backend os \\\n  --chain-id ynx_9102-1 \\\n  --node http://127.0.0.1:36657 \\\n  --gas 450000 --fees 450000000000000anyxt \\\n  --yes -o json\n```\n\n> **注意：** 请勿使用 `--gas auto` 或在命令行中使用 `--amount`。请按照官方仓库说明使用 JSON 文件格式。（参数：gas 450k, fees 450T anyxt）\n\n## 5. 状态维护\n监控验证者活跃度：\n```bash\n./ynxd query slashing signing-info $(./ynxd tendermint show-address) --home \"$YNX_HOME\"\n```\n"
      },
      {
        "id": "zh/web4-definition",
        "title": "WEB4 定义",
        "path": "docs/zh/WEB4_在YNX中的定义.md",
        "content": "\n# WEB4 在 YNX v2 中的定义\n\n状态：active  \n最后更新：2026-02-25\n\n## 1. YNX 对 Web4 的定义\n\nYNX v2 的 Web4 不是“给 Web3 套一个 AI 前端”，而是：\n\n- AI Agent 成为一等网络参与者\n- 用户以“意图”驱动交互，而非只靠手动点交易\n- AI 任务执行、结果、争议、结算在链上有可验证闭环\n- 治理与经济参数持续去中心化可审计\n\n## 2. YNX 的 Web4 六个原语\n\n- 身份原语（Identity）\n- Agent 原语（Agent Registry）\n- 意图原语（Intent）\n- 结果声明原语（Claim）\n- 挑战原语（Challenge）\n- 终局结算原语（Finalize/Slash）\n\n## 3. 对外接口\n\n- AI 结算网关：`/ai/*`\n- Web4 协调中心：`/web4/*`\n- 链定位和治理元数据：`/ynx/overview`\n"
      },
      {
        "id": "zh/ynx-v2-web4-api-spec",
        "title": "Web4 API 接口说明",
        "path": "docs/zh/YNX_v2_WEB4_API_接口说明.md",
        "content": "\n# YNX v2 Web4 API 接口说明\n\n状态：active  \n最后更新：2026-03-07\n\n## 1. 权限模型\n\nYNX v2 Web4 API 的执行顺序是：\n\n1. Owner（最高权限）\n2. Policy（边界与预算）\n3. Session（短期授权）\n4. Agent Action（实际动作）\n\n## 2. 请求头\n\n- `content-type: application/json`\n- `x-ynx-owner: <owner secret 或 owner id>`（Owner 级操作）\n- `x-ynx-session: <session token>`（委托操作）\n\n## 3. 钱包自举\n\n- `POST /web4/wallet/bootstrap`\n- `POST /web4/wallet/verify`\n\n## 4. 策略与会话\n\n- `GET /web4/policies`\n- `POST /web4/policies`\n- `GET /web4/policies/:policy_id`\n- `POST /web4/policies/:policy_id/sessions`\n- `POST /web4/policies/:policy_id/pause`\n- `POST /web4/policies/:policy_id/resume`\n- `POST /web4/policies/:policy_id/revoke`\n\n策略支持的关键限制：\n\n- `max_total_spend`\n- `max_daily_spend`\n- `max_children`\n- `replicate_cooldown_sec`\n\n## 5. 身份与 Agent\n\n- `GET /web4/identities`\n- `POST /web4/identities`\n- `GET /web4/agents`\n- `POST /web4/agents`\n- `GET /web4/agents/:agent_id`\n- `POST /web4/agents/:agent_id/self-update`\n- `POST /web4/agents/:agent_id/replicate`\n\n## 6. Intent 生命周期\n\n- `GET /web4/intents`\n- `POST /web4/intents`\n- `GET /web4/intents/:intent_id`\n- `POST /web4/intents/:intent_id/claim`\n- `POST /web4/intents/:intent_id/challenge`\n- `POST /web4/intents/:intent_id/finalize`\n\n## 7. 可观测接口\n\n- `GET /health`\n- `GET /web4/overview`\n- `GET /web4/stats`\n- `GET /web4/audit`\n\n## 8. 常见错误码语义\n\n- `policy_required`\n- `policy_action_denied`\n- `invalid_session`\n- `session_expired`\n- `session_spend_exceeded`\n- `replication_limit_reached`\n- `replication_cooldown`\n"
      },
      {
        "id": "zh/ynx-v2-web4-blueprint",
        "title": "Web4 蓝图",
        "path": "docs/zh/YNX_v2_WEB4_蓝图.md",
        "content": "\n# YNX v2 Web4 蓝图（中文）\n\n状态：active draft  \n最后更新：2026-02-25\n\n## 1. 定位\n\nYNX v2 的目标不是“普通 EVM 链微调”，而是：\n\n- 维持以太坊开发体验（EVM 工具链兼容）\n- 追求高性能低延迟（接近 Solana 类体感）\n- 面向 AI 与 Web4 场景的去中心化结算层\n\n一句话：**AI-native Web4 链，开发体验像 ETH，性能目标向高性能链看齐。**\n\n## 2. 核心目标\n\n- 体感确认目标：正常网络下 ≤ 1s\n- 最终确认目标：区域内 2–4s，跨洲 ≤ 6s\n- 完全链上治理：参数、资金、升级路径可审计\n- 验证人开放加入：持续去中心化\n- AI 任务可结算：任务登记、结果提交、挑战仲裁、奖惩结算\n\n## 3. 架构方向\n\n### 3.1 执行层\n\n- 保留 EVM 兼容\n- 引入并行执行路线（冲突检测 + 多执行通道）\n\n### 3.2 共识层\n\n- 保留 BFT 快终局\n- 使用可切换参数档位：\n  - 快速档（低延迟区域）\n  - 稳定档（跨洲优先）\n\n### 3.3 费用层\n\n- 支持 base fee + priority fee\n- 引入本地费市场思路，降低全局拥堵耦合\n- 面向开发者支持赞助 Gas / AA 路线\n\n### 3.4 AI 结算层\n\n- 任务创建（需求方）\n- 节点执行与结果承诺（供给方）\n- 挑战窗口与争议处理\n- 奖励与惩罚结算\n\n## 4. 与 v1 的关系\n\n- v2 是新轨道，不直接在 v1 公测网上硬改\n- 使用新 chain-id + 新 genesis\n- 先完成 v2 公测网，再进入主网决策\n\n## 5. 当前仓库交付定义\n\n本仓库内“v2 完整轨道”指：\n\n- 有明确 v2 协议规范\n- 有可执行的 v2 启动与配置脚本\n- 有可观测的 v2 对外元数据接口\n- 有可复制的运营/接入文档\n\n主网上线仍需在公测网通过性能与稳定性验收后推进。\n"
      }
    ]
  },
  {
    "title": "OpenAPI Specs",
    "items": [
      {
        "id": "infra-openapi-ynx-v2-ai-yaml",
        "title": "ynx-v2-ai.yaml",
        "path": "infra/openapi/ynx-v2-ai.yaml",
        "content": "\nopenapi: 3.1.0\ninfo:\n  title: YNX v2 AI Settlement API\n  version: 2.0.0\n  description: AI jobs, machine-payment vaults, programmable charges, and x402-style protected resources.\nservers:\n  - url: http://127.0.0.1:38090\npaths:\n  /health:\n    get:\n      summary: AI gateway health\n      responses:\n        \"200\":\n          description: OK\n  /ai/stats:\n    get:\n      summary: AI gateway aggregate stats\n      responses:\n        \"200\":\n          description: OK\n  /ai/jobs:\n    get:\n      summary: List jobs\n      responses:\n        \"200\":\n          description: OK\n    post:\n      summary: Create AI job\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: \"#/components/schemas/CreateJob\"\n      responses:\n        \"201\":\n          description: Created\n  /ai/jobs/{job_id}:\n    get:\n      summary: Get job detail\n      parameters:\n        - in: path\n          name: job_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /ai/jobs/{job_id}/commit:\n    post:\n      summary: Commit AI job result\n      parameters:\n        - in: path\n          name: job_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /ai/jobs/{job_id}/challenge:\n    post:\n      summary: Challenge AI job\n      parameters:\n        - in: path\n          name: job_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /ai/jobs/{job_id}/finalize:\n    post:\n      summary: Finalize AI job\n      parameters:\n        - in: path\n          name: job_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /ai/vaults:\n    get:\n      summary: List machine-payment vaults\n      responses:\n        \"200\":\n          description: OK\n    post:\n      summary: Create machine-payment vault\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: \"#/components/schemas/CreateVault\"\n      responses:\n        \"201\":\n          description: Created\n  /ai/vaults/{vault_id}:\n    get:\n      summary: Get vault detail\n      parameters:\n        - in: path\n          name: vault_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /ai/vaults/{vault_id}/deposit:\n    post:\n      summary: Deposit to vault\n      parameters:\n        - in: path\n          name: vault_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /ai/payments/quote:\n    post:\n      summary: Quote payment requirement\n      responses:\n        \"200\":\n          description: OK\n  /ai/payments/charge:\n    post:\n      summary: Charge a vault\n      responses:\n        \"200\":\n          description: OK\n  /x402/resource:\n    get:\n      summary: Access x402-style protected resource\n      parameters:\n        - in: query\n          name: resource\n          required: false\n          schema:\n            type: string\n        - in: query\n          name: units\n          required: false\n          schema:\n            type: integer\n      responses:\n        \"200\":\n          description: Paid access delivered\n        \"402\":\n          description: Payment required\ncomponents:\n  schemas:\n    CreateJob:\n      type: object\n      properties:\n        creator:\n          type: string\n        worker:\n          type: string\n        vault_id:\n          type: string\n        reward:\n          type: string\n        stake:\n          type: string\n        input_uri:\n          type: string\n    CreateVault:\n      type: object\n      properties:\n        owner:\n          type: string\n        policy_id:\n          type: string\n        balance:\n          type: number\n        max_daily_spend:\n          type: number\n        max_per_payment:\n          type: number\n"
      },
      {
        "id": "infra-openapi-ynx-v2-web4-yaml",
        "title": "ynx-v2-web4.yaml",
        "path": "infra/openapi/ynx-v2-web4.yaml",
        "content": "\nopenapi: 3.1.0\ninfo:\n  title: YNX v2 Web4 API\n  version: 2.0.0\n  description: Wallet bootstrap, sovereignty policies, session delegation, agents, intents, and audit surfaces.\nservers:\n  - url: http://127.0.0.1:38091\npaths:\n  /health:\n    get:\n      summary: Web4 hub health\n      responses:\n        \"200\":\n          description: OK\n  /web4/overview:\n    get:\n      summary: Web4 overview and positioning\n      responses:\n        \"200\":\n          description: OK\n  /web4/audit:\n    get:\n      summary: Web4 audit stream\n      responses:\n        \"200\":\n          description: OK\n  /web4/wallet/bootstrap:\n    post:\n      summary: Start wallet bootstrap\n      responses:\n        \"201\":\n          description: Created\n  /web4/wallet/verify:\n    post:\n      summary: Complete wallet bootstrap\n      responses:\n        \"200\":\n          description: OK\n  /web4/policies:\n    get:\n      summary: List policies\n      responses:\n        \"200\":\n          description: OK\n    post:\n      summary: Create sovereignty policy\n      parameters:\n        - in: header\n          name: x-ynx-owner\n          required: false\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/policies/{policy_id}:\n    get:\n      summary: Get policy detail\n      parameters:\n        - in: path\n          name: policy_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/policies/{policy_id}/sessions:\n    post:\n      summary: Issue session token\n      parameters:\n        - in: path\n          name: policy_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-owner\n          required: true\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/policies/{policy_id}/pause:\n    post:\n      summary: Pause policy\n      parameters:\n        - in: path\n          name: policy_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-owner\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/policies/{policy_id}/resume:\n    post:\n      summary: Resume policy\n      parameters:\n        - in: path\n          name: policy_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-owner\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/policies/{policy_id}/revoke:\n    post:\n      summary: Revoke policy and sessions\n      parameters:\n        - in: path\n          name: policy_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-owner\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/identities:\n    get:\n      summary: List identities\n      responses:\n        \"200\":\n          description: OK\n    post:\n      summary: Create identity\n      parameters:\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/agents:\n    get:\n      summary: List agents\n      responses:\n        \"200\":\n          description: OK\n    post:\n      summary: Create agent\n      parameters:\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/agents/{agent_id}:\n    get:\n      summary: Get agent detail\n      parameters:\n        - in: path\n          name: agent_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/agents/{agent_id}/self-update:\n    post:\n      summary: Update allowlisted agent fields\n      parameters:\n        - in: path\n          name: agent_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/agents/{agent_id}/replicate:\n    post:\n      summary: Replicate child agent under policy constraints\n      parameters:\n        - in: path\n          name: agent_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/intents:\n    get:\n      summary: List intents\n      responses:\n        \"200\":\n          description: OK\n    post:\n      summary: Create intent\n      parameters:\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/intents/{intent_id}:\n    get:\n      summary: Get intent detail\n      parameters:\n        - in: path\n          name: intent_id\n          required: true\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/intents/{intent_id}/claim:\n    post:\n      summary: Claim intent execution\n      parameters:\n        - in: path\n          name: intent_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"201\":\n          description: Created\n  /web4/intents/{intent_id}/challenge:\n    post:\n      summary: Challenge intent result\n      parameters:\n        - in: path\n          name: intent_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n  /web4/intents/{intent_id}/finalize:\n    post:\n      summary: Finalize intent\n      parameters:\n        - in: path\n          name: intent_id\n          required: true\n          schema:\n            type: string\n        - in: header\n          name: x-ynx-session\n          required: false\n          schema:\n            type: string\n      responses:\n        \"200\":\n          description: OK\n"
      }
    ]
  }
];
