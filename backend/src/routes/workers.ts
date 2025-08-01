import express from 'express';
import { Worker, Store } from '../models';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all workers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const workers = await Worker.findAll({
      include: [{ model: Store, as: 'store' }]
    });
    res.json(workers);
  } catch (error) {
    logger.error('Get workers error:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// Get worker by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id, {
      include: [{ model: Store, as: 'store' }]
    });
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    
    res.json(worker);
  } catch (error) {
    logger.error('Get worker error:', error);
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

export default router;
