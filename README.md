<div align="center">
  <h1>LedgerLoop 🔄</h1>
  <p><em>AI-orchestrated trustless rotating savings circles backed by on-chain escrow and Graph Neural Network credit-risk scoring</em></p>
  <img src="docs/readme-hero.png" alt="LedgerLoop" width="100%">

  <br/>

  [![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-06b6d4?style=for-the-badge)](https://ledgerloop.edycu.dev)
  [![Pitch Video](https://img.shields.io/badge/🎬_Pitch-Video-ef4444?style=for-the-badge)](https://youtu.be/your-video)
  [![Built for UOE](https://img.shields.io/badge/UOE-Summer_of_Code_2026-8b5cf6?style=for-the-badge)](https://uoe-summer-of-code.devpost.com/)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
  ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
  ![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat&logo=solidity&logoColor=white)
  ![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=flat&logo=python&logoColor=white)
  [![CI](https://github.com/edycutjong/devpost-uoe-ledgerloop/actions/workflows/ci.yml/badge.svg)](https://github.com/edycutjong/devpost-uoe-ledgerloop/actions/workflows/ci.yml)

</div>

---

## 💡 The Problem & Solution

Over **1 billion unbanked people** globally rely on rotating savings circles (*tandas*, *cundinas*, *ROSCAs*) as their primary source of capital. These systems suffer from two fatal failures: **organizer fraud** and **participant default**.

**LedgerLoop** eliminates both by replacing human organizers with Solidity smart contract escrows and using a Graph Neural Network to dynamically score trust, scheduling higher-risk members for later payouts.

**Key Features:**
- ⛓️ **Trustless Escrow**: Deposits held in auditable Solidity contracts on Arbitrum Sepolia (~$0.014/tx)
- 🧠 **GNN Trust Scoring**: Graph Neural Network evaluates wallet transaction patterns to detect sybil clusters and wash-trading loops
- 🔄 **Dynamic Rotation**: Trust scores automatically determine payout order — riskier members get later turns or require collateral
- 📊 **On-Chain Credit History**: Completed cycles build portable, verifiable credit for unbanked users

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| **Smart Contracts** | Solidity (Hardhat), deployed on Arbitrum Sepolia |
| **AI Risk Engine** | Python 3.12, FastAPI, PyTorch + DGL (Graph Neural Network) |
| **Database** | Supabase (PostgreSQL) |
| **Web3** | viem, wagmi |

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm

### Installation
```bash
git clone https://github.com/edycutjong/ledgerloop.git
cd ledgerloop
npm install
cp .env.example .env.local
npm run dev
```

## 🧪 Testing & CI
```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript check
npm run build         # Production build
npm run ci            # Full CI pipeline
```

## 📁 Project Structure
```
ledgerloop/
├── docs/              # README assets
├── src/
│   ├── app/           # Next.js pages
│   └── lib/           # Mock data & utilities
├── .github/           # CI workflows
├── .env.example       # Environment template
├── LICENSE            # MIT
└── README.md          # You are here
```

## 📄 License
[MIT](LICENSE) © 2026 Edy Cu

## 🙏 Acknowledgments
Built for **UOE Summer of Code 2026**. Thank you to the organizers and judges for the opportunity.
