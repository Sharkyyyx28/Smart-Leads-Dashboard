import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { config } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { IUser, UserRole } from '../../types';

interface AuthResult {
  user: IUser;
  token: string;
}

export class AuthService {
  private static generateToken(id: string, role: UserRole): string {
    return jwt.sign({ id, role }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  public static async register(data: { name: string; email: string; password: string; role?: UserRole }): Promise<AuthResult> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || 'Sales User',
    });

    const userObj: IUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };

    const token = this.generateToken(user._id.toString(), userObj.role);

    return { user: userObj, token };
  }

  public static async login(data: { email: string; password: string }): Promise<AuthResult> {
    const user = await User.findOne({ email: data.email }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const userObj: IUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    };

    const token = this.generateToken(user._id.toString(), userObj.role);

    return { user: userObj, token };
  }
}
