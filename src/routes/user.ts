import { Router } from 'express';
import { getUsers, getUser, createUser } from '../controllers/userController';
import { validateUser } from '../middlewares/validators';

const router = Router();

// Define user routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', validateUser, createUser);

export default router;
