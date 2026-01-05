import User from '../models/User.js';

const isAdmin = async (req, res, next) => {
    try {
        // req.userId is set by the auth middleware
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        req.user = user; // attach full user object to request
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default isAdmin;