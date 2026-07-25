import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes and require a valid JWT
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  // If no token was found
  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

export { protect };
