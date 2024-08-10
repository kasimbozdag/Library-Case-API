import { validateUser, validateBook, validateBorrow, validateReturn } from '../../src/middlewares/validators';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

jest.mock('express-validator', () => {
  const originalModule = jest.requireActual('express-validator');
  return {
    ...originalModule,
    validationResult: jest.fn(),
  };
});

describe('Validation Middleware', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should pass validation if name is a string', async () => {
      req.body = { name: 'John Doe' };
      (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true });

      await validateUser[1](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if name is not a string', async () => {
      req.body = { name: 123 };
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Name must be a string' }],
      });

      await validateUser[1](req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: 'Name must be a string' }],
      });
    });
  });

  describe('validateBook', () => {
    it('should pass validation if title is a string', async () => {
      req.body = { title: 'Book Title' };
      (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true });

      await validateBook[1](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if title is not a string', async () => {
      req.body = { title: 123 };
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Title must be a string' }],
      });

      await validateBook[1](req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: 'Title must be a string' }],
      });
    });
  });

  describe('validateBorrow', () => {
    it('should pass validation if id and bookId are integers', async () => {
      req.params = { id: '1', bookId: '1' };
      (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true });

      await validateBorrow[2](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if id or bookId is not an integer', async () => {
      req.params = { id: 'abc', bookId: '1' };
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'User ID must be an integer' }],
      });

      await validateBorrow[2](req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: 'User ID must be an integer' }],
      });
    });
  });

  describe('validateReturn', () => {
    it('should pass validation if id, bookId are integers and score is between 1 and 5', async () => {
      req.params = { id: '1', bookId: '1' };
      req.body = { score: 5 };
      (validationResult as unknown as jest.Mock).mockReturnValue({ isEmpty: () => true });

      await validateReturn[3](req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation if score is not between 1 and 5', async () => {
      req.params = { id: '1', bookId: '1' };
      req.body = { score: 6 };
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Score must be an integer between 1 and 5' }],
      });

      await validateReturn[3](req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: 'Score must be an integer between 1 and 5' }],
      });
    });

    it('should fail validation if id or bookId is not an integer', async () => {
      req.params = { id: 'abc', bookId: '1' };
      req.body = { score: 3 };
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'User ID must be an integer' }],
      });

      await validateReturn[3](req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: 'User ID must be an integer' }],
      });
    });
  });
});
