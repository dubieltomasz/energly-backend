import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGenerationMix, getOptimalWindow } from '../controller';
import * as generationMixService from '../services/generationMixService';
import * as optimalWindowService from '../services/optimalWindowService';
import type { Request, Response } from 'express';

vi.mock('../services/generationMixService');
vi.mock('../services/optimalWindowService');

const mockRes = () => {
    const res = {} as Response;
    res.json = vi.fn().mockReturnValue(res);
    res.status = vi.fn().mockReturnValue(res);
    return res;
};

const mockReq = (query: Record<string, string> = {}) =>
    ({ query } as unknown as Request);

describe('controller', () => {
    beforeEach(() => vi.clearAllMocks());

    describe('getGenerationMix', () => {
        it('returns generation mix data as JSON', async () => {
            const mockData = [{ date: '2024-01-15', generationmix: [], cleanEnergyPercent: 70 }];
            vi.mocked(generationMixService.generationMix).mockResolvedValue(mockData);

            const res = mockRes();
            await getGenerationMix(mockReq(), res);

            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it('returns 500 on service error', async () => {
            vi.mocked(generationMixService.generationMix).mockRejectedValue(new Error('fail'));

            const res = mockRes();
            await getGenerationMix(mockReq(), res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch energy mix' });
        });
    });

    describe('getOptimalWindow', () => {
        const mockWindow = {
            from: '2024-01-15T08:00Z',
            to: '2024-01-15T11:00Z',
            cleanEnergyPercent: 74,
        };

        it('returns optimal window data as JSON', async () => {
            vi.mocked(optimalWindowService.optimalChargingWindow).mockResolvedValue(mockWindow);

            const res = mockRes();
            await getOptimalWindow(mockReq({ hours: '3' }), res);

            expect(optimalWindowService.optimalChargingWindow).toHaveBeenCalledWith(3);
            expect(res.json).toHaveBeenCalledWith(mockWindow);
        });

        it('returns 400 when hours is missing', async () => {
            const res = mockRes();
            await getOptimalWindow(mockReq(), res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 when hours is below 1', async () => {
            const res = mockRes();
            await getOptimalWindow(mockReq({ hours: '0' }), res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 when hours is above 6', async () => {
            const res = mockRes();
            await getOptimalWindow(mockReq({ hours: '7' }), res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 400 when hours is not an integer', async () => {
            const res = mockRes();
            await getOptimalWindow(mockReq({ hours: '2.5' }), res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 500 on service error', async () => {
            vi.mocked(optimalWindowService.optimalChargingWindow).mockRejectedValue(new Error('fail'));

            const res = mockRes();
            await getOptimalWindow(mockReq({ hours: '3' }), res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to find optimal window' });
        });
    });
});
