import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';
import User from '../models/User.js';

const router = express.Router();

// admin dashboard route
router.get('/dashboard', auth, isAdmin, (req, res) => {
    res.status(200).json({
        message: 'Welcome to admin dashboard',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin
        }
    });
});

// get user data to show admin
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')  // don't get passwords
            .sort({ createdAt: -1 });  // sort by account creation time 

        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// get user's saved plans
router.get('/users/:userId/plans', auth, isAdmin, async (req, res) => {
    try {
        const Plan = (await import('../models/Plan.js')).default;

        const plans = await Plan.find({ userId: req.params.userId })
            .sort({ updatedAt: -1 });

        res.status(200).json({ plans });
    } catch (error) {
        console.error('Error fetching user plans:', error);
        res.status(500).json({ message: 'Error fetching plans' });
    }
});

export default router;