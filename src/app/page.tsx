"use client";

import { useState, useEffect } from "react";
import {
  type SavingsCircle,
  type TrustAnalysis,
} from "@/lib/mock-data";
import { getCircles, getTrustAnalyses, computeStats, type Stats } from "@/lib/data";

/* ── Utility helpers ── */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function riskColor(level: string) {
  if (level === "low") return "text-emerald-400";
  if (level === "medium") return "text-amber-400";
  return "text-red-400";
}

function statusBadge(s: string) {
  if (s === "active") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (s === "paid") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (s === "unpaid") return "bg-red-500/20 text-red-300 border-red-500/30";
  if (s === "pending") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  if (s === "settled") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  return "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

function trustBar(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-1">
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)]">
        {label}
      </span>
      <span
        className={cn(
          "text-2xl font-bold tracking-tight",
          accent ? "text-[var(--primary)] glow-text" : "text-[var(--text-high)]"
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs font-mono text-[var(--text-low)]">{sub}</span>
      )}
    </div>
  );
}

/* ── Circle Card ── */
function CircleCard({
  circle,
  active,
  onClick,
}: {
  circle: SavingsCircle;
  active: boolean;
  onClick: () => void;
}) {
  const progress = (circle.currentRound / circle.totalRounds) * 100;
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card p-5 text-left w-full transition-all duration-200 hover:border-[var(--primary)]/40",
        active && "border-[var(--primary)]/60 glow-cyan"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[var(--text-high)]">{circle.name}</h3>
        <span
          className={cn(
            "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border",
            statusBadge(circle.status)
          )}
        >
          {circle.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-mid)]">
        <span>{circle.members.length} members</span>
        <span>·</span>
        <span>${circle.poolSize.toLocaleString()} pool</span>
        <span>·</span>
        <span>${circle.contributionAmount}/round</span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-low)] mb-1">
          <span>Round {circle.currentRound}/{circle.totalRounds}</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}

/* ── Trust Analysis Panel ── */
function TrustPanel({ analysis }: { analysis: TrustAnalysis }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-mono text-xs text-[var(--text-low)]">WALLET</span>
          <p className="font-mono text-sm text-[var(--text-high)]">{formatAddress(analysis.walletAddress)}</p>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "text-3xl font-bold",
              analysis.trustScore >= 80 ? "text-emerald-400" :
              analysis.trustScore >= 50 ? "text-amber-400" : "text-red-400"
            )}
          >
            {analysis.trustScore}
          </div>
          <span className="text-[10px] font-mono text-[var(--text-low)]">TRUST SCORE</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-[var(--text-high)]">
            {analysis.transactionCount}
          </div>
          <div className="text-[10px] font-mono text-[var(--text-low)]">TXN COUNT</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-[var(--text-high)]">
            {analysis.uniqueCounterparties}
          </div>
          <div className="text-[10px] font-mono text-[var(--text-low)]">UNIQUE PEERS</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <div className={cn("text-lg font-bold", riskColor(analysis.riskLevel))}>
            {(analysis.cyclicLoopScore * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] font-mono text-[var(--text-low)]">CYCLIC LOOP</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            "text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border",
            analysis.riskLevel === "low"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : analysis.riskLevel === "medium"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          )}
        >
          {analysis.classification}
        </span>
        <span className={cn("text-xs font-mono", riskColor(analysis.riskLevel))}>
          {analysis.riskLevel.toUpperCase()} RISK
        </span>
      </div>
      <p className="text-xs text-[var(--text-mid)] italic">{analysis.recommendation}</p>
    </div>
  );
}

/* ── Member Rotation Table ── */
function MemberTable({ circle }: { circle: SavingsCircle }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-high)]">
          Rotation Schedule — {circle.name}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-[var(--text-low)] text-left border-b border-[var(--border)]">
              <th className="px-5 py-2">TURN</th>
              <th className="px-5 py-2">MEMBER</th>
              <th className="px-5 py-2">WALLET</th>
              <th className="px-5 py-2">TRUST</th>
              <th className="px-5 py-2">STATUS</th>
              <th className="px-5 py-2 text-right">CONTRIBUTED</th>
            </tr>
          </thead>
          <tbody>
            {circle.members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <td className="px-5 py-2.5 text-[var(--text-mid)]">{m.rotationTurn}</td>
                <td className="px-5 py-2.5">
                  <span
                    className={cn(
                      "text-[var(--text-high)]",
                      m.trustScore < 30 && "text-red-400 font-bold"
                    )}
                  >
                    {m.label}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-[var(--text-mid)]">{formatAddress(m.address)}</td>
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", trustBar(m.trustScore))}
                        style={{ width: `${m.trustScore}%` }}
                      />
                    </div>
                    <span className={cn("text-[11px]", riskColor(
                      m.trustScore >= 80 ? "low" : m.trustScore >= 50 ? "medium" : "high"
                    ))}>
                      {m.trustScore}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-2.5">
                  <span
                    className={cn(
                      "text-[10px] uppercase px-2 py-0.5 rounded-full border",
                      statusBadge(m.status)
                    )}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-right text-[var(--text-high)]">
                  ${m.totalContributed.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-[var(--text-low)] animate-pulse">
        Loading from Supabase...
      </span>
    </div>
  );
}

