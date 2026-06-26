import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generationMix } from '../services/generationMixService.js';
import * as utils from '../services/utils.js';

vi.mock('../services/utils');

const makeInterval = (from: string, mix: { fuel: string; perc: number }[]) => ({
    from,
    to: from.replace('00:01', '00:30'),
    generationmix: mix,
});

const dayOneIntervals = [
    makeInterval('2024-01-15T00:01Z', [
        { fuel: 'wind', perc: 40 },
        { fuel: 'coal', perc: 30 },
        { fuel: 'solar', perc: 20 },
        { fuel: 'nuclear', perc: 10 },
    ]),
    makeInterval('2024-01-15T00:31Z', [
        { fuel: 'wind', perc: 60 },
        { fuel: 'coal', perc: 10 },
        { fuel: 'solar', perc: 20 },
        { fuel: 'nuclear', perc: 10 },
    ]),
];

const dayTwoIntervals = [
    makeInterval('2024-01-16T00:01Z', [
        { fuel: 'wind', perc: 50 },
        { fuel: 'gas', perc: 50 },
    ]),
];

describe('generationMixService', () => {
    beforeEach(() => vi.clearAllMocks());

    it('returns DayMix array with correct dates', async () => {
        vi.mocked(utils.fetchData).mockResolvedValue([
            { data: dayOneIntervals },
            { data: dayTwoIntervals },
        ]);

        const result = await generationMix();

        expect(result).toHaveLength(2);
        expect(result[0].date).toBe('2024-01-15');
        expect(result[1].date).toBe('2024-01-16');
    });

    it('averages generation mix across intervals', async () => {
        vi.mocked(utils.fetchData).mockResolvedValue([{ data: dayOneIntervals }]);

        const result = await generationMix();
        const wind = result[0].generationmix.find(x => x.fuel === 'wind');

        expect(wind?.perc).toBe(50); // avg of 40 and 60
    });

    it('calculates clean energy percent correctly', async () => {
        vi.mocked(utils.fetchData).mockResolvedValue([{ data: dayOneIntervals }]);

        const result = await generationMix();
        // wind avg=50, solar avg=20, nuclear avg=10 → clean = 80
        expect(result[0].cleanEnergyPercent).toBe(80);
    });

    it('excludes non-clean sources from cleanEnergyPercent', async () => {
        vi.mocked(utils.fetchData).mockResolvedValue([{ data: dayTwoIntervals }]);

        const result = await generationMix();
        // wind=50 is clean, gas=50 is not
        expect(result[0].cleanEnergyPercent).toBe(50);
    });

    it('throws when fetchData fails', async () => {
        vi.mocked(utils.fetchData).mockRejectedValue(new Error('API error'));

        await expect(generationMix()).rejects.toThrow('API error');
    });
});
