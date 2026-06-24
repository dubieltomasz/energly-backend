import { Router } from 'express';
import {energyMix} from './service';

const router = Router();

router.get('/energy-mix', (req, res) => {
  res.send(energyMix());
});
router.get('/optimal-window', (req, res) => {
  res.send('Witaj na optimal-window!');
});

export default router;