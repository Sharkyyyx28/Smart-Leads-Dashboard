import { Request, Response } from 'express';
import { LeadsService } from './leads.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { AppError } from '../../utils/AppError';

export class LeadsController {
  public static getLeads = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const result = await LeadsService.getLeads(req.user, req.query);

    if (req.query.export === 'true') {
      const leads = ('leads' in result ? result.leads : []) as Array<{
        name: string;
        email: string;
        status: string;
        source: string;
        createdAt: Date;
      }>;

      const csvHeaders = ['Name', 'Email', 'Status', 'Source', 'Created At'];
      const csvRows = leads.map((lead) => [
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${new Date(lead.createdAt).toISOString()}"`,
      ]);

      const csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
      res.status(200).send(csvContent);
      return;
    }

    if ('meta' in result) {
      sendResponse(res, 200, 'Leads retrieved successfully', result.leads, result.meta);
    } else {
      sendResponse(res, 200, 'Leads retrieved successfully', result.leads);
    }
  });

  public static getLeadById = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const lead = await LeadsService.getLeadById(req.user, req.params.id);
    sendResponse(res, 200, 'Lead retrieved successfully', lead);
  });

  public static createLead = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const lead = await LeadsService.createLead(req.user, req.body);
    sendResponse(res, 201, 'Lead created successfully', lead);
  });

  public static updateLead = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const lead = await LeadsService.updateLead(req.user, req.params.id, req.body);
    sendResponse(res, 200, 'Lead updated successfully', lead);
  });

  public static deleteLead = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);
    await LeadsService.deleteLead(req.user, req.params.id);
    sendResponse(res, 200, 'Lead deleted successfully');
  });

  public static getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const stats = await LeadsService.getDashboardStats(req.user);
    sendResponse(res, 200, 'Dashboard stats retrieved successfully', stats);
  });
}
