import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchDay, fetchData } from '../services/utils.js';

const makeMockResponse = (ok: boolean, body: unknown, status = 200) => ({
    ok,
    status,
    json: async () => body,
});

const mockInterval = {
    from: '2024-01-15T00:01Z',
    to: '2024-01-15T00:30Z',
    generationmix: [{ fuel: 'wind', perc: 40 }],
};

const mockGenerationResponse = { data: [mockInterval] };

describe('utils', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('fetchDay', () => {
        it('returns parsed GenerationResponse on success', async () => {
            vi.mocked(fetch).mockResolvedValue(makeMockResponse(true, mockGenerationResponse) as Response);

            const result = await fetchDay(new Date('2024-01-15'));
            expect(result).toEqual(mockGenerationResponse);
        });

        it('throws on non-ok response', async () => {
            vi.mocked(fetch).mockResolvedValue(makeMockResponse(false, {}, 503) as Response);

            await expect(fetchDay(new Date('2024-01-15'))).rejects.toThrow('503');
        });

        it('calls fetch with correct date range in URL', async () => {
            vi.mocked(fetch).mockResolvedValue(makeMockResponse(true, mockGenerationResponse) as Response);

            await fetchDay(new Date('2024-01-15'));

            const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
            expect(calledUrl).toContain('2024-01-15');
        });
    });

    describe('fetchData', () => {
        it('returns array of GenerationResponses for given number of days', async () => {
            vi.mocked(fetch).mockResolvedValue(makeMockResponse(true, mockGenerationResponse) as Response);

            const result = await fetchData(3);
            expect(result).toHaveLength(3);
            expect(result[0]).toEqual(mockGenerationResponse);
        });

        it('throws if any response is not ok', async () => {
            vi.mocked(fetch)
                .mockResolvedValueOnce(makeMockResponse(true, mockGenerationResponse) as Response)
                .mockResolvedValueOnce(makeMockResponse(false, {}, 500) as Response)
                .mockResolvedValueOnce(makeMockResponse(true, mockGenerationResponse) as Response);

            await expect(fetchData(3)).rejects.toThrow('day 2');
        });

        it('makes exactly N fetch calls for N days', async () => {
            vi.mocked(fetch).mockResolvedValue(makeMockResponse(true, mockGenerationResponse) as Response);

            await fetchData(2);
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });
});
