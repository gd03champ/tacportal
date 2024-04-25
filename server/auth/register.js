import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();

const register = async (req, res) => {
    try {
        const { 
            email, 
            password, 
            rollno, 
            name,
            role, 
            department 
        } = req.body;

        const existingUser = await User.findOne({ email }).exec() || await User.findOne({ rollno }).exec();
        //if (err) return next(err);
        if (existingUser) {
        return res.status(422).json({ message: 'mail or rollno already exists' });
        }
            
        const saltRounds = 10;
        const newUser = new User({ 
            email, 
            password: bcrypt.hashSync(password, saltRounds),
            role,
            rollno,
            name,
            department
        });

        await newUser.save();
        const token = jwt.sign({ 
            id: newUser._id, 
            email: newUser.email 
        }, process.env.JWT_SECRET);
        return res.json({token, email});
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message});
    }
};

export default register;