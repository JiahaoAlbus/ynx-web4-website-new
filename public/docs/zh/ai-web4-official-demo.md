# AI/Web4 官方结算演示

状态：活跃
脚本：`./scripts/ai_web4_settlement_demo.sh`

## 概述
用户给 AI Agent 一个有限授权，Agent 完成任务后，通过 YNX 的 AI 结算层自动付款。

## 演示流程
1. **Create Web4 policy**: 创建 Web4 策略。
2. **Issue bounded session key**: 发放受限会话密钥。
3. **Create AI payment vault**: 创建 AI 支付金库。
4. **Publish AI job**: 发布 AI 任务。
5. **Worker commits result hash**: 工作节点提交结果哈希。
6. **Finalize job**: 终局化任务。
7. **Reward settles from vault**: 奖励从金库结算。

JSON 证据存储于 `output/ai_web4_demo/<run-id>/`
