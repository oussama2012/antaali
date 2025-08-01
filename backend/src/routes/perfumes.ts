import express from 'express';
import { Perfume } from '../models';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { perfumeSchema } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all perfumes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const perfumes = await Perfume.findAll({
      order: [['name', 'ASC']]
    });
    res.json(perfumes);
  } catch (error) {
    logger.error('Get perfumes error:', error);
    res.status(500).json({ error: 'Failed to fetch perfumes' });
  }
});

// Get perfume by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume not found' });
    }
    
    res.json(perfume);
  } catch (error) {
    logger.error('Get perfume error:', error);
    res.status(500).json({ error: 'Failed to fetch perfume' });
  }
});

// Create new perfume
router.post('/', authenticateToken, validateRequest(perfumeSchema), async (req, res) => {
  try {
    const perfume = await Perfume.create(req.body);
    logger.info(`Perfume created: ${perfume.name}`);
    res.status(201).json(perfume);
  } catch (error) {
    logger.error('Create perfume error:', error);
    res.status(500).json({ error: 'Failed to create perfume' });
  }
});

// Update perfume
router.put('/:id', authenticateToken, validateRequest(perfumeSchema), async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume not found' });
    }
    
    await perfume.update(req.body);
    logger.info(`Perfume updated: ${perfume.name}`);
    res.json(perfume);
  } catch (error) {
    logger.error('Update perfume error:', error);
    res.status(500).json({ error: 'Failed to update perfume' });
  }
});

// Delete perfume
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const perfume = await Perfume.findByPk(req.params.id);
    
    if (!perfume) {
      return res.status(404).json({ error: 'Perfume not found' });
    }
    
    await perfume.destroy();
    logger.info(`Perfume deleted: ${perfume.name}`);
    res.json({ message: 'Perfume deleted successfully' });
  } catch (error) {
    logger.error('Delete perfume error:', error);
    res.status(500).json({ error: 'Failed to delete perfume' });
  }
});

export default router;
