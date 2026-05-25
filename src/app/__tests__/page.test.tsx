import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MOCK_CIRCLES, MOCK_TRUST_ANALYSES } from '@/lib/mock-data';
import { computeStats, getCircles, getTrustAnalyses } from '@/lib/data';

// Mock Supabase client to prevent createClient from crashing without env vars
jest.mock('@/lib/supabase', () => ({
  supabase: {},
}));

// Mock data fetchers to return mock data
jest.mock('@/lib/data', () => {
  const actual = jest.requireActual('@/lib/data');
  const mockData = jest.requireActual('@/lib/mock-data');
  return {
    ...actual,
    getCircles: jest.fn().mockResolvedValue(mockData.MOCK_CIRCLES),
    getTrustAnalyses: jest.fn().mockResolvedValue(mockData.MOCK_TRUST_ANALYSES),
  };
});

import Home from '../page';

const mockedGetCircles = getCircles as jest.Mock;
const mockedGetTrustAnalyses = getTrustAnalyses as jest.Mock;

function formatAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

describe('LedgerLoop Home Page', () => {
  it('renders dashboard with stats and headers', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /LedgerLoop/i })).toBeInTheDocument();
    });
    expect(screen.getByText('Total Pool Value')).toBeInTheDocument();
    expect(screen.getByText('Active Circles')).toBeInTheDocument();
    expect(screen.getByText('Avg Trust Score')).toBeInTheDocument();
    expect(screen.getByText('GNN Latency')).toBeInTheDocument();
  });

  it('displays GNN online status and gas cost in the header', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('GNN ONLINE')).toBeInTheDocument();
    });
    expect(screen.getByText('ARBITRUM SEPOLIA')).toBeInTheDocument();
  });

  it('handles selecting a different savings circle', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Rotation Schedule — Lagos Traders Pool/i })).toBeInTheDocument();
    });

    const secondCircleButton = screen.getByRole('button', { name: /Medellín Micro-Fund/i });
    fireEvent.click(secondCircleButton);

    expect(screen.getByRole('heading', { name: /Rotation Schedule — Medellín Micro-Fund/i })).toBeInTheDocument();
  });

  it('handles selecting a different trust analysis wallet', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByText(formatAddress(MOCK_TRUST_ANALYSES[1].walletAddress))[0]).toBeInTheDocument();
    });
    expect(screen.getByText(MOCK_TRUST_ANALYSES[1].recommendation)).toBeInTheDocument();

    const walletButton = screen.getByRole('button', { name: formatAddress(MOCK_TRUST_ANALYSES[0].walletAddress) });
    fireEvent.click(walletButton);

    expect(screen.getByText(MOCK_TRUST_ANALYSES[0].recommendation)).toBeInTheDocument();
  });

  it('covers trustBar and statusBadge helper branches via Lagos circle member rows', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Amina K.')).toBeInTheDocument();
    });
    expect(screen.getByText('Kwame A.')).toBeInTheDocument();
    expect(screen.getByText('Chen W.')).toBeInTheDocument();

    const NairobiCircleButton = screen.getByRole('button', { name: /Nairobi Builders/i });
    fireEvent.click(NairobiCircleButton);
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Nairobi Builders/i })).toBeInTheDocument();

    const pendingCircleButton = screen.getByRole('button', { name: /Pending Circle/i });
    fireEvent.click(pendingCircleButton);
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Pending Circle/i })).toBeInTheDocument();
  });

  it('covers the Sovereign Arbitrage trust analysis branch', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: formatAddress(MOCK_TRUST_ANALYSES[2].walletAddress) })).toBeInTheDocument();
    });

    const walletButton = screen.getByRole('button', { name: formatAddress(MOCK_TRUST_ANALYSES[2].walletAddress) });
    fireEvent.click(walletButton);

    expect(screen.getByText(MOCK_TRUST_ANALYSES[2].recommendation)).toBeInTheDocument();
  });

  it('renders the smart contract info section with network details', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Smart Contract')).toBeInTheDocument();
    });
    expect(screen.getByText('Arbitrum Sepolia')).toBeInTheDocument();
    expect(screen.getByText('ESCROW')).toBeInTheDocument();
  });

  it('renders the recent events log', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Recent Events')).toBeInTheDocument();
    });
    expect(screen.getByText('ContributionDeposited')).toBeInTheDocument();
    expect(screen.getByText('PayoutDisbursed')).toBeInTheDocument();
  });

  it('renders the GNN Trust Scanner wallet selector', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/GNN Trust Scanner/i)).toBeInTheDocument();
    });
    MOCK_TRUST_ANALYSES.forEach(a => {
      expect(screen.getByRole('button', { name: formatAddress(a.walletAddress) })).toBeInTheDocument();
    });
  });

  it('renders footer with correct branding', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/LedgerLoop.*UOE Summer of Code 2026/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Graph Neural Networks.*Solidity/i)).toBeInTheDocument();
  });

  it('covers computeStats utility', () => {
    const stats = computeStats(MOCK_CIRCLES);
    expect(stats.totalPoolValue).toBeGreaterThan(0);
    expect(stats.activeCircles).toBeGreaterThanOrEqual(0);
    expect(stats.settledCircles).toBeGreaterThanOrEqual(0);
    expect(stats.totalMembers).toBeGreaterThan(0);
    expect(stats.avgTrustScore).toBeGreaterThan(0);
    expect(stats.avgGasCost).toBe(0.014);
    expect(stats.gnnLatencyMs).toBe(42);
  });

  it('covers computeStats with empty circles', () => {
    const stats = computeStats([]);
    expect(stats.totalPoolValue).toBe(0);
    expect(stats.totalMembers).toBe(0);
    expect(stats.avgTrustScore).toBe(0);
  });

  it('renders loading skeleton before data loads', () => {
    mockedGetCircles.mockReturnValueOnce(new Promise(() => {}));

    render(<Home />);
    expect(screen.getByText('Loading from Supabase...')).toBeInTheDocument();
  });

  it('covers the else-if branch when only 1 trust analysis exists', async () => {
    mockedGetTrustAnalyses.mockResolvedValueOnce([MOCK_TRUST_ANALYSES[0]]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(MOCK_TRUST_ANALYSES[0].recommendation)).toBeInTheDocument();
    });
  });

  it('covers statusBadge fallback for unknown status values', async () => {
    const circlesCopy = JSON.parse(JSON.stringify(MOCK_CIRCLES));
    circlesCopy[0].members[0].status = 'unknown';
    mockedGetCircles.mockResolvedValueOnce(circlesCopy);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(circlesCopy[0].members[0].label)).toBeInTheDocument();
    });
  });

  it('covers formatAddress short-address branch via short contractAddress', async () => {
    const circlesCopy = JSON.parse(JSON.stringify(MOCK_CIRCLES));
    circlesCopy[0].contractAddress = 'short';
    mockedGetCircles.mockResolvedValueOnce(circlesCopy);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('short')).toBeInTheDocument();
    });
  });
});
