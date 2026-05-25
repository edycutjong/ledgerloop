import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--surface)] text-[var(--text-high)] p-6">
      <div className="glass-card p-8 max-w-md w-full text-center flex flex-col items-center gap-6 border-cyan-500/20 glow-cyan">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary)] glow-text font-mono">
            404
          </h2>
          <h3 className="text-lg font-semibold text-[var(--text-high)]">
            Circle Out of Bounds
          </h3>
          <p className="text-xs text-[var(--text-low)] font-mono leading-relaxed">
            The requested savings route does not exist. The loop has ended, or the block address is invalid.
          </p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg font-mono text-xs bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)]/20 transition-all duration-200"
        >
          RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
