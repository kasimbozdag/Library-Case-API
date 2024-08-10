import { Request, Response, NextFunction } from 'express';
import { borrowBook, returnBook } from '../../src/controllers/borrowController';
import { PrismaClient } from '@prisma/client';
import { ApiError, NotFoundError } from '../../src/utils/ApiError';

// Mock the PrismaClient module
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
    book: {
      findUnique: jest.fn(),
    },
    borrow: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('Borrow Controller', () => {
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

  describe('borrowBook', () => {
    it('should borrow a book if user and book exist and book is not already borrowed', async () => {
      req = { params: { id: '1', bookId: '1' } };
      const user = { id: 1, name: 'John Doe' };
      const book = { id: 1, title: 'Book 1' };
      const borrow = { id: 1, userId: 1, bookId: 1 };

      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);
      (prismaMock.borrow.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaMock.borrow.create as jest.Mock).mockResolvedValue(borrow);

      await borrowBook(req as Request, res as Response, next);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.borrow.findFirst).toHaveBeenCalledWith({
        where: { bookId: 1, returnedAt: null },
      });
      expect(prismaMock.borrow.create).toHaveBeenCalledWith({
        data: { userId: 1, bookId: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(borrow);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      req = { params: { id: '1', bookId: '1' } };

      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await borrowBook(req as Request, res as Response, next);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });

    it('should throw NotFoundError if book does not exist', async () => {
      req = { params: { id: '1', bookId: '1' } };
      const user = { id: 1, name: 'John Doe' };

      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(null);

      await borrowBook(req as Request, res as Response, next);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(next).toHaveBeenCalledWith(new NotFoundError('Book not found'));
    });

    it('should throw ApiError if book is already borrowed by another user', async () => {
      req = { params: { id: '1', bookId: '1' } };
      const user = { id: 1, name: 'John Doe' };
      const book = { id: 1, title: 'Book 1' };
      const existingBorrow = { id: 1, userId: 2, bookId: 1, returnedAt: null };

      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prismaMock.book.findUnique as jest.Mock).mockResolvedValue(book);
      (prismaMock.borrow.findFirst as jest.Mock).mockResolvedValue(existingBorrow);

      await borrowBook(req as Request, res as Response, next);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.borrow.findFirst).toHaveBeenCalledWith({
        where: { bookId: 1, returnedAt: null },
      });
      expect(next).toHaveBeenCalledWith(new ApiError('Book is already borrowed by another user', 400));
    });

    it('should handle errors', async () => {
      req = { params: { id: '1', bookId: '1' } };
      const error = new Error('Database error');

      (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(error);

      await borrowBook(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('returnBook', () => {
    it('should return a book and update its score if borrow record exists', async () => {
      req = { params: { id: '1', bookId: '1' }, body: { score: 5 } };
      const borrow = { id: 1, userId: 1, bookId: 1, returnedAt: null };
      const updatedBorrow = { ...borrow, returnedAt: new Date(), userScore: 5 };

      (prismaMock.borrow.findFirst as jest.Mock).mockResolvedValue(borrow);
      (prismaMock.borrow.update as jest.Mock).mockResolvedValue(updatedBorrow);

      await returnBook(req as Request, res as Response, next);

      expect(prismaMock.borrow.findFirst).toHaveBeenCalledWith({
        where: { userId: 1, bookId: 1, returnedAt: null },
      });
      expect(prismaMock.borrow.update).toHaveBeenCalledWith({
        where: { id: borrow.id },
        data: {
          returnedAt: expect.any(Date),
          userScore: 5,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedBorrow);
    });

    it('should throw ApiError if no borrow record exists', async () => {
      req = { params: { id: '1', bookId: '1' }, body: { score: 5 } };

      (prismaMock.borrow.findFirst as jest.Mock).mockResolvedValue(null);

      await returnBook(req as Request, res as Response, next);

      expect(prismaMock.borrow.findFirst).toHaveBeenCalledWith({
        where: { userId: 1, bookId: 1, returnedAt: null },
      });
      expect(next).toHaveBeenCalledWith(new ApiError('No record of this book being borrowed by this user', 400));
    });

    it('should handle errors', async () => {
      req = { params: { id: '1', bookId: '1' }, body: { score: 5 } };
      const error = new Error('Database error');

      (prismaMock.borrow.findFirst as jest.Mock).mockRejectedValue(error);

      await returnBook(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
