import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/ApiError';

const prisma = new PrismaClient();

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        Borrow: true, // To calculate average score
      },
    });
    const booksWithAverageScore = books.map((book) => {
      return {
        id: book.id,
        title: book.title,
      };
    });
    res.json(booksWithAverageScore);
  } catch (error) {
    next(error);
  }
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(req.params.id) },
      include: { Borrow: true },
    });
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    const returnedBorrows = book.Borrow.filter((borrow) => borrow.userScore);
    const score =
      returnedBorrows.length > 0
        ? returnedBorrows.reduce(
            (acc, borrow) => acc + (borrow.userScore || 0),
            0,
          ) / returnedBorrows.length
        : -1;
    res.json({
      id: book.id,
      name: book.title,
      score,
    });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    await prisma.book.create({ data: { title: name } });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};
