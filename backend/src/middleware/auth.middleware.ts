import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';
import { User } from '../modules/auth/user.model';
import { IJwtPayload, UserRole } from '../types';

export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as IJwtPayload;

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    req.user = {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role as UserRole,
    };

    next();
  } catch (error) {
    next(new AppError('Not authorized, token failed', 401));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(`User role ${req.user?.role} is not authorized to access this route`, 403));
      return;
    }
    next();
  };
};
