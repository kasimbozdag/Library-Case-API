import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/ApiError';

const prisma = new PrismaClient();

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error); // Passes the error to the custom middleware
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        borrowedBooks: {
          include: {
            book: true, // Include book details
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Transform the data to the expected response format
    const pastBooks = user.borrowedBooks
      .filter((borrow) => borrow.returnedAt !== null)
      .map((borrow) => ({
        name: borrow.book.title,
        userScore: borrow.userScore,
      }));

    const presentBooks = user.borrowedBooks
      .filter((borrow) => borrow.returnedAt === null)
      .map((borrow) => ({
        name: borrow.book.title,
      }));

    const response = {
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body; // No need to check !name since validation is handled in middleware
    await prisma.user.create({ data: { name } });
    res.status(201).send();
  } catch (error) {
    next(error); // Passes the error to the custom middleware
  }
};
