# External Validator Onboarding

YNX public testnet is open to external validator operators.

## Join as full node

```bash
curl -fsSL https://raw.githubusercontent.com/JiahaoAlbus/YNX/main/scripts/install_ynx.sh | bash
export PATH="$HOME/.local/bin:$PATH"
ynx join --role full-node
```

## Join as validator candidate

```bash
ynx join --role validator
```

## Candidate preflight

```bash
scripts/validator_candidate_check.sh --p2p <node_id@host:port>
```

## Notes

- The current public testnet has 4 bonded active validators.
- Testnet tokens have no mainnet value.
- Consensus validator onboarding requires operator review, funding, and stable infrastructure.
