import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    fullName: {

        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    notes: String
}, {
    timestamps: true
});
export default mongoose.model('Customer', schema);