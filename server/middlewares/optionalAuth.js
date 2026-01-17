import jwt from 'jsonwebtoken';

/**
 * Optional Authentication Middleware
 * Allows routes to work with both authenticated and unauthenticated users
 * If token is present and valid, sets req.user
 * If token is missing or invalid, sets req.user = null and continues
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  // No token provided - continue as unauthenticated user
  if (!token) {
    req.user = null;
    return next();
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    // Invalid token - continue as unauthenticated user
    req.user = null;
    next();
  }
};

export default optionalAuth;
