# Security Policy — LedgerLoop

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (current) | ✅ Active |

## Reporting a Vulnerability

If you discover a security vulnerability in LedgerLoop, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@edycu.dev**

Include the following in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

We will acknowledge receipt within **48 hours** and provide an initial assessment within **5 business days**.

## Security Architecture

### Smart Contract Security
- **Escrow Pattern**: All deposits are held in auditable Solidity escrow contracts — no human custodian holds funds
- **Arbitrum Sepolia**: Testnet deployment; production deployment will undergo formal audit before mainnet launch
- **No Admin Keys**: The contract has no privileged admin functions that could drain the pool

### GNN Trust Engine
- **Local Execution**: The Graph Neural Network runs as a local Python daemon — no wallet data is sent to external AI APIs
- **Read-Only Chain Access**: The GNN only reads public on-chain transaction data via RPC; it cannot initiate transactions
- **Score Isolation**: Trust scores are computed locally and stored in Supabase; they do not influence contract state directly without user-initiated transactions

### Data Layer
- **Row-Level Security (RLS)**: All Supabase tables enforce RLS policies — anonymous users have read-only access
- **No PII Storage**: The system stores only public blockchain addresses; no personal identifying information is collected
- **Environment Variables**: All secrets (`SUPABASE_ANON_KEY`, RPC URLs) are stored in `.env.local` and excluded via `.gitignore`

### Frontend
- **No Wallet Private Keys**: The dashboard never requests or stores private keys
- **Client-Side Only**: All Supabase queries use the public `anon` key — no `service_role` key is exposed to the browser

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Sybil attack (fake members) | GNN detects cyclic transaction patterns and flags wash-trading clusters |
| Organizer fraud | Eliminated — funds are held in smart contract escrow, not by a human |
| Credential exposure | `.env.local` excluded from git; only public `anon` key used client-side |
| SQL injection | Supabase SDK uses parameterized queries; no raw SQL in the frontend |
| XSS | Next.js automatically escapes rendered content; no `dangerouslySetInnerHTML` |

## Dependencies

We regularly review dependencies for known vulnerabilities:

```bash
npm audit          # Check for known CVEs
npm audit fix      # Auto-fix where possible
```

## Disclosure Policy

- We follow **coordinated disclosure** practices
- Reporters will be credited in release notes (unless anonymity is requested)
- We do not pursue legal action against good-faith security researchers
