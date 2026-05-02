# AI/Web4 官方演示

YNX AI/Web4 不是一个聊天机器人的套壳。它是为 AI Agent 打造的有边界执行和结算流程。

用户给 AI Agent 一个有限授权，Agent 完成任务后，通过 YNX 的 AI 结算层自动付款。

## 运行

```bash
./scripts/ai_web4_settlement_demo.sh
```

## 流程

1. 创建 Web4 Policy
2. 签发受限的 Session Key
3. 创建 AI 支付金库
4. 发布 AI 任务
5. Worker 提交结果哈希
6. Finalize (结算) 任务
7. 从金库释放奖励

JSON 证据会写入 `output/ai_web4_demo/<run-id>/`

## 证明了什么？

- Owner 控制 Policy。
- Policy 限制了支出和允许的操作。
- Session Key 允许 AI Agent 在明确的限制内行动。
- AI Gateway 处理任务、结果提交、Finalize 和奖励结算。
- 金库提供机器支付预算。
- 审计和状态接口使工作流可检查。
