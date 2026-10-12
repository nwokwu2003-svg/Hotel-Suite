import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
        email: String(email).toLowerCase(),
        active: true
    }).select('+passwordHash');
    if (!user || !await bcrypt.compare(password || '', user.passwordHash))
        return res.status(401).json({
            message: 'Invalid email or password.'
        });
    const token = jwt.sign({
        id: user.id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '8h'
    });
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}