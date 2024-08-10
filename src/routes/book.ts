import { Router } from 'express';
import { getBooks, getBook, createBook } from '../controllers/bookController';
import { validateBook } from '../middlewares/validators';

const router = Router();

/**
 * @swagger
 * tags:
 *   - Books
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   averageScore:
 *                     type: number
 */
router.get('/', getBooks);

/**
 * @swagger
 * tags:
 *   - Books
 * /books/{id}:
 *   get:
 *     summary: Retrieve a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the book to retrieve
 *     responses:
 *       200:
 *         description: A single book
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 averageScore:
 *                   type: number
 */
router.get('/:id', getBook);

/**
 * @swagger
 * tags:
 *   - Books
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', validateBook, createBook);

export default router;
