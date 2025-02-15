import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError, NotFoundError } from '../utils/ApiError';

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
      throw new NotFoundError('User not found');
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    const existingBorrow = await prisma.borrow.findFirst({
      where: { bookId, returnedAt: null },
    });
    if (existingBorrow) {
      throw new ApiError('Book is already borrowed by another user', 400);
    }

    await prisma.borrow.create({
      data: {
        userId,
        bookId,
      },
    });

    res.status(204).send();
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

    await prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnedAt: new Date(),
        userScore: score,
      },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
