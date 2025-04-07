import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    // Check if session exists
    if (req.session && req.session.userId) {
        // Retrieve user from the database
        req.user = await User.findById(req.session.userId).select('-password'); // Exclude password
        if (req.user) {
            return next(); // User authenticated, continue to next middleware/controller
        }
    }
    res.status(401);
    throw new Error('Not authorized, please log in.');
});
const admin = (req, res, next) => {
  // Assuming you have the user details in the session
  if (req.session.userId && req.session.isAdmin) {
    next(); // User is authenticated and is an admin
  } else {
    res.status(403); // Forbidden
    throw new Error('Not Authorized as an admin');
  }
};

export { protect, admin };
