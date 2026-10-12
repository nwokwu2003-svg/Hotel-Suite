import crypto from 'node:crypto';
import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
import Room from '../models/Room.js';
import Notification from '../models/Notification.js';
const midnight = v => {


    const d = new Date(v);
    d.setUTCHours(0, 0, 0, 0);
    return d
};
const ref = () => `HTL-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${
crypto.randomBytes(2).toString('hex').toUpperCase()}`;
export async function createBooking(req, res) {
    const {
        fullName,
        phone,
        email,
        roomId,
        checkIn: inRaw,
        checkOut: outRaw,
        adults,
        children = 0,
        specialRequest,
        paymentMethod
    } = req.body;
    const checkIn = midnight(inRaw),
        checkOut = midnight(outRaw),
        adultCount = Number(adults),
        childCount = Number(children);
    if (!fullName || !phone || !email || !roomId || !Number.isFinite(checkIn.getTime()) || !Number.isFinite(checkOut.getTime()))
        return res.status(400).json({

            message: 'Please provide all required booking details.'
        });
    if (checkIn < midnight(new Date()) || checkOut <= checkIn)
        return res.status(400).json({

            message: 'Please choose valid future stay dates.'
        });
    if (!Number.isInteger(adultCount) || adultCount < 1 || !Number.isInteger(childCount) || childCount < 0)
        return res.status(400).json({

            message: 'Guest numbers are invalid.'
        });
    const room = await Room.findOne({

        _id: roomId,
        status: 'available'
    });
    if (!room)
        return res.status(409).json({
            message: 'This room is currently unavailable.'
        });
    if (adultCount + childCount > room.capacity)
        return res.status(400).json({
            message: 'This room cannot accommodate that number of guests.'
        });
    const conflict = await Booking.exists({
        room: room._id,
        status: { $in: ['pending', 'confirmed', 'checked_in'] },
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
    });
    if (conflict) return res.status(409).json({
        message: 'This room was just reserved for those dates. Please choose another room.'
    });
    const customer = await Customer.findOneAndUpdate({
        email: email.toLowerCase()
    }, {
        $set: {
            fullName,
            phone
        }
    }, {


        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    });
    const nights = Math.round((checkOut - checkIn) / 86400000);
    const booking = await Booking.create({


        reference: ref(),
        customer: customer._id,
        room: room._id,
        checkIn,
        checkOut,
        adults: adultCount,
        children: childCount,
        specialRequest,
        paymentMethod,
        nights,
        pricePerNight: room.pricePerNight,
        estimatedTotal: nights * room.pricePerNight
    });
    await Notification.create({
        booking: booking._id,
        type: 'new_booking',
        recipient: process.env.WHATSAPP_RECIPIENT_NUMBER || '',
        payload: {
            reference: booking.reference,
            guest: customer.fullName,
            room: room.name
        },
        status: 'queued'
    });
    res.status(201).json({
        reference: booking.reference,
        status: booking.status,
        estimatedTotal: booking.estimatedTotal
    })
}
export async function getBookings(_, res) {

    res.json(await Booking.find().populate('customer room').sort({ createdAt: -1 }).lean())
}
export async function updateBooking(req, res) {
    const allowed = ['status', 'paymentStatus', 'internalNotes'];
    const update = Object.fromEntries(allowed.filter(k => k in req.body).map(k => [k, req.body[k]]));
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
        $set: update
    }, {
        new: true,
        runValidators: true
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json(booking)
}