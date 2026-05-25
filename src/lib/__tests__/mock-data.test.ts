import { MOCK_CIRCLES, MOCK_TRUST_ANALYSES, STATS } from '../mock-data';

describe('LedgerLoop Mock Data', () => {
  it('should export MOCK_CIRCLES with correct properties', () => {
    expect(MOCK_CIRCLES).toBeDefined();
    expect(MOCK_CIRCLES.length).toBeGreaterThan(0);
    expect(MOCK_CIRCLES[0].name).toBe('Lagos Traders Pool');
    expect(MOCK_CIRCLES[0].members.length).toBe(10);
  });

  it('should export MOCK_TRUST_ANALYSES with correct properties', () => {
    expect(MOCK_TRUST_ANALYSES).toBeDefined();
    expect(MOCK_TRUST_ANALYSES.length).toBe(3);
    expect(MOCK_TRUST_ANALYSES[0].walletAddress).toBe('0xA1c9...71B2');
  });

  it('should export STATS with correct properties', () => {
    expect(STATS).toBeDefined();
    expect(STATS.totalPoolValue).toBe(35000);
    expect(STATS.activeCircles).toBe(2);
    expect(STATS.settledCircles).toBe(1);
  });
});
