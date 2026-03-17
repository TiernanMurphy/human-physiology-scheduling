import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, major, minor, abroad, career, clubs, additional } = req.body;

        // prevent duplicate emails
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // print user input
        console.log("REGISTER BODY:", req.body);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            major,
            minor,
            abroad,
            career,
            clubs,
            additional
        });

        // save new user to MongoDB
        await newUser.save();

        // unique JWT for each user
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {  // if registration fails
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // search for email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {  // if login fails
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

export default router;