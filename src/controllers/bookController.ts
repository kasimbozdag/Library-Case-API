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
      const averageScore =
        book.Borrow.length > 0
          ? book.Borrow.reduce(
              (acc, borrow) => acc + (borrow.userScore || 0),
              0,
            ) / book.Borrow.length
          : null;
      return {
        id: book.id,
        title: book.title,
        averageScore,
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
    const averageScore =
      book.Borrow.length > 0
        ? book.Borrow.reduce(
            (acc, borrow) => acc + (borrow.userScore || 0),
            0,
          ) / book.Borrow.length
        : null;
    res.json({
      id: book.id,
      title: book.title,
      averageScore,
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
    const { title } = req.body;
    const newBook = await prisma.book.create({ data: { title } });
    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};
