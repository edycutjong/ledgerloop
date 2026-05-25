// ── Mock data for the LedgerLoop fintech dashboard ──

export interface CircleMember {
  id: string;
  address: string;
  label: string;
  trustScore: number;
  rotationTurn: number;
  status: "paid" | "unpaid" | "pending";
  totalContributed: number;
}

export interface SavingsCircle {
  id: string;
  name: string;
  contractAddress: string;
  creatorAddress: string;
  poolSize: number;
  contributionAmount: number;
  totalRounds: number;
  currentRound: number;
  status: "active" | "pending" | "settled";
  members: CircleMember[];
  createdAt: string;
}

export interface TrustAnalysis {
  walletAddress: string;
  trustScore: number;
  classification: "Merchant Classic" | "Sovereign Arbitrage" | "Wash Syndicate";
  riskLevel: "low" | "medium" | "high";
  transactionCount: number;
  uniqueCounterparties: number;
  cyclicLoopScore: number;
  recommendation: string;
}

export const MOCK_CIRCLES: SavingsCircle[] = [
  {
    id: "c1",
    name: "Lagos Traders Pool",
    contractAddress: "0x7a3B2053702170381734891784910793771Bc82F",
    creatorAddress: "0x123453580537021703817348917849107937abcd",
    poolSize: 10000,
    contributionAmount: 100,
    totalRounds: 10,
    currentRound: 4,
    status: "active",
    createdAt: "2026-05-10T08:00:00Z",
    members: [
      { id: "m1", address: "0xA1c95358053702170381734891784910793771B2", label: "Amina K.", trustScore: 94, rotationTurn: 1, status: "paid", totalContributed: 400 },
      { id: "m2", address: "0xB3d72b83c706d8170385734891784910793722F1", label: "Carlos M.", trustScore: 89, rotationTurn: 2, status: "paid", totalContributed: 400 },
      { id: "m3", address: "0xC5e4e35805370217038173489178491079379A30", label: "Priya R.", trustScore: 82, rotationTurn: 3, status: "paid", totalContributed: 400 },
      { id: "m4", address: "0xD6f1235805370217038173489178491079376B44", label: "Kwame A.", trustScore: 78, rotationTurn: 4, status: "pending", totalContributed: 300 },
      { id: "m5", address: "0xE893535805370217038173489178491079374C58", label: "Sofia L.", trustScore: 72, rotationTurn: 5, status: "unpaid", totalContributed: 300 },
      { id: "m6", address: "0xF985a35805370217038173489178491079372D62", label: "Yuki T.", trustScore: 68, rotationTurn: 6, status: "unpaid", totalContributed: 300 },
      { id: "m7", address: "0xFa0e535805370217038173489178491079370E76", label: "Omar B.", trustScore: 55, rotationTurn: 7, status: "unpaid", totalContributed: 300 },
      { id: "m8", address: "0xFb19535805370217038173489178491079378F80", label: "Chen W.", trustScore: 45, rotationTurn: 8, status: "unpaid", totalContributed: 300 },
      { id: "m9", address: "0xFc2a535805370217038173489178491079376C94", label: "Rosa V.", trustScore: 38, rotationTurn: 9, status: "unpaid", totalContributed: 300 },
      { id: "m10", address: "0x71C2b83c706d8170385734891784910793789c22", label: "FLAGGED", trustScore: 22, rotationTurn: 10, status: "unpaid", totalContributed: 300 },
    ],
  },
  {
    id: "c2",
    name: "Medellín Micro-Fund",
    contractAddress: "0x9cD42053702170381734891784910793771be71A",
    creatorAddress: "0x567853580537021703817348917849107937efgh",
    poolSize: 5000,
    contributionAmount: 50,
    totalRounds: 10,
    currentRound: 7,
    status: "active",
    createdAt: "2026-04-28T14:00:00Z",
    members: [
      { id: "m11", address: "0xda33535805370217038173489178491079374B08", label: "Maria G.", trustScore: 96, rotationTurn: 1, status: "paid", totalContributed: 350 },
      { id: "m12", address: "0xe4a5535805370217038173489178491079372a12", label: "Diego S.", trustScore: 91, rotationTurn: 2, status: "paid", totalContributed: 350 },
      { id: "m13", address: "0xf5a7535805370217038173489178491079370b26", label: "Lucia P.", trustScore: 87, rotationTurn: 3, status: "paid", totalContributed: 350 },
      { id: "m14", address: "0x6b99535805370217038173489178491079378c30", label: "Andrés F.", trustScore: 76, rotationTurn: 4, status: "paid", totalContributed: 350 },
      { id: "m15", address: "0x7a11535805370217038173489178491079376d44", label: "Valentina R.", trustScore: 71, rotationTurn: 5, status: "paid", totalContributed: 350 },
    ],
  },
  {
    id: "c3",
    name: "Nairobi Builders",
    contractAddress: "0xB2e82053702170381734891784910793771ba3F9",
    creatorAddress: "0x9abc53580537021703817348917849107937ijkl",
    poolSize: 20000,
    contributionAmount: 200,
    totalRounds: 10,
    currentRound: 10,
    status: "settled",
    createdAt: "2026-03-15T10:00:00Z",
    members: [
      { id: "m16", address: "0x8a33535805370217038173489178491079374e58", label: "Aisha M.", trustScore: 98, rotationTurn: 1, status: "paid", totalContributed: 2000 },
      { id: "m17", address: "0x9a55535805370217038173489178491079372f62", label: "Brian K.", trustScore: 95, rotationTurn: 2, status: "paid", totalContributed: 2000 },
    ],
  },
  {
    id: "c4",
    name: "Pending Circle",
    contractAddress: "0xe71A2053702170381734891784910793771be71A",
    creatorAddress: "0xda33535805370217038173489178491079374B08",
    poolSize: 1000,
    contributionAmount: 10,
    totalRounds: 10,
    currentRound: 1,
    status: "pending",
    createdAt: "2026-05-20T10:00:00Z",
    members: [
      { id: "m18", address: "0x6b99535805370217038173489178491079378c30", label: "Pending User", trustScore: 70, rotationTurn: 1, status: "pending", totalContributed: 0 },
    ],
  },
];

export const MOCK_TRUST_ANALYSES: TrustAnalysis[] = [
  {
    walletAddress: "0xA1c95358053702170381734891784910793771B2",
    trustScore: 94,
    classification: "Merchant Classic",
    riskLevel: "low",
    transactionCount: 847,
    uniqueCounterparties: 312,
    cyclicLoopScore: 0.02,
    recommendation: "Early rotation slot — low risk, deep network.",
  },
  {
    walletAddress: "0x71C2b83c706d8170385734891784910793789c22",
    trustScore: 22,
    classification: "Wash Syndicate",
    riskLevel: "high",
    transactionCount: 1243,
    uniqueCounterparties: 4,
    cyclicLoopScore: 0.94,
    recommendation: "Last rotation + 50% collateral — sybil loop detected.",
  },
  {
    walletAddress: "0xD6f1235805370217038173489178491079376B44",
    trustScore: 65,
    classification: "Sovereign Arbitrage",
    riskLevel: "medium",
    transactionCount: 523,
    uniqueCounterparties: 87,
    cyclicLoopScore: 0.31,
    recommendation: "Mid-rotation slot — exchange-routed volume.",
  },
];

export const STATS = {
  totalPoolValue: 35000,
  activeCircles: 2,
  settledCircles: 1,
  totalMembers: 17,
  avgTrustScore: 72,
  avgGasCost: 0.014,
  gnnLatencyMs: 42,
};
