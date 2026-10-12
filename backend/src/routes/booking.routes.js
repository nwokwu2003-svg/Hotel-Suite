import { Router } from 'express';
import {
    createBooking,
    getBookings,
    updateBooking
} from '../controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/', createBooking);
router.get('/admin', requireAuth, getBookings);
router.patch('/admin/:id', requireAuth, updateBooking);
export default router;