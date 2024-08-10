import { Router } from 'express';
import { borrowBook, returnBook } from '../controllers/borrowController';
import { validateBorrow, validateReturn } from '../middlewares/validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   - Borrowing
 * /borrows/users/{id}/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book for a user
 *     tags: [Borrowing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the book to borrow
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: Invalid input or book already borrowed
 *       404:
 *         description: User or book not found
 */
router.post('/users/:id/borrow/:bookId', validateBorrow, borrowBook);

/**
 * @swagger
 * tags:
 *   - Borrowing
 * /borrows/users/{id}/return/{bookId}:
 *   post:
 *     summary: Return a book and provide a rating
 *     tags: [Borrowing]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the book to return
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 description: Rating given to the book by the user
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Book returned and rated successfully
 *       400:
 *         description: Invalid input or book not currently borrowed
 *       404:
 *         description: User or book not found
 */
router.post('/users/:id/return/:bookId', validateReturn, returnBook);

export default router;
