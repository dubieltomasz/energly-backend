import { GenerationResponse, CleanEnergySource, DayMix, GenerationMixItem } from '../types';
import { fetchData } from './utils';

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