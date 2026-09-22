import { Router } from 'express';
import authRoutes from './auth.routes';
import clubsRoutes from './clubs.routes';
import membersRoutes from './members.routes';
import eventsRoutes from './events.routes';
import registrationsRoutes from './registrations.routes';
import formsRoutes from './forms.routes';
import reviewsRoutes from './reviews.routes';
import venuesRoutes from './venues.routes';
import uploadRoutes from './upload.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// API Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'unisync-campus-api',
    timestamp: new Date().toISOString(),
  });
});

// Route Mounts
router.use('/auth', authRoutes);
router.use('/clubs', clubsRoutes);
router.use('/members', membersRoutes);
router.use('/events', eventsRoutes);
router.use('/registrations', registrationsRoutes);
router.use('/events/:eventId/registrations', registrationsRoutes);
router.use('/events/:eventId/form', formsRoutes);
router.use('/forms', formsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/venues', venuesRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
