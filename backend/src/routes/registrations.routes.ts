import { Router } from 'express';
import {
  getEventRegistrations,
  registerForEvent,
  updateRegistrationStatus,
  registerEventSchema,
} from '../controllers/registrationsController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router({ mergeParams: true });

router.get('/', getEventRegistrations);
router.post('/', validate({ body: registerEventSchema }), registerForEvent);
router.patch('/:id/status', requireAuth, requireRole(['admin', 'club']), updateRegistrationStatus);

export default router;
