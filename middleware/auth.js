const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify JWT token from Authorization header.
 * If valid, attaches decoded payload to req.user.
 * Responds with 401 if token missing or malformed.
 * Responds with 403 if token invalid or expired.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token payload to request object
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to allow access only to admin users.
 * Depends on verifyToken middleware.
 * Checks req.user.role === 'admin'.
 * Responds with 403 if user is not admin.
 */
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
