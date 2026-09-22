import { Router } from 'express';
import {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  createClubSchema,
  updateClubSchema,
} from '../controllers/clubsController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getClubs);
router.get('/:id', getClubById);
router.post('/', requireAuth, requireRole(['admin']), validate({ body: createClubSchema }), createClub);
router.put('/:id', requireAuth, requireRole(['admin', 'club']), validate({ body: updateClubSchema }), updateClub);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteClub);

export default router;
