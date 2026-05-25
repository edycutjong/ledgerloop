import { supabase } from "./supabase";
import type { SavingsCircle, CircleMember, TrustAnalysis } from "./mock-data";

export async function getCircles(): Promise<SavingsCircle[]> {
  const { data: circles, error: cErr } = await supabase
    .from("ll_circles")
    .select("*")
    .order("created_at", { ascending: true });

  if (cErr || !circles) {
    console.error("Failed to fetch circles:", cErr);
    return [];
  }

  const { data: members, error: mErr } = await supabase
    .from("ll_members")
    .select("*")
    .order("rotation_turn", { ascending: true });

  if (mErr || !members) {
    console.error("Failed to fetch members:", mErr);
    return [];
  }

  const membersByCircle = new Map<string, CircleMember[]>();
  for (const m of members) {
    const list = membersByCircle.get(m.circle_id) ?? [];
    list.push({
      id: m.id,
      address: m.address,
      label: m.label,
      trustScore: m.trust_score,
      rotationTurn: m.rotation_turn,
      status: m.status,
      totalContributed: Number(m.total_contributed),
    });
    membersByCircle.set(m.circle_id, list);
  }

  return circles.map((c) => ({
    id: c.id,
    name: c.name,
    contractAddress: c.contract_address,
    creatorAddress: c.creator_address,
    poolSize: Number(c.pool_size),
    contributionAmount: Number(c.contribution_amount),
    totalRounds: c.total_rounds,
    currentRound: c.current_round,
    status: c.status,
    members: membersByCircle.get(c.id) ?? [],
    createdAt: c.created_at,
  }));
}

export async function getTrustAnalyses(): Promise<TrustAnalysis[]> {
  const { data, error } = await supabase
    .from("ll_trust_analyses")
    .select("*");

  if (error || !data) {
    console.error("Failed to fetch trust analyses:", error);
    return [];
  }

  return data.map((a) => ({
    walletAddress: a.wallet_address,
    trustScore: a.trust_score,
    classification: a.classification,
    riskLevel: a.risk_level,
    transactionCount: a.transaction_count,
    uniqueCounterparties: a.unique_counterparties,
    cyclicLoopScore: Number(a.cyclic_loop_score),
    recommendation: a.recommendation,
  }));
}

export interface Stats {
  totalPoolValue: number;
  activeCircles: number;
  settledCircles: number;
  totalMembers: number;
  avgTrustScore: number;
  avgGasCost: number;
  gnnLatencyMs: number;
}

export function computeStats(circles: SavingsCircle[]): Stats {
  const totalPoolValue = circles.reduce((s, c) => s + c.poolSize, 0);
  const activeCircles = circles.filter((c) => c.status === "active").length;
  const settledCircles = circles.filter((c) => c.status === "settled").length;
  const allMembers = circles.flatMap((c) => c.members);
  const totalMembers = allMembers.length;
  const avgTrustScore =
    totalMembers > 0
      ? Math.round(allMembers.reduce((s, m) => s + m.trustScore, 0) / totalMembers)
      : 0;

  return {
    totalPoolValue,
    activeCircles,
    settledCircles,
    totalMembers,
    avgTrustScore,
    avgGasCost: 0.014,
    gnnLatencyMs: 42,
  };
}
