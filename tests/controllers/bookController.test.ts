import { Request, Response, NextFunction } from 'express';
import { getBooks, getBook, createBook } from '../../src/controllers/bookController';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../src/utils/ApiError';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('Book Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBooks', () => {
    it('should return a list of books with their titles', async () => {
      const books = [
        { id: 1, title: 'Book 1', Borrow: [] },
        { id: 2, title: 'Book 2', Borrow: [] },
      ];
        (prismaMock.book.findMany as jest.Mock).mockResolvedValue(books);

      await getBooks(req as Request, res as Response, next);

      expect(prismaMock.book.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
      ]);
    });

    it('should handle errors and pass them to next', async () => {
      const error = new Error('Database error');
      (prismaMock.book.findMany as jest.Mock).mockRejectedValue(error);

      await getBooks(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getBook', () => {
    it('should return a book with its score if found', async () => {
      req = { params: { id: '1' } };
      const book = {
        id: 1,
        title: 'Book 1',
        Borrow: [{ userScore: 5 }, { userScore: 3 }],
      };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);

      await getBook(req as Request, res as Response, next);

      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Book 1',
        score: 4, // Average score (5 + 3) / 2
      });
    });

    it('should return a book with score -1 if no Borrow records are found', async () => {
      req = { params: { id: '1' } };
      const book = {
        id: 1,
        title: 'Book 1',
        Borrow: [],
      };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);

      await getBook(req as Request, res as Response, next);

      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Book 1',
        score: -1,
      });
    });

    it('should throw NotFoundError if book is not found', async () => {
      req = { params: { id: '999' } };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(null);

      await getBook(req as Request, res as Response, next);

      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: { Borrow: true },
      });
      expect(next).toHaveBeenCalledWith(new NotFoundError('Book not found'));
    });

    it('should handle errors and pass them to next', async () => {
      req = { params: { id: '1' } };
      const error = new Error('Database error');
      (prismaMock.book.findUnique as jest.Mock).mockRejectedValue(error);

      await getBook(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should return a book with its score if both barrowed and returned', async () => {
      req = { params: { id: '1' } };
      const book = {
        id: 1,
        title: 'Book 1',
        Borrow: [{ userScore: 5, returnedAt: new Date() }, { userScore: null, returnedAt: null }],
      };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);

      await getBook(req as Request, res as Response, next);

      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Book 1',
        score: 5,
      });
    });
  });

  describe('createBook', () => {
    it('should create a new book and return 201 status', async () => {
      req = { body: { name: 'New Book' } };

      await createBook(req as Request, res as Response, next);

      expect(prismaMock.book.create).toHaveBeenCalledWith({
        data: { title: 'New Book' },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors and pass them to next', async () => {
      req = { body: { name: 'New Book' } };
      const error = new Error('Database error');
      (prismaMock.book.create as jest.Mock).mockRejectedValue(error);

      await createBook(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
