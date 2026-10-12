import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from '../config/database.js';
import authRoutes from '../routes/auth.routes.js';
import roomRoutes from '../routes/room.routes.js';
import bookingRoutes from '../routes/booking.routes.js';
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN ?
        .split(',') || true
}));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use((error, _, res, __) => {
    console.error(error);
    res.status(500).json({ message: 'An unexpected server error occurred.' })
});
connectDatabase().then(() =>
        app.listen(process.env.PORT || 5000, () =>
            console.log(`API listening on ${process.env.PORT||5000}`)))
    .catch(error => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1)
    });