import mongoose, { Schema } from 'mongoose';
import { ILead } from '../../types';

interface ILeadDocument extends Omit<ILead, '_id'>, mongoose.Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Indexing for advanced search & filtering performance
leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
