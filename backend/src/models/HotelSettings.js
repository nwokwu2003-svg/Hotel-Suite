import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true,
        default: 'Hotel-Suite'
    },
    logoUrl: String,
    address: {
        type: String,
        default: 'Editable before launch'
    },
    phone: String,
    email: String,
    whatsappNumber: String,
    currency: {
        type: String,
        default: 'USD'
    },
    checkInTime: {
        type: String,
        default: '15:00'
    },
    checkOutTime: {
        type: String,
        default: '11:00'
    },
    bookingPolicy: String,
    socialLinks: {
        instagram: String,
        facebook: String,
        x: String
    }
}, {
    timestamps: true
});
export default mongoose.model('HotelSettings', schema);