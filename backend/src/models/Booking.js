import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        index: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
        index: true
    },
    checkIn: {

        type: Date,
        required: true,
        index: true
    },
    checkOut: {
        type: Date,
        required: true,
        index: true
    },
    adults: {
        type: Number,
        min: 1,
        required: true
    },
    children: {
        type: Number,
        min: 0,
        default: 0
    },
    specialRequest: {
        type: String,
        maxlength: 1000
    },
    paymentMethod: {
        type: String,
        enum: ['pay_at_hotel', 'bank_transfer', 'card'],
        default: 'pay_at_hotel'
    },
    nights: {
        type: Number,
        min: 1,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    estimatedTotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'rejected'
        ],
        default: 'pending',
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'pending', 'paid', 'refunded'],
        default: 'unpaid'
    },
    internalNotes: String
}, { timestamps: true });
schema.index({
    room: 1,
    checkIn: 1,
    checkOut: 1,
    status: 1
});
export default mongoose.model('Booking', schema);