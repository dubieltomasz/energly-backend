import { Router } from 'express';

const router = Router();

router.get('/energy-mix', (req, res) => {
  res.send('Witaj na energy-mix!');
});
router.get('/optimal-window', (req, res) => {
  res.send('Witaj na optimal-window!');
});

export default router;