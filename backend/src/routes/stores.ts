import express from 'express';
import { Store, User } from '../models';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all stores
router.get('/', authenticateToken, async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: User, as: 'users' }]
    });
    res.json(stores);
  } catch (error) {
    logger.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Get store by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [{ model: User, as: 'users' }]
    });
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json(store);
  } catch (error) {
    logger.error('Get store error:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

export default router;
