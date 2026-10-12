import Room from '../models/Room.js';
export async function getAvailableRooms(_, res) {
    res.json(await Room.find({
            status: 'available'
        })
        .lean())
}