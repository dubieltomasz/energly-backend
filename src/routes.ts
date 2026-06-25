import { Router } from 'express';
import { getGenerationMix, getOptimalWindow } from './controller';

const router = Router();

router.get('/generation-mix', getGenerationMix);
router.get('/optimal-window', getOptimalWindow);

export default router;