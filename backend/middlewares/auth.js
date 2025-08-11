import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'devrefresh',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
}; 