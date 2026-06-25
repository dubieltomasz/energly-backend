import { GenerationResponse } from "../types";

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

export async function fetchDay(date: Date): Promise<GenerationResponse> {
    const {from, to} = dateRange(date);
    const response = await fetch(`${url}/${from}/${to}`, { method: 'GET', headers: headers });

    if (!response.ok) {
        throw new Error(`API error for ${from}: ${response.status}`);
    }

    return response.json() as Promise<GenerationResponse>;
}

export async function fetchData(days: number): Promise<GenerationResponse[]> {
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