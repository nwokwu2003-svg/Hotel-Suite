import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Room from './models/Room.js';
import User from './models/User.js';
import HotelSettings from './models/HotelSettings.js';

await mongoose.connect(process.env.MONGODB_URI);
const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
await User.updateOne({
    email: process.env.ADMIN_EMAIL.toLowerCase()
}, {
    $set: {
        name: 'Hotel Administrator',
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: 'owner',
        active: true
    }
}, { upsert: true });
await HotelSettings.updateOne({}, {
    $setOnInsert: {
        hotelName: 'Hotel-Suite',
        address: 'Ikwo L.G.A Ebonyi State',
        currency: 'Naira',
        checkInTime: '8:00',
        checkOutTime: '11:00'
    }

}, { upsert: true });
const rooms = [{
        name: 'The Classic King',
        slug: 'classic-king',
        type: 'Classic',
        pricePerNight: 180,
        capacity: 2,
        bedType: 'King bed',
        size: '32 m²',
        amenities: ['Wi-Fi', 'Breakfast', 'Air conditioning'],
        featured: true
    },
    {
        name: 'The Garden Suite',
        slug: 'garden-suite',
        type: 'Suite',
        pricePerNight: 310,
        capacity: 3,
        bedType: 'King + lounge',
        size: '55 m²',
        amenities: ['Wi-Fi', 'Breakfast', 'Garden view'],
        featured: true
    },
    {
        name: 'The Residence',
        slug: 'residence',
        type: 'Signature',
        pricePerNight: 460,
        capacity: 4,
        bedType: 'Two bedrooms',
        size: '88 m²',
        amenities: ['Wi-Fi', 'Breakfast', 'Living room']
    }
];
for (const room of rooms) await Room.updateOne({
    slug: room.slug
}, {
    $set: room
}, {
    upsert: true
});
console.log('Seed complete.');
await mongoose.disconnect();