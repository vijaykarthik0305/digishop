import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Authenticate User & create session
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }

  // Create a session
  req.session.userId = user._id; // Store user ID in session
  req.session.isAdmin = user.isAdmin; // Store admin status in session

  // Respond with user data (without password)
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user = await User.create({ name, email, password });
  if (user) {
    // Create a session on successful registration
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid User Data');
  }
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  // Fetch user from session
  const user = await User.findById(req.session.userId);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500);
      throw new Error('Error logging out');
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, isAdmin } = req.body;

  // Find the user by ID
  const user = await User.findById(req.params.id);
  
  if (user) {
    // Update user details
    user.name = name || user.name; // If no name is provided, retain the original name
    user.email = email || user.email; // If no email is provided, retain the original email
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin; // Allow updating admin status

    const updatedUser = await user.save(); // Save the updated user

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const deleteUser = asyncHandler(async (req, res) => {
  // Find the user by ID
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove(); // Remove the user from the database
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
      res.json(user);
  } else {
      res.status(404).json({ message: 'User not found' });
  }
});

export { authUser, registerUser, getUserProfile, logoutUser,getUsers,updateUser,deleteUser,getUserById };
