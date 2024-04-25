import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ 
            id: user._id, 
            email: user.email 
        //}, process.env.JWT_SECRET, { expiresIn: '1h' });
        }, process.env.JWT_SECRET);

        //console.log({token, email});
        return res.json({
            token, 
            email,
            user: {
                id: user._id,
                role: user.role,
            }
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message});
    }
};

export default login;