import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus,
  updateEventBudget,
  updateEventVenue,
  deleteEvent,
  createEventSchema,
} from '../controllers/eventsController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', requireAuth, requireRole(['admin', 'club']), validate({ body: createEventSchema }), createEvent);
router.put('/:id', requireAuth, requireRole(['admin', 'club']), updateEvent);
router.patch('/:id/status', requireAuth, requireRole(['admin', 'club']), updateEventStatus);
router.patch('/:id/budget', requireAuth, requireRole(['admin', 'club']), updateEventBudget);
router.patch('/:id/venue', requireAuth, requireRole(['admin']), updateEventVenue);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteEvent);

export default router;
