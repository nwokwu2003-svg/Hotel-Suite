import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    type: {
        type: String,
        required: true
    },
    description: String,
    pricePerNight: {
        type: Number,
        required: true,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    bedType: String,
    size: String,
    amenities: [String],
    images: [String],
    status: {
        type: String,
        enum: ['available', 'unavailable', 'maintenance'],
        default: 'available'
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
export default mongoose.model('Room', schema);