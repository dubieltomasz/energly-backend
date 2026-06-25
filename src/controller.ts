import { Request, Response } from 'express';
import { generationMix } from './services/generationMixService';
import { optimalChargingWindow } from './services/optimalWindowService';

export const getGenerationMix = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await generationMix();
        res.json(data);
    } catch {
        res.status(500).json({error: 'Failed to fetch energy mix'});
    }
};

export const getOptimalWindow = async (req: Request, res: Response): Promise<void> => {
    const hours = Number(req.query.hours);

    if (!hours || hours < 1 || hours > 6 || !Number.isInteger(hours)) {
        res.status(400).json({error: 'Hours must be an integer between 1 and 6'});
        return;
    }

    try {
        const data = await optimalChargingWindow(hours);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Failed to find optimal window'});
    }
};