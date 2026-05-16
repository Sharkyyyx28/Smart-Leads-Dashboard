import { FilterQuery, Types } from 'mongoose';
import { Lead } from './lead.model';
import { AppError } from '../../utils/AppError';
import { ILead, IUser, LeadSource, LeadStatus } from '../../types';

interface QueryParams {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'Latest' | 'Oldest';
  export?: 'true' | 'false';
}

interface PaginatedLeads {
  leads: ILead[];
  meta: {
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class LeadsService {
  private static getBaseFilter(user: IUser): FilterQuery<ILead> {
    if (user.role === 'Admin') {
      return {};
    }
    return {
      $or: [{ assignedTo: user._id }, { createdBy: user._id }],
    };
  }

  public static async getLeads(user: IUser, query: QueryParams): Promise<PaginatedLeads | { leads: ILead[] }> {
    const filter: FilterQuery<ILead> = this.getBaseFilter(user);

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search && query.search.trim() !== '') {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      });
    }

    const sortOption: Record<string, 1 | -1> = query.sort === 'Oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // If export is true, return all matching leads without pagination
    if (query.export === 'true') {
      const leads = await Lead.find(filter).sort(sortOption).populate('assignedTo', 'name email').populate('createdBy', 'name email');
      return { leads };
    }

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const pages = Math.ceil(total / limit);

    return {
      leads,
      meta: {
        total,
        page,
        pages,
        hasNextPage: page < pages,
        hasPrevPage: page > 1,
      },
    };
  }

  public static async getLeadById(user: IUser, leadId: string): Promise<ILead> {
    const filter = { ...this.getBaseFilter(user), _id: new Types.ObjectId(leadId) };
    const lead = await Lead.findOne(filter).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    if (!lead) {
      throw new AppError('Lead not found or you do not have permission to view it', 404);
    }

    return lead;
  }

  public static async createLead(user: IUser, data: Partial<ILead>): Promise<ILead> {
    const lead = await Lead.create({
      ...data,
      createdBy: user._id,
      assignedTo: data.assignedTo ? new Types.ObjectId(data.assignedTo) : user._id,
    });

    return lead.populate(['assignedTo', 'createdBy']);
  }

  public static async updateLead(user: IUser, leadId: string, data: Partial<ILead>): Promise<ILead> {
    const filter = { ...this.getBaseFilter(user), _id: new Types.ObjectId(leadId) };
    const lead = await Lead.findOneAndUpdate(filter, data, { new: true, runValidators: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!lead) {
      throw new AppError('Lead not found or you do not have permission to update it', 404);
    }

    return lead;
  }

  public static async deleteLead(user: IUser, leadId: string): Promise<void> {
    const filter = { ...this.getBaseFilter(user), _id: new Types.ObjectId(leadId) };
    const lead = await Lead.findOneAndDelete(filter);

    if (!lead) {
      throw new AppError('Lead not found or you do not have permission to delete it', 404);
    }
  }

  public static async getDashboardStats(user: IUser) {
    const filter = this.getBaseFilter(user);

    const [statusStats, sourceStats, totalLeads, recentLeads] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email'),
    ]);

    const formattedStatusStats = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };

    statusStats.forEach((item) => {
      if (item._id in formattedStatusStats) {
        formattedStatusStats[item._id as keyof typeof formattedStatusStats] = item.count;
      }
    });

    const formattedSourceStats = {
      Website: 0,
      Instagram: 0,
      Referral: 0,
    };

    sourceStats.forEach((item) => {
      if (item._id in formattedSourceStats) {
        formattedSourceStats[item._id as keyof typeof formattedSourceStats] = item.count;
      }
    });

    return {
      total: totalLeads,
      byStatus: formattedStatusStats,
      bySource: formattedSourceStats,
      recentLeads,
    };
  }
}
