import fetch from 'node-fetch';
import {GenerationResponse, CleanEnergySource, DayMix, GenerationMixItem} from './types';

const url: String = (process.env.API_URL ?? '') + '/generation';

const headers: HeadersInit = {
    'Accept':'application/json'
};

function dateRange(date: Date): {from: string, to: string} {
    date.setUTCHours(0, 1, 0, 0);
    const from: string = date.toISOString().slice(0, 16) + 'Z';

    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + 1);
    const to: string = date.toISOString().slice(0, 16) + 'Z';

    return {from, to};
};

async function fetchData(days: number): Promise<GenerationResponse[]> {
    const requests = Array.from({length: days}, (_, i) => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + i);

        const {from, to} = dateRange(date);

        return fetch(`${url}/${from}/${to}`, { method: 'GET', headers });
    });

    const responses = await Promise.all(requests);

    responses.forEach((response, i) => {
        if (!response.ok) {
            throw new Error(`API error on day ${i + 1}: ${response.status}`);
        }
    });

    return Promise.all(responses.map(response => response.json())) as Promise<GenerationResponse[]>;
};

function averageGenerationMix(intervals: GenerationResponse['data']): GenerationMixItem[] {
    const fuelTotals: Record<string, number> = {};

    intervals.forEach(interval => {
        interval.generationmix.forEach(({ fuel, perc }) => {
            fuelTotals[fuel] = (fuelTotals[fuel] ?? 0) + perc;
        });
    });

    return Object.entries(fuelTotals).map(([fuel, total]) => ({
        fuel,
        perc: Math.round((total / intervals.length) * 10) / 10,
    }));
}

function calculateCleanEnergyPercent(generationmix: GenerationMixItem[]): number {
    const total = generationmix
        .filter(({ fuel }) => Object.values(CleanEnergySource).includes(fuel as CleanEnergySource))
        .reduce((sum, { perc }) => sum + perc, 0);

    return Math.round(total * 10) / 10;
}

function mapToDayMix(day: GenerationResponse): DayMix {
    const intervals = day.data;
    const date = intervals[0].from.slice(0, 10);
    const generationmix = averageGenerationMix(intervals);
    const cleanEnergyPercent = calculateCleanEnergyPercent(generationmix);

    return { date, generationmix, cleanEnergyPercent };
}

export function generationMix(): Promise<DayMix[]> {
    return fetchData(3).then(days => days.map(mapToDayMix));
}