import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes by verifying JWT
export const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token string
            token = req.headers.authorization.split(' ')[1];

            // Verify token and decode payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB (excluding password)
            req.user = await User.findById(decoded.user.id).select('-password');

            // Proceed to next middleware or route
            next();
        } catch (error) {
            console.log('Token verification failed', error);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please login again' });
            }

            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // No token found in request headers
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if the authenticated user is an admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
