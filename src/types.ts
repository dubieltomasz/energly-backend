export enum CleanEnergySource {
    Biomass = 'biomass',
    Nuclear = 'nuclear',
    Hydro = 'hydro',
    Wind = 'wind',
    Solar = 'solar',
};

export interface GenerationMixItem {
    fuel: string;
    perc: number;
};

export interface GenerationInterval {
    from: string;
    to: string;
    generationmix: GenerationMixItem[];
};

export interface GenerationResponse {
    data: GenerationInterval[];
};

export interface DayMix {
  date: string;
  generationmix: GenerationMixItem[];
  cleanEnergyPercent: number;
}

export interface OptimalWindow {
    from: string;
    to: string;
    cleanEnergyPercent: number;
}