import { Router } from 'express';
import { LeadsController } from './leads.controller';
import { validate } from '../../middleware/validate.middleware';
import { protect } from '../../middleware/auth.middleware';
import {
  createLeadSchema,
  updateLeadSchema,
  getLeadSchema,
  queryLeadsSchema,
} from './leads.validation';

const router = Router();

router.use(protect);

router.get('/stats', LeadsController.getDashboardStats);
router.get('/', validate(queryLeadsSchema), LeadsController.getLeads);
router.get('/:id', validate(getLeadSchema), LeadsController.getLeadById);
router.post('/', validate(createLeadSchema), LeadsController.createLead);
router.put('/:id', validate(updateLeadSchema), LeadsController.updateLead);
router.delete('/:id', validate(getLeadSchema), LeadsController.deleteLead);

export const leadsRoutes = router;
