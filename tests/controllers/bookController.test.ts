import { Request, Response, NextFunction } from 'express';
import { getBooks, getBook, createBook } from '../../src/controllers/bookController';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../src/utils/ApiError';

// Mock the PrismaClient module
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
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test to ensure clean slate
  });

  describe('getBooks', () => {
    it('should return a list of books with average scores', async () => {
      const books = [
        {
          id: 1,
          title: 'Book 1',
          Borrow: [{ userScore: 4 }, { userScore: 5 }],
        },
        {
          id: 2,
          title: 'Book 2',
          Borrow: [],
        },
      ];
      (prismaMock.book.findMany as jest.Mock).mockResolvedValue(books);

      await getBooks(req as Request, res as Response, next);

      expect(prismaMock.book.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, title: 'Book 1', averageScore: 4.5 },
        { id: 2, title: 'Book 2', averageScore: null },
      ]);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prismaMock.book.findMany as jest.Mock).mockRejectedValue(error);

      await getBooks(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it('should return a list of books with null averageScore if no borrow records exist', async () => {
      const books = [
        {
          id: 1,
          title: 'Book 1',
          Borrow: [], // No borrow records
        },
      ];
      (prismaMock.book.findMany as jest.Mock).mockResolvedValue(books);

      await getBooks(req as Request, res as Response, next);

      expect(prismaMock.book.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, title: 'Book 1', averageScore: null },
      ]);
    });
    it('should handle borrow records with null or 0 scores correctly', async () => {
      const books = [
        {
          id: 1,
          title: 'Book 1',
          Borrow: [{ userScore: null }, { userScore: 0 }],
        },
      ];
      (prismaMock.book.findMany as jest.Mock).mockResolvedValue(books);
  
      await getBooks(req as Request, res as Response, next);
  
      expect(prismaMock.book.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, title: 'Book 1', averageScore: 0 }, // averageScore should be 0
      ]);
    });
  });

  describe('getBook', () => {
    it('should return a book with its average score if found', async () => {
      req = { params: { id: '1' } };
      const book = {
        id: 1,
        title: 'Book 1',
        Borrow: [{ userScore: 3 }, { userScore: 4 }],
      };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);

      await getBook(req as Request, res as Response, next);

      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        title: 'Book 1',
        averageScore: 3.5,
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

    it('should handle errors', async () => {
      req = { params: { id: '1' } };
      const error = new Error('Database error');
      (prismaMock.book.findUnique as jest.Mock).mockRejectedValue(error);

      await getBook(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it('should return a book with null averageScore if no borrow records exist', async () => {
      req = { params: { id: '1' } };
      const book = {
        id: 1,
        title: 'Book 1',
        Borrow: [], // No borrow records
      };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);

      await getBook(req as Request, res as Response, next);

      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        title: 'Book 1',
        averageScore: null,
      });
    });
    it('should handle errors correctly and pass them to next', async () => {
      req = { params: { id: '1' } };
      const error = new Error('Database error');
  
      (prismaMock.book.findUnique as jest.Mock).mockRejectedValue(error);
  
      await getBook(req as Request, res as Response, next);
  
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(next).toHaveBeenCalledWith(error);
    });
    it('should return a book with null averageScore if borrow records have null or 0 scores', async () => {
      req = { params: { id: '1' } };
      const book = {
        id: 1,
        title: 'Book 1',
        Borrow: [{ userScore: null }, { userScore: 0 }],
      };
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);
  
      await getBook(req as Request, res as Response, next);
  
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { Borrow: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        title: 'Book 1',
        averageScore: 0, // averageScore should be 0
      });
    });

  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      req = { body: { title: 'New Book' } };
      const newBook = { id: 1, title: 'New Book' };
      (prismaMock.book.create as jest.Mock).mockResolvedValue(newBook);

      await createBook(req as Request, res as Response, next);

      expect(prismaMock.book.create).toHaveBeenCalledWith({
        data: { title: 'New Book' },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newBook);
    });

    it('should handle errors', async () => {
      req = { body: { title: 'New Book' } };
      const error = new Error('Database error');
      (prismaMock.book.create as jest.Mock).mockRejectedValue(error);

      await createBook(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
