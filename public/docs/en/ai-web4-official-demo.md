# AI/Web4 Official Settlement Demo

Status: active
Script: `./scripts/ai_web4_settlement_demo.sh`

## Overview
A user grants an AI agent bounded authority, the agent completes a job, and YNX settles the reward through the AI settlement layer.

## The Workflow
1. **Create Web4 policy**: The user creates a Web4 policy defining spend limits and allowed actions.
2. **Issue bounded session key**: A bounded session key is issued to the AI agent.
3. **Create AI payment vault**: A machine-payment vault is funded to authorize the agent's budget.
4. **Publish AI job**: Job is published to the AI Gateway.
5. **Worker commits result hash**: Worker commits a result hash.
6. **Finalize job**: Job is finalized.
7. **Reward settles from vault**: Reward is automatically settled from the vault to the worker upon successful finalization.

JSON evidence is written under `output/ai_web4_demo/<run-id>/`
