import { MOCK_CIRCLES, MOCK_TRUST_ANALYSES, STATS } from '../mock-data';

describe('LedgerLoop Mock Data', () => {
  describe('MOCK_CIRCLES', () => {
    it('should export MOCK_CIRCLES with correct properties', () => {
      expect(MOCK_CIRCLES).toBeDefined();
      expect(MOCK_CIRCLES.length).toBeGreaterThan(0);
      expect(MOCK_CIRCLES[0].name).toBe('Lagos Traders Pool');
      expect(MOCK_CIRCLES[0].members.length).toBe(10);
    });

    it('should contain exactly 4 circles', () => {
      expect(MOCK_CIRCLES.length).toBe(4);
    });

    it('should contain 2 active circles', () => {
      const active = MOCK_CIRCLES.filter(c => c.status === 'active');
      expect(active.length).toBe(2);
    });

    it('should contain 1 settled circle (Nairobi Builders)', () => {
      const settled = MOCK_CIRCLES.filter(c => c.status === 'settled');
      expect(settled.length).toBe(1);
      expect(settled[0].name).toBe('Nairobi Builders');
      expect(settled[0].currentRound).toBe(settled[0].totalRounds);
    });

    it('should contain 1 pending circle', () => {
      const pending = MOCK_CIRCLES.filter(c => c.status === 'pending');
      expect(pending.length).toBe(1);
    });

    it('should have valid contract addresses for all circles', () => {
      MOCK_CIRCLES.forEach(circle => {
        expect(typeof circle.contractAddress).toBe('string');
        expect(circle.contractAddress.length).toBeGreaterThan(0);
      });
    });

    it('should have members with trust scores between 0 and 100', () => {
      MOCK_CIRCLES.forEach(circle => {
        circle.members.forEach(member => {
          expect(member.trustScore).toBeGreaterThanOrEqual(0);
          expect(member.trustScore).toBeLessThanOrEqual(100);
        });
      });
    });

    it('should have Lagos members ordered by rotation turn 1 through 10', () => {
      const lagos = MOCK_CIRCLES[0];
      const turns = lagos.members.map(m => m.rotationTurn);
      expect(turns).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should have the flagged/riskiest member at last rotation turn', () => {
      const lagos = MOCK_CIRCLES[0];
      const flagged = lagos.members.find(m => m.label === 'FLAGGED');
      expect(flagged).toBeDefined();
      expect(flagged!.trustScore).toBeLessThan(30);
      expect(flagged!.rotationTurn).toBe(10);
    });

    it('should have paid members with positive totalContributed', () => {
      MOCK_CIRCLES.forEach(circle => {
        circle.members.filter(m => m.status === 'paid').forEach(m => {
          expect(m.totalContributed).toBeGreaterThan(0);
        });
      });
    });

    it('should have positive pool sizes and contribution amounts', () => {
      MOCK_CIRCLES.forEach(circle => {
        expect(circle.poolSize).toBeGreaterThan(0);
        expect(circle.contributionAmount).toBeGreaterThan(0);
      });
    });

    it('should have all circles with at least 1 member', () => {
      MOCK_CIRCLES.forEach(circle => {
        expect(circle.members.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should have unique member IDs within each circle', () => {
      MOCK_CIRCLES.forEach(circle => {
        const ids = circle.members.map(m => m.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
      });
    });

    it('should have unique circle IDs', () => {
      const ids = MOCK_CIRCLES.map(c => c.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('should have valid status values for all members', () => {
      const validStatuses = new Set(['paid', 'unpaid', 'pending']);
      MOCK_CIRCLES.forEach(circle => {
        circle.members.forEach(m => {
          expect(validStatuses.has(m.status)).toBe(true);
        });
      });
    });
  });

  describe('MOCK_TRUST_ANALYSES', () => {
    it('should export MOCK_TRUST_ANALYSES with correct properties', () => {
      expect(MOCK_TRUST_ANALYSES).toBeDefined();
      expect(MOCK_TRUST_ANALYSES.length).toBe(3);
      expect(MOCK_TRUST_ANALYSES[0].walletAddress).toBe('0xA1c95358053702170381734891784910793771B2');
    });

    it('should include a Wash Syndicate with high cyclic loop score', () => {
      const syndicate = MOCK_TRUST_ANALYSES.find(a => a.classification === 'Wash Syndicate');
      expect(syndicate).toBeDefined();
      expect(syndicate!.riskLevel).toBe('high');
      expect(syndicate!.cyclicLoopScore).toBeGreaterThan(0.9);
      expect(syndicate!.uniqueCounterparties).toBeLessThan(10);
    });

    it('should include a Merchant Classic with low risk', () => {
      const merchant = MOCK_TRUST_ANALYSES.find(a => a.classification === 'Merchant Classic');
      expect(merchant).toBeDefined();
      expect(merchant!.riskLevel).toBe('low');
      expect(merchant!.trustScore).toBeGreaterThanOrEqual(80);
    });

    it('should have trust scores between 0 and 100', () => {
      MOCK_TRUST_ANALYSES.forEach(a => {
        expect(a.trustScore).toBeGreaterThanOrEqual(0);
        expect(a.trustScore).toBeLessThanOrEqual(100);
      });
    });

    it('should have cyclic loop scores between 0 and 1', () => {
      MOCK_TRUST_ANALYSES.forEach(a => {
        expect(a.cyclicLoopScore).toBeGreaterThanOrEqual(0);
        expect(a.cyclicLoopScore).toBeLessThanOrEqual(1);
      });
    });

    it('should have all three risk levels represented', () => {
      const levels = new Set(MOCK_TRUST_ANALYSES.map(a => a.riskLevel));
      expect(levels.has('low')).toBe(true);
      expect(levels.has('medium')).toBe(true);
      expect(levels.has('high')).toBe(true);
    });

    it('should have non-empty recommendations for all analyses', () => {
      MOCK_TRUST_ANALYSES.forEach(a => {
        expect(typeof a.recommendation).toBe('string');
        expect(a.recommendation.length).toBeGreaterThan(0);
      });
    });
  });

  describe('STATS', () => {
    it('should export STATS with correct properties', () => {
      expect(STATS).toBeDefined();
      expect(STATS.totalPoolValue).toBe(35000);
      expect(STATS.activeCircles).toBe(2);
      expect(STATS.settledCircles).toBe(1);
    });

    it('should have totalMembers of 17 (excluding pending circle)', () => {
      expect(STATS.totalMembers).toBe(17);
    });

    it('should have avgTrustScore between 0 and 100', () => {
      expect(STATS.avgTrustScore).toBeGreaterThan(0);
      expect(STATS.avgTrustScore).toBeLessThanOrEqual(100);
    });

    it('should have a sub-dollar avg gas cost (Arbitrum L2)', () => {
      expect(STATS.avgGasCost).toBeLessThan(1);
      expect(STATS.avgGasCost).toBeGreaterThan(0);
    });

    it('should have GNN latency under 200ms', () => {
      expect(STATS.gnnLatencyMs).toBeLessThan(200);
      expect(STATS.gnnLatencyMs).toBeGreaterThan(0);
    });
  });
});
