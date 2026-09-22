import { Router } from 'express';
import { getVenues } from '../controllers/venuesController';

const router = Router();

router.get('/', getVenues);

export default router;
