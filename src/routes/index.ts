import { Router } from 'express';
import userRoutes from './user';
import bookRoutes from './book';
import borrowRoutes from './borrow';

const router = Router();

// Borrow routes
router.use('/users', borrowRoutes);

// User routes
router.use('/users', userRoutes);

// Book routes
router.use('/books', bookRoutes);

export default router;
