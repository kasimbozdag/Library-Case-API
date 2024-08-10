import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

const prisma = new PrismaClient();

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.id);
    const bookId = Number(req.params.bookId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new ApiError('Book not found', 404);
    }

    const existingBorrow = await prisma.borrow.findFirst({
      where: { bookId, returnedAt: null },
    });
    if (existingBorrow) {
      throw new ApiError('Book is already borrowed by another user', 400);
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
      },
    });

    res.status(201).json(borrow);
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.id);
    const bookId = Number(req.params.bookId);
    const { score } = req.body;

    const borrow = await prisma.borrow.findFirst({
      where: { userId, bookId, returnedAt: null },
    });
    if (!borrow) {
      throw new ApiError(
        'No record of this book being borrowed by this user',
        400,
      );
    }

    const updatedBorrow = await prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnedAt: new Date(),
        userScore: score,
      },
    });

    res.status(200).json(updatedBorrow);
  } catch (error) {
    next(error);
  }
};
