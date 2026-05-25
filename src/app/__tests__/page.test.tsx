import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import { MOCK_CIRCLES, MOCK_TRUST_ANALYSES } from '@/lib/mock-data';

function formatAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

describe('LedgerLoop Home Page', () => {
  it('renders dashboard with stats and headers', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /LedgerLoop/i })).toBeInTheDocument();
    expect(screen.getByText('Total Pool Value')).toBeInTheDocument();
    expect(screen.getByText('Active Circles')).toBeInTheDocument();
    expect(screen.getByText('Avg Trust Score')).toBeInTheDocument();
    expect(screen.getByText('GNN Latency')).toBeInTheDocument();
  });

  it('displays GNN online status and gas cost in the header', () => {
    render(<Home />);

    expect(screen.getByText('GNN ONLINE')).toBeInTheDocument();
    expect(screen.getByText('ARBITRUM SEPOLIA')).toBeInTheDocument();
  });

  it('handles selecting a different savings circle', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /Rotation Schedule — Lagos Traders Pool/i })).toBeInTheDocument();

    const secondCircleButton = screen.getByRole('button', { name: /Medellín Micro-Fund/i });
    fireEvent.click(secondCircleButton);

    expect(screen.getByRole('heading', { name: /Rotation Schedule — Medellín Micro-Fund/i })).toBeInTheDocument();
  });

  it('handles selecting a different trust analysis wallet', () => {
    render(<Home />);

    expect(screen.getAllByText(formatAddress(MOCK_TRUST_ANALYSES[1].walletAddress))[0]).toBeInTheDocument();
    expect(screen.getByText(MOCK_TRUST_ANALYSES[1].recommendation)).toBeInTheDocument();

    const walletButton = screen.getByRole('button', { name: formatAddress(MOCK_TRUST_ANALYSES[0].walletAddress) });
    fireEvent.click(walletButton);

    expect(screen.getByText(MOCK_TRUST_ANALYSES[0].recommendation)).toBeInTheDocument();
  });

  it('covers trustBar and statusBadge helper branches via Lagos circle member rows', () => {
    render(<Home />);

    expect(screen.getByText('Amina K.')).toBeInTheDocument();  // trustScore 94 → emerald
    expect(screen.getByText('Kwame A.')).toBeInTheDocument();  // trustScore 78 → amber
    expect(screen.getByText('Chen W.')).toBeInTheDocument();   // trustScore 45 → red

    const NairobiCircleButton = screen.getByRole('button', { name: /Nairobi Builders/i });
    fireEvent.click(NairobiCircleButton);
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Nairobi Builders/i })).toBeInTheDocument();

    const pendingCircleButton = screen.getByRole('button', { name: /Pending Circle/i });
    fireEvent.click(pendingCircleButton);
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Pending Circle/i })).toBeInTheDocument();
  });

  it('covers the Sovereign Arbitrage trust analysis branch', () => {
    render(<Home />);

    const walletButton = screen.getByRole('button', { name: formatAddress(MOCK_TRUST_ANALYSES[2].walletAddress) });
    fireEvent.click(walletButton);

    expect(screen.getByText(MOCK_TRUST_ANALYSES[2].recommendation)).toBeInTheDocument();
  });

  it('renders the smart contract info section with network details', () => {
    render(<Home />);

    expect(screen.getByText('Smart Contract')).toBeInTheDocument();
    expect(screen.getByText('Arbitrum Sepolia')).toBeInTheDocument();
    expect(screen.getByText('ESCROW')).toBeInTheDocument();
  });

  it('renders the recent events log', () => {
    render(<Home />);

    expect(screen.getByText('Recent Events')).toBeInTheDocument();
    expect(screen.getByText('ContributionDeposited')).toBeInTheDocument();
    expect(screen.getByText('PayoutDisbursed')).toBeInTheDocument();
  });

  it('renders the GNN Trust Scanner wallet selector', () => {
    render(<Home />);

    expect(screen.getByText(/GNN Trust Scanner/i)).toBeInTheDocument();
    MOCK_TRUST_ANALYSES.forEach(a => {
      expect(screen.getByRole('button', { name: formatAddress(a.walletAddress) })).toBeInTheDocument();
    });
  });

  it('renders footer with correct branding', () => {
    render(<Home />);

    expect(screen.getByText(/LedgerLoop.*UOE Summer of Code 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Graph Neural Networks.*Solidity/i)).toBeInTheDocument();
  });

  it('covers statusBadge fallback style when member status is unknown', () => {
    const originalStatus = MOCK_CIRCLES[0].members[0].status;
    MOCK_CIRCLES[0].members[0].status = 'unknown' as unknown as 'paid';

    try {
      render(<Home />);
      expect(screen.getByText('Amina K.')).toBeInTheDocument();
    } finally {
      MOCK_CIRCLES[0].members[0].status = originalStatus;
    }
  });

  it('covers formatAddress fallback for short addresses', () => {
    const originalAddress = MOCK_CIRCLES[0].contractAddress;
    MOCK_CIRCLES[0].contractAddress = 'short';

    try {
      render(<Home />);
      expect(screen.getByText('short')).toBeInTheDocument();
    } finally {
      MOCK_CIRCLES[0].contractAddress = originalAddress;
    }
  });
});

