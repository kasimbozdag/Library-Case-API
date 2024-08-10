import { Request, Response, NextFunction } from 'express';
import { getUsers, getUser, createUser } from '../../src/controllers/userController';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../src/utils/ApiError';

// Create a new mock PrismaClient for each test file
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
        };
        next = jest.fn();
    });

    afterEach(() => {
        // Clear all mocks after each test to ensure clean slate
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            const users = [{ id: 1, name: 'John Doe' }];
            (prismaMock.user.findMany as jest.Mock).mockResolvedValue(users);

            await getUsers(req as Request, res as Response, next);

            expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            (prismaMock.user.findMany as jest.Mock).mockRejectedValue(error);

            await getUsers(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUser', () => {
        it('should return a user if found', async () => {
            req = { params: { id: '1' } };
            const user = { id: 1, name: 'John Doe', borrowedBooks: [] };
            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);

            await getUser(req as Request, res as Response, next);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { borrowedBooks: true },
            });
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should throw NotFoundError if user is not found', async () => {
            req = { params: { id: '999' } };
            (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

            await getUser(req as Request, res as Response, next);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
                include: { borrowedBooks: true },
            });
            expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
        });

        it('should handle errors', async () => {
            req = { params: { id: '1' } };
            const error = new Error('Database error');
            (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(error);

            await getUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            req = { body: { name: 'Jane Doe' } };
            const newUser = { id: 1, name: 'Jane Doe' };
            (prismaMock.user.create as jest.Mock).mockResolvedValue(newUser);

            await createUser(req as Request, res as Response, next);

            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: { name: 'Jane Doe' },
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });

        it('should handle errors', async () => {
            req = { body: { name: 'Jane Doe' } };
            const error = new Error('Database error');
            (prismaMock.user.create as jest.Mock).mockRejectedValue(error);

            await createUser(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
