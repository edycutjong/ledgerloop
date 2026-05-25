import { MOCK_CIRCLES, MOCK_TRUST_ANALYSES, STATS } from '../mock-data';

describe('LedgerLoop Data Integrity', () => {
  describe('Circle membership consistency', () => {
    it('every member across all circles has a unique global ID', () => {
      const allIds = MOCK_CIRCLES.flatMap(c => c.members.map(m => m.id));
      const unique = new Set(allIds);
      expect(unique.size).toBe(allIds.length);
    });

    it('paid members always have non-zero totalContributed', () => {
      MOCK_CIRCLES.forEach(circle => {
        circle.members.filter(m => m.status === 'paid').forEach(m => {
          expect(m.totalContributed).toBeGreaterThan(0);
        });
      });
    });

    it('rotation turns within each circle start at 1 and have no gaps', () => {
      MOCK_CIRCLES.forEach(circle => {
        const sorted = circle.members.map(m => m.rotationTurn).sort((a, b) => a - b);
        sorted.forEach((turn, idx) => {
          expect(turn).toBe(idx + 1);
        });
      });
    });

    it('higher-trust members are assigned earlier rotation turns in Lagos pool', () => {
      const lagos = MOCK_CIRCLES[0];
      const members = [...lagos.members].sort((a, b) => a.rotationTurn - b.rotationTurn);
      for (let i = 0; i < members.length - 1; i++) {
        expect(members[i].trustScore).toBeGreaterThanOrEqual(members[i + 1].trustScore);
      }
    });

    it('currentRound is always <= totalRounds', () => {
      MOCK_CIRCLES.forEach(circle => {
        expect(circle.currentRound).toBeLessThanOrEqual(circle.totalRounds);
        expect(circle.currentRound).toBeGreaterThanOrEqual(1);
      });
    });

    it('settled circles have currentRound equal to totalRounds', () => {
      const settled = MOCK_CIRCLES.filter(c => c.status === 'settled');
      settled.forEach(c => {
        expect(c.currentRound).toBe(c.totalRounds);
      });
    });
  });

  describe('Trust analysis consistency', () => {
    it('wallet addresses in trust analyses appear in at least one circle', () => {
      const allWallets = new Set(
        MOCK_CIRCLES.flatMap(c => c.members.map(m => m.address))
      );
      MOCK_TRUST_ANALYSES.forEach(a => {
        expect(allWallets.has(a.walletAddress)).toBe(true);
      });
    });

    it('high cyclic loop score correlates with high risk level', () => {
      MOCK_TRUST_ANALYSES.forEach(a => {
        if (a.cyclicLoopScore > 0.8) {
          expect(a.riskLevel).toBe('high');
        }
      });
    });

    it('low cyclic loop score correlates with low risk level', () => {
      MOCK_TRUST_ANALYSES.forEach(a => {
        if (a.cyclicLoopScore < 0.1) {
          expect(a.riskLevel).toBe('low');
        }
      });
    });
  });

  describe('Stats cross-validation', () => {
    it('STATS.totalPoolValue equals sum of non-pending circle pool sizes', () => {
      const nonPendingTotal = MOCK_CIRCLES
        .filter(c => c.status !== 'pending')
        .reduce((sum, c) => sum + c.poolSize, 0);
      expect(STATS.totalPoolValue).toBe(nonPendingTotal);
    });

    it('STATS.activeCircles matches active circle count', () => {
      const activeCount = MOCK_CIRCLES.filter(c => c.status === 'active').length;
      expect(STATS.activeCircles).toBe(activeCount);
    });

    it('STATS.settledCircles matches settled circle count', () => {
      const settledCount = MOCK_CIRCLES.filter(c => c.status === 'settled').length;
      expect(STATS.settledCircles).toBe(settledCount);
    });
  });
});
