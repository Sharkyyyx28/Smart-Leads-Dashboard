import mongoose, { Schema } from 'mongoose';
import { IUser } from '../../types';

interface IUserDocument extends Omit<IUser, '_id'>, mongoose.Document {
  passwordHash: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['Admin', 'Sales User'], default: 'Sales User' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserDocument>('User', userSchema);
