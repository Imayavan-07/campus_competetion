import { Router } from 'express';
import {
  getReviews,
  addStudentReview,
  addAdminFeedback,
  addOrganizerReply,
  submitReviewSchema,
} from '../controllers/reviewsController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getReviews);
router.post('/:id/feedback', validate({ body: submitReviewSchema }), addStudentReview);
router.post('/:id/admin-feedback', requireAuth, requireRole(['admin']), addAdminFeedback);
router.post('/:id/organizer-reply', requireAuth, requireRole(['admin', 'club']), addOrganizerReply);

export default router;
