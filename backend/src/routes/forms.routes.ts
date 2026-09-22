import { Router } from 'express';
import { getEventFormConfig, updateEventFormConfig } from '../controllers/formsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', getEventFormConfig);
router.put('/', requireAuth, requireRole(['admin', 'club']), updateEventFormConfig);

export default router;
