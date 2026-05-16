import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/apiResponse';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    sendResponse(res, 400, `Validation Error: ${errors}`);
    return;
  }

  if (err instanceof AppError) {
    sendResponse(res, err.statusCode, err.message);
    return;
  }

  // Mongoose duplicate key error
  if ('code' in err && (err as { code?: number }).code === 11000) {
    sendResponse(res, 409, 'Duplicate field value entered');
    return;
  }

  console.error('ERROR 💥:', err);
  sendResponse(res, 500, 'Internal Server Error');
};
