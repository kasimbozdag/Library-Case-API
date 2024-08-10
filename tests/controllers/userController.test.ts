import { Request, Response, NextFunction } from 'express';
import { getUsers, getUser, createUser } from '../../src/controllers/userController';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../src/utils/ApiError';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('User Controller', () => {
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

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
      (prismaMock.user.findMany as jest.Mock).mockResolvedValue(users);

      await getUsers(req as Request, res as Response, next);

      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors and pass them to next', async () => {
      const error = new Error('Database error');
     (prismaMock.user.findMany as jest.Mock).mockRejectedValue(error);

      await getUsers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUser', () => {
    it('should return a user with past and present borrowed books', async () => {
      req = { params: { id: '1' } };
      const user = {
        id: 1,
        name: 'John Doe',
        borrowedBooks: [
          {
            returnedAt: new Date(),
            userScore: 5,
            book: { title: 'I, Robot' },
          },
          {
            returnedAt: null,
            book: { title: 'Brave New World' },
          },
        ],
      };
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);

      await getUser(req as Request, res as Response, next);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          borrowedBooks: {
            include: { book: true },
          },
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'John Doe',
        books: {
          past: [{ name: 'I, Robot', userScore: 5 }],
          present: [{ name: 'Brave New World' }],
        },
      });
    });

    it('should throw NotFoundError if user is not found', async () => {
      req = { params: { id: '999' } };
      (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await getUser(req as Request, res as Response, next);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          borrowedBooks: {
            include: { book: true },
          },
        },
      });
      expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });

    it('should handle errors and pass them to next', async () => {
      req = { params: { id: '1' } };
      const error = new Error('Database error');
      (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(error);

      await getUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createUser', () => {
    it('should create a new user and return 201 status', async () => {
      req = { body: { name: 'John Doe' } };

      await createUser(req as Request, res as Response, next);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { name: 'John Doe' },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors and pass them to next', async () => {
      req = { body: { name: 'John Doe' } };
      const error = new Error('Database error');
      (prismaMock.user.create as jest.Mock).mockRejectedValue(error);

      await createUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
