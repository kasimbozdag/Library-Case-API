import { Router } from 'express';
import userRoutes from './user';
import bookRoutes from './book';
import borrowRoutes from './borrow';

const router = Router();

// User routes
router.use('/users', userRoutes);

// Book routes
router.use('/books', bookRoutes);

// Borrow routes
router.use('/borrows', borrowRoutes);

export default router;
