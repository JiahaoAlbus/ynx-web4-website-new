# AI/Web4 Official Demo

YNX AI/Web4 is not a chatbot wrapper. It is a bounded execution and settlement flow for AI agents.

A user grants an AI agent bounded authority, the agent completes a job, and YNX settles the reward through the AI settlement layer.

## Run

```bash
./scripts/ai_web4_settlement_demo.sh
```

## Flow

1. Create Web4 policy
2. Issue bounded session key
3. Create AI payment vault
4. Publish AI job
5. Worker commits result hash
6. Finalize job
7. Reward settles from vault

JSON evidence is written under `output/ai_web4_demo/<run-id>/`

## What it proves

- Owner controls the policy.
- Policy limits spend and allowed actions.
- Session key lets an AI agent act within explicit limits.
- AI Gateway handles jobs, result commits, finalization, and reward settlement.
- Vaults provide machine-payment budgets.
- Audit and stats endpoints make the workflow inspectable.
