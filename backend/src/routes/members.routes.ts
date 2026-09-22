import { Router } from 'express';
import {
  getMembers,
  createMember,
  updateMember,
  toggleMemberStatus,
  deleteMember,
  createMemberSchema,
  updateMemberSchema,
} from '../controllers/membersController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getMembers);
router.post('/', requireAuth, requireRole(['admin']), validate({ body: createMemberSchema }), createMember);
router.put('/:id', requireAuth, requireRole(['admin']), validate({ body: updateMemberSchema }), updateMember);
router.patch('/:id/status', requireAuth, requireRole(['admin']), toggleMemberStatus);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteMember);

export default router;
