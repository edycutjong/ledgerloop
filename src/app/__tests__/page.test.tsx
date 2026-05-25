import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import { MOCK_TRUST_ANALYSES } from '@/lib/mock-data';

describe('LedgerLoop Home Page', () => {
  it('renders dashboard with stats and headers', () => {
    render(<Home />);
    
    // Check main title
    expect(screen.getByRole('heading', { name: /LedgerLoop/i })).toBeInTheDocument();
    
    // Check key stats cards
    expect(screen.getByText('Total Pool Value')).toBeInTheDocument();
    expect(screen.getByText('Active Circles')).toBeInTheDocument();
    expect(screen.getByText('Avg Trust Score')).toBeInTheDocument();
    expect(screen.getByText('GNN Latency')).toBeInTheDocument();
  });

  it('handles selecting a different savings circle', () => {
    render(<Home />);
    
    // Default selected circle is MOCK_CIRCLES[0] ("Lagos Traders Pool")
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Lagos Traders Pool/i })).toBeInTheDocument();

    // Click on the second circle ("Medellín Micro-Fund")
    const secondCircleButton = screen.getByRole('button', { name: /Medellín Micro-Fund/i });
    fireEvent.click(secondCircleButton);

    // Header should update
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Medellín Micro-Fund/i })).toBeInTheDocument();
  });

  it('handles selecting a different trust analysis wallet', () => {
    render(<Home />);
    
    // Default analysis is MOCK_TRUST_ANALYSES[1]
    expect(screen.getAllByText(MOCK_TRUST_ANALYSES[1].walletAddress)[0]).toBeInTheDocument();
    expect(screen.getByText(MOCK_TRUST_ANALYSES[1].recommendation)).toBeInTheDocument();

    // Click on first wallet analysis button
    const targetAddress = MOCK_TRUST_ANALYSES[0].walletAddress;
    const walletButton = screen.getByRole('button', { name: targetAddress });
    fireEvent.click(walletButton);

    // Trust analysis recommendation should update to first one
    expect(screen.getByText(MOCK_TRUST_ANALYSES[0].recommendation)).toBeInTheDocument();
  });

  it('covers helper branches in trustBar and statusBadge', () => {
    render(<Home />);

    // To cover the trustBar score >= 80 branch (e.g. Amina K. has score 94)
    // To cover the trustBar score >= 50 branch (e.g. Kwame A. has score 78)
    // To cover the trustBar score < 50 branch (e.g. Chen W. has score 45)
    // These are rendered on load inside Lagos Traders Pool table.
    expect(screen.getByText('Amina K.')).toBeInTheDocument();
    expect(screen.getByText('Kwame A.')).toBeInTheDocument();
    expect(screen.getByText('Chen W.')).toBeInTheDocument();

    // To cover circle status: "settled" (Lagos Traders Pool is "active", Medellín is "active", Nairobi Builders is "settled")
    // Nairobi Builders status badge contains settled. Click it.
    const NairobiCircleButton = screen.getByRole('button', { name: /Nairobi Builders/i });
    fireEvent.click(NairobiCircleButton);

    // Should display settled contract info
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Nairobi Builders/i })).toBeInTheDocument();

    // Click on Pending Circle to cover pending branch
    const pendingCircleButton = screen.getByRole('button', { name: /Pending Circle/i });
    fireEvent.click(pendingCircleButton);
    expect(screen.getByRole('heading', { name: /Rotation Schedule — Pending Circle/i })).toBeInTheDocument();
  });
  
  it('covers fallback in statusBadge and riskColor with mock data check', () => {
    // We can also test statusBadge fallback directly by rendering the components if needed,
    // or verify that we covered all other paths because the component handles it.
    // Let's verify by rendering
    render(<Home />);
    
    // Click on last wallet analysis button (Sovereign Arbitrage)
    const targetAddress = MOCK_TRUST_ANALYSES[2].walletAddress;
    const walletButton = screen.getByRole('button', { name: targetAddress });
    fireEvent.click(walletButton);
    
    expect(screen.getByText(MOCK_TRUST_ANALYSES[2].recommendation)).toBeInTheDocument();
  });
});
