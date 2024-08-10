import { ApiError, NotFoundError, ValidationError, InternalServerError } from '../../src/utils/ApiError';

describe('ApiError', () => {
  it('should create an ApiError with a message and status code', () => {
    const error = new ApiError('Test error', 400);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.stack).toBeDefined();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });

  it('should log the error message and status code when an ApiError is created', () => {
    console.log = jest.fn();
    new ApiError('Test error with log', 500);
    expect(console.log).toHaveBeenCalledWith('ApiError', 'Test error with log', 500);
  });
});

describe('NotFoundError', () => {
  it('should create a NotFoundError with a default message and status code 404', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.stack).toBeDefined();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('should create a NotFoundError with a custom message and status code 404', () => {
    const error = new NotFoundError('Custom not found message');
    expect(error.message).toBe('Custom not found message');
    expect(error.statusCode).toBe(404);
  });
});

describe('ValidationError', () => {
  it('should create a ValidationError with a default message and status code 400', () => {
    const error = new ValidationError();
    expect(error.message).toBe('Validation error');
    expect(error.statusCode).toBe(400);
    expect(error.stack).toBeDefined();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('should create a ValidationError with a custom message and status code 400', () => {
    const error = new ValidationError('Custom validation error');
    expect(error.message).toBe('Custom validation error');
    expect(error.statusCode).toBe(400);
  });
});

describe('InternalServerError', () => {
  it('should create an InternalServerError with a default message and status code 500', () => {
    const error = new InternalServerError();
    expect(error.message).toBe('Internal server error');
    expect(error.statusCode).toBe(500);
    expect(error.stack).toBeDefined();
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(InternalServerError);
  });

  it('should create an InternalServerError with a custom message and status code 500', () => {
    const error = new InternalServerError('Custom internal server error');
    expect(error.message).toBe('Custom internal server error');
    expect(error.statusCode).toBe(500);
  });
});
