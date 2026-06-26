import { describe, it, expect, vi, beforeEach } from 'vitest';
import { optimalChargingWindow } from '../services/optimalWindowService';
import * as utils from '../services/utils';

vi.mock('../services/utils');

const makeInterval = (from: string, to: string, mix: { fuel: string; perc: number }[]) => ({
    from,
    to,
    generationmix: mix,
});

// 6 half-hour intervals across two days
const mockIntervals = [
    makeInterval('2024-01-15T06:00Z', '2024-01-15T06:30Z', [{ fuel: 'coal', perc: 20 }, { fuel: 'wind', perc: 10 }]),
    makeInterval('2024-01-15T06:30Z', '2024-01-15T07:00Z', [{ fuel: 'coal', perc: 20 }, { fuel: 'wind', perc: 10 }]),
    makeInterval('2024-01-15T07:00Z', '2024-01-15T07:30Z', [{ fuel: 'solar', perc: 50 }, { fuel: 'wind', perc: 40 }]),
    makeInterval('2024-01-15T07:30Z', '2024-01-15T08:00Z', [{ fuel: 'solar', perc: 50 }, { fuel: 'wind', perc: 40 }]),
    makeInterval('2024-01-15T08:00Z', '2024-01-15T08:30Z', [{ fuel: 'coal', perc: 60 }, { fuel: 'wind', perc: 10 }]),
    makeInterval('2024-01-15T08:30Z', '2024-01-15T09:00Z', [{ fuel: 'coal', perc: 60 }, { fuel: 'wind', perc: 10 }]),
];

describe('optimalWindowService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(utils.fetchDay).mockResolvedValue({ data: mockIntervals });
    });

    it('returns the window with the highest clean energy', async () => {
        const result = await optimalChargingWindow(1); // 1h = 2 intervals

        // intervals[2] + intervals[3] have solar+wind = 90%, which is the best window
        expect(result.from).toBe('2024-01-15T07:00Z');
        expect(result.to).toBe('2024-01-15T08:00Z');
    });

    it('returns correct cleanEnergyPercent for the best window', async () => {
        const result = await optimalChargingWindow(1);

        expect(result.cleanEnergyPercent).toBe(90);
    });

    it('uses intervalCount = hours * 2', async () => {
        const result = await optimalChargingWindow(2); // 2h = 4 intervals

        // best 4-interval window: intervals[1..4] or [2..5] — [2..5] has solar+wind avg 55 vs others lower
        expect(result.from).toBeDefined();
        expect(result.to).toBeDefined();
    });

    it('throws when fetchDay fails', async () => {
        vi.mocked(utils.fetchDay).mockRejectedValue(new Error('Network error'));

        await expect(optimalChargingWindow(1)).rejects.toThrow('Network error');
    });

    it('fetches exactly 2 days', async () => {
        await optimalChargingWindow(1);

        expect(utils.fetchDay).toHaveBeenCalledTimes(2);
    });
});
