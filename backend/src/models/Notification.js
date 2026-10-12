import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        index: true
    },
    channel: {
        type: String,
        enum: ['whatsapp', 'email'],
        default: 'whatsapp'
    },
    type: {
        type: String,
        enum: ['new_booking', 'confirmation', 'cancellation', 'reminder', 'check_in_reminder'],
        required: true
    },
    recipient: String,
    payload: mongoose.Schema.Types.Mixed,
    status: {
        type: String,
        enum: ['queued', 'sent', 'failed'],
        default: 'queued'
    },
    error: String
}, {
    timestamps: true
});
export default mongoose.model('Notification', schema);