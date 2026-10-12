import { Router } from 'express';
import { getAvailableRooms }
from '../controllers/room.controller.js';
const router = Router();
router.get('/', getAvailableRooms);
export default router;