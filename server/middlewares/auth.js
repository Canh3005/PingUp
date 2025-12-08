import authService from '../services/authService.js';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import _ from 'lodash';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    const decoded = authService.verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    const userProfile = await UserProfile.findOne({ userId: decoded.userId });
    const userWithProfile = { ...user.toObject(), profile: userProfile };
    userWithProfile.id = _.toString(userWithProfile._id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }

    req.user =  userWithProfile;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: error.message || 'Token is not valid'
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied, admin only' 
    });
  }
};


export default auth;