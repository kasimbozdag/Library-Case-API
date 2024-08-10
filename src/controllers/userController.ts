import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

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
      include: { borrowedBooks: true },
    });
    if (!user) {
      throw new ApiError('User not found', 404); // Throws a 404 if the user is not found
    }
    res.json(user);
  } catch (error) {
    next(error); // Passes the error to the custom middleware
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body; // No need to check !name since validation is handled in middleware
    const newUser = await prisma.user.create({ data: { name } });
    res.status(201).json(newUser);
  } catch (error) {
    next(error); // Passes the error to the custom middleware
  }
};
