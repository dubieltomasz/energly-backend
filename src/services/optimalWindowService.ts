import { CleanEnergySource, GenerationInterval, OptimalWindow } from "../types";
import { fetchDay } from "./utils";

function calculateIntervalCleanEnergy(interval: GenerationInterval): number {
    const total = interval.generationmix
        .filter(({ fuel }) => Object.values(CleanEnergySource).includes(fuel as CleanEnergySource))
        .reduce((sum, { perc }) => sum + perc, 0);

    return Math.round(total * 10) / 10;
    }

async function fetchTwoDays(): Promise<GenerationInterval[]> {
    const requests = Array.from({ length: 2 }, (_, i) => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + i);
        return fetchDay(date);
    });

    const responses = await Promise.all(requests);
    return responses.flatMap(response => response.data);
}

export async function optimalChargingWindow(hours: number): Promise<OptimalWindow> {
    const intervalCount = hours * 2;
    const intervals = await fetchTwoDays();

    let bestStart = 0;
    let bestCleanEnergy = -1;

    for (let i = 0; i <= intervals.length - intervalCount; i++) {
        const window = intervals.slice(i, i + intervalCount);
        const avgCleanEnergy =
        window.reduce((sum, interval) => sum + calculateIntervalCleanEnergy(interval), 0) / intervalCount;

        if (avgCleanEnergy > bestCleanEnergy) {
        bestCleanEnergy = avgCleanEnergy;
        bestStart = i;
        }
    }

    const bestWindow = intervals.slice(bestStart, bestStart + intervalCount);

    return {
        from: bestWindow[0].from,
        to: bestWindow[bestWindow.length - 1].to,
        cleanEnergyPercent: Math.round(bestCleanEnergy * 10) / 10,
    };
}