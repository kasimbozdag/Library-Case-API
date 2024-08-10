import { Request, Response, NextFunction } from 'express';
import { ApiError, NotFoundError } from '../utils/ApiError';

// Error handling middleware
export const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
};

// Middleware to handle 404 Not Found errors
export const notFoundHandler = (
  err: NotFoundError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  next(err);
};