/* ── Main Dashboard Page ── */
export default function Home() {
  const [circles, setCircles] = useState<SavingsCircle[]>([]);
  const [trustAnalyses, setTrustAnalyses] = useState<TrustAnalysis[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedCircle, setSelectedCircle] = useState<SavingsCircle | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<TrustAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [circlesData, trustData] = await Promise.all([
        getCircles(),
        getTrustAnalyses(),
      ]);
      setCircles(circlesData);
      setTrustAnalyses(trustData);
      setStats(computeStats(circlesData));
      if (circlesData.length > 0) setSelectedCircle(circlesData[0]);
      if (trustData.length > 1) setSelectedAnalysis(trustData[1]);
      else if (trustData.length > 0) setSelectedAnalysis(trustData[0]);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !selectedCircle || !selectedAnalysis || !stats) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img src="/icon.svg" alt="LedgerLoop" className="w-full h-full" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-high)]">
            LedgerLoop
          </h1>
          <span className="text-[10px] font-mono text-[var(--text-low)] bg-slate-800 px-2 py-0.5 rounded-full">
            ARBITRUM SEPOLIA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400">GNN ONLINE</span>
          </div>
          <div className="h-4 w-px bg-[var(--border)]" />
          <span className="text-xs font-mono text-[var(--text-low)]">
            Gas: ~${stats.avgGasCost}
          </span>
        </div>
      </header>

      {/* ── Stat Banner ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 p-6">
        <StatCard label="Total Pool Value" value={`$${stats.totalPoolValue.toLocaleString()}`} accent />
        <StatCard label="Active Circles" value={String(stats.activeCircles)} />
        <StatCard label="Settled Circles" value={String(stats.settledCircles)} />
        <StatCard label="Total Members" value={String(stats.totalMembers)} />
        <StatCard label="Avg Trust Score" value={String(stats.avgTrustScore)} sub="/ 100" />
        <StatCard label="Avg Gas Cost" value={`$${stats.avgGasCost}`} sub="per deposit" />
        <StatCard label="GNN Latency" value={`${stats.gnnLatencyMs}ms`} sub="p95" />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 pb-8">
        {/* Left: Circles List */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)]">
              Savings Circles
            </h2>
            <span className="text-[10px] font-mono text-[var(--text-low)]">
              {circles.length} total
            </span>
          </div>
          {circles.map((c) => (
            <CircleCard
              key={c.id}
              circle={c}
              active={selectedCircle.id === c.id}
              onClick={() => setSelectedCircle(c)}
            />
          ))}
        </div>

        {/* Center: Member Rotation Table */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <MemberTable circle={selectedCircle} />

          {/* GNN Trust Scanner */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)] mb-3">
              GNN Trust Scanner — Select Wallet
            </h3>
            <div className="flex gap-2 flex-wrap">
              {trustAnalyses.map((a) => (
                <button
                  key={a.walletAddress}
                  onClick={() => setSelectedAnalysis(a)}
                  className={cn(
                    "text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all",
                    selectedAnalysis.walletAddress === a.walletAddress
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--text-mid)] hover:border-[var(--text-mid)]"
                  )}
                >
                  {formatAddress(a.walletAddress)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Trust Analysis Panel */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)]">
            Trust Analysis
          </h2>
          <TrustPanel analysis={selectedAnalysis} />

          {/* Contract Info */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)] mb-3">
              Smart Contract
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--text-low)]">ADDRESS</span>
                <span className="text-[var(--text-high)]">{formatAddress(selectedCircle.contractAddress)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-low)]">NETWORK</span>
                <span className="text-cyan-400">Arbitrum Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-low)]">ESCROW</span>
                <span className="text-emerald-400">${selectedCircle.poolSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-low)]">STATUS</span>
                <span className={cn(
                  selectedCircle.status === "active" ? "text-emerald-400" :
                  selectedCircle.status === "settled" ? "text-cyan-400" : "text-amber-400"
                )}>
                  {selectedCircle.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div className="glass-card p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-low)] mb-3">
              Recent Events
            </h3>
            <div className="space-y-2">
              {[
                { time: "2m ago", event: "ContributionDeposited", actor: "0xA1c9...71B2", color: "text-emerald-400" },
                { time: "14m ago", event: "TrustScoreUpdated", actor: "0x71C...89c2", color: "text-red-400" },
                { time: "1h ago", event: "PayoutDisbursed", actor: "0xC5e4...9A30", color: "text-cyan-400" },
                { time: "3h ago", event: "MemberJoined", actor: "0xE8g3...4C58", color: "text-violet-400" },
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-[var(--text-low)] w-14">{ev.time}</span>
                  <span className={ev.color}>{ev.event}</span>
                  <span className="text-[var(--text-low)] ml-auto">{ev.actor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] px-6 py-4 flex items-center justify-between text-[10px] font-mono text-[var(--text-low)]">
        <span>© 2026 LedgerLoop — Built for UOE Summer of Code 2026</span>
        <span>Powered by Graph Neural Networks + Solidity Escrow on Arbitrum L2</span>
      </footer>
    </div>
  );
}
