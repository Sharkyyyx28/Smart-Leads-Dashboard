import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';

export class AuthController {
  public static register = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    sendResponse(res, 201, 'User registered successfully', result);
  });

  public static login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    sendResponse(res, 200, 'Login successful', result);
  });

  public static getMe = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, 200, 'Current user retrieved successfully', req.user);
  });
}
