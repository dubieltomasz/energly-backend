import { Router } from 'express';
import {generationMix} from './service';

const router = Router();

router.get('/generation-mix', async (req, res) => {
    try {
        const data = await generationMix();
        res.json(data);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch energy mix'});
    }
});

router.get('/optimal-window', (req, res) => {
    res.send('Witaj na optimal-window!');
});

export default router;