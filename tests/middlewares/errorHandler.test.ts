import { Request, Response, NextFunction } from 'express';
import { errorHandler, notFoundHandler } from '../../src/middlewares/errorHandler';
import { ApiError, NotFoundError } from '../../src/utils/ApiError';

describe('Error Handlers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('errorHandler', () => {
    it('should handle ApiError and respond with the correct status code and message', () => {
      const apiError = new ApiError('Test ApiError', 400);

      errorHandler(apiError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test ApiError' });
    });

    it('should handle generic Error and respond with 500 Internal Server Error', () => {
      const error = new Error('Test Error');

      console.error = jest.fn(); // Mock console.error

      errorHandler(error, req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(error.stack);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('notFoundHandler', () => {
    it('should handle NotFoundError and respond with 404 Not Found', () => {
      const notFoundError = new NotFoundError('Resource not found');

      notFoundHandler(notFoundError, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
    });

    it('should pass the error to the next middleware if it is not a NotFoundError', () => {
      const error = new Error('Generic Error');

      notFoundHandler(error, req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
