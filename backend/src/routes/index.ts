import express from 'express';
import authRoutes from './auth';
import orderRoutes from './orders';
import perfumeRoutes from './perfumes';
import userRoutes from './users';
import storeRoutes from './stores';
import workerRoutes from './workers';

const router = express.Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/perfumes', perfumeRoutes);
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/workers', workerRoutes);

export default router;
